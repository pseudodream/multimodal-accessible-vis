//Extract the command from voice text, and pass data into the corresponding command functions
import summary from "./summary";
import instructions from "./instructions";
import average from "./average";
import maximum from "./maximum";
import minimum from "./minimum";
import median from "./median";
import value from "./value";
import sum from "./sum";
import * as d3 from "d3";
import { capitalize, sanitizeInquiry } from "../utils";

export const processCommand = (voiceText, data, options) => {
  const { formatters } = options;
  const inquiry = sanitizeInquiry(voiceText); // original voiceText
  voiceText = voiceText.toLowerCase(); // not case-sensitive for now
  //manually change voice text for debug
  // voiceText = "most crookston";

  let response = null;

  // handle summary and instruction

  if (voiceText.includes("summary")) {
    // TODO: improve
    response = summary(data, options); //,"",x_var,voiceText);
    return response;
  }
  if (voiceText.includes("instruction")) {
    response = instructions(data, options); //,"",x_var,voiceText);
    return response;
  }

  // ---- (start) TODO: standardize the terms and catch synonyms, etc. (Word2vec)
  // NLP.js, POS tagger
  // TODO: replace the similar text in voiceText with a corresponding variable and data value name

  // ----- (end) TODO: standardize the terms and catch synonyms, etc. (Word2vec)

  // recognizing command types
  const { variables } = options;
  const cats = variables.filter((v) => v.type === "categorical");
  const nums = variables.filter((v) => v.type === "numerical");
  const catNames = cats.map((c) => c.label.toLowerCase()); // names of numerical variables
  const numNames = nums.map((c) => c.label.toLowerCase()); // names of numerical variables
  const aggregateCmdNames = commands
    .filter((c) => c.type === "aggregate")
    .map((c) => c.name);
  const extremaCmdNames = commands
    .filter((c) => c.type === "extrema")
    .map((c) => c.name);
  const valueCmdNames = commands
    .filter((c) => c.type === "value")
    .map((c) => c.name);
  const catValues = cats
    .map((c) =>
      data
        .map((d) => d[c.field].toString())
        .filter((d, i, a) => a.indexOf(d) === i)
    )
    .flat(); // assume unique cat values
  //TODO: improve toString() for year (number) that can be used for string...

  const findCommand = (cmdName) => {
    // finding the root command
    let cmd = commands.find((c) => c.name === cmdName);
    if (cmd.alias) {
      cmd = commands.find((c) => c.name === cmd.alias);
    }
    return cmd;
  };
  const findField = (label) => {
    // finding the data field from a label
    return variables.find((v) => v.label === label).field;
  };
  const findLabel = (field) => {
    return variables.find((v) => v.field === field).label;
  };
  const findFormatter = (formatters, field) => {
    // console.log(formatters, field);
    return formatters[field] ? formatters[field] : d3.format("");
  };
  let regex, match;
  // ============================================================================== //
  // =================== Single Categorical Lookup   Questions ==================== //
  // ============================================================================== //

  // check if this is a category look up with extrema
  // todo: handle secondary aggregate commands (maximum average, maximum total)
  // what weather type has the maximum count in January?
  // which month has the maximum (missing numeric var) for sunny days?
  // which company has the maximum price?
  // which company has the maximum (missing numeric var)?
  //TODO: catValues should only include values from the other category
  regex = new RegExp(
    `.*(${catNames.join("|")}).*(${extremaCmdNames.join("|")}).*`,
    "i"
  );
  match = voiceText.match(regex);

  if (match) {
    console.log("detected a category value lookup question");
    const cat = findField(match[1]);
    const cmd = findCommand(match[2]);
    // check if there is a numeric variable
    let numLabel = numNames.find((n) => voiceText.includes(n));
    if (!numLabel && numNames.length === 1) {
      // if no numeric value, assume the first available one.
      numLabel = numNames[0];
    }
    if (numLabel) {
      const num = findField(numLabel);
      // check if there are category value filters
      const catVals = catValues.filter((v) =>
        voiceText.includes(v.toLowerCase())
      );
      // check if there is a aggregate command, otherwise, assumes mean
      const aggCmdName = aggregateCmdNames.find((n) => voiceText.includes(n));
      const aggCmd = aggCmdName
        ? findCommand(aggCmdName)
        : findCommand("average");
      
      const formatter = findFormatter(formatters, num);
      const ans = cmd.func(data, variables, num, catVals, cat, aggCmd.name);

      response = `You asked "${inquiry}". ${capitalize(cat)} that has the ${
        cmd.name
      } ${aggCmd.name} ${numLabel} is ${
        ans[0]
      } with ${formatter(ans[1])}`;
    }
  }

  // ============================================================================================== //
  // ===================  Numeric Response Questions (Aggregate/Extrema)   =======================  //
  // ============================================================================================== //

  // check if it is a numeric inquiry (does not contain the cat variables)
  // what is the maximum count? what is the average price?
  // what is the maximum (missing numeric var)? what is the average (missing numeric var?

  const aggExtCmdNames = aggregateCmdNames.concat(extremaCmdNames);
  regex = new RegExp(
    `^(?!.*(?:${catNames.join("|")})).*(${aggExtCmdNames.join("|")}).*`,
    "i"
  );
  match = voiceText.match(regex);
  if (match) {
    console.log("detected numeric question");
    const cmd = findCommand(match[1]);
    // check if there is a numeric variable
    let numLabel = numNames.find((n) => voiceText.includes(n));
    if (!numLabel && numNames.length === 1) {
      // if no numeric value, assume the first available one.
      numLabel = numNames[0];
    }
    if (numLabel) {
      const num = findField(numLabel);
      // check if there are category value filters
      const catVals = catValues.filter((v) =>
        voiceText.includes(v.toLowerCase())
      );
      const formatter = findFormatter(formatters, num);
      const ans = cmd.func(data, variables, num, catVals, null);

      if (cmd.type === "extrema") {
        // we can identify a specific data item in this case
        response = `You asked "${inquiry}". ${capitalize(
          cmd.name
        )} ${numLabel} is ${formatter(ans[num])}, ${catNames
          .map((d) => findField(d))
          .map((d) => ans[d])
          .join(", ")}.`;
      } else {
        // aggregate value
        response = `You asked "${inquiry}". ${capitalize(
          cmd.name
        )} ${numLabel} is ${formatter(ans)}.`;
      }
    }
  }
  // what is the maximum count for sunny days? what is the average count for sunny days?
  // what is the maximum (missing numeric var) for sunny days? what is the average (value) for sunny days?

  //TODO: Not handled edge case: what is the average vaccination rate for Massachusetts? : there is no item to aggregate

  // ===================================================================================== //
  // =================== Numeric Response Questions (Value Lookup) ======================= //
  // ===================================================================================== //
  // does not contain other aggregate/extrema operations, contains at least one and at most two cat value.
  // contains either the value command name (value/data) or the numeric variable name or both
  // if the numeric variable is missing but there is one numeric variable, we assume the variable is used
  // if only contains the numeric var, we assume the value command is used
  // for a proper value lookup, the number of categories and category value filters should match

  // voiceText = "what is the count value of sunny days in January?"
  // voiceText = "what is the value of count for sunny days in January?"
  // voiceText =  "what is the count for sunny days in January?" //(missing value cmd)
  // voiceText = "what is the value of sunny days in January?" // (missing numeric var)
  // voiceText = "what is sun's count?"//  (not recognized)
  // voiceText = "how many count does sunny days have in July?";

  // can't handle this:  vaccination rate for west virginia 
  // TODO: need to separate catVals by variables
  let catVals = catValues.filter((v) => voiceText.includes(v.toLowerCase()));

  // HACK for the study
  if (catVals.includes("West Virginia") && catVals.includes("Virginia")){
    catVals = catVals.filter(d=>d==="West Virginia");
  }
  // console.log(
  //   "catVals",
  //   catValues,
  //   catVals,
  //   aggExtCmdNames.some((cmd) => voiceText.includes(cmd)),
  //   catVals.length > 0,
  //   catVals.length <= 2
  // );
  if (
    !aggExtCmdNames.some((cmd) => voiceText.includes(cmd)) &&
    catVals.length > 0 &&
    catVals.length <= 2
  ) {
    //TODO: check if catVals come from two separate category fields
    let numLabel = numNames.find((n) => voiceText.includes(n));
    let cmdName = valueCmdNames.find((cmd) => voiceText.includes(cmd));

    if (!numLabel && numNames.length === 1) {
      numLabel = numNames[0];
    }
    if (!cmdName) {
      cmdName = "value";
    }

    const num = findField(numLabel);
    const cmd = findCommand(cmdName); // we can just call value function
    const formatter = findFormatter(formatters, num);
    const ans = cmd.func(data, variables, num, ...catVals);
    console.log("cmdName, numName", cmdName, numLabel, ans);
    if (ans) {
      response = `You asked "${inquiry}". ${capitalize(numLabel)} ${
        cmd.name
      } of ${catVals.join(" and ")} is ${formatter(ans)}.`;
    }
  }

  if (response === null) {
    response = `I heard you say "${inquiry}". Command not recognized. Please try again.`;
  }
  return response;
};
// export const extractRange = (text, data, variables)=>{
//   // which field name, operator (greater, less, range), range of numbers
//   // between
//   let regex = new RegExp(
//     `.*(between).*(\d*).*`,
//     "i"
//   );

// }
export const commands = [
  // { name: "summary", func: require("./summary").default },
  // { name: "instruction", func: require("./instructions").default },
  { name: "average", type: "aggregate", func: average },
  { name: "mean", type: "aggregate", alias: "average" },
  { name: "median", type: "aggregate", func: median },
  { name: "maximum", type: "extrema", func: maximum },
  { name: "highest", type: "extrema", alias: "maximum" },
  { name: "most", type: "extrema", alias: "maximum" },
  { name: "minimum", type: "extrema", func: minimum },
  { name: "lowest", type: "extrema", alias: "minimum" },
  { name: "least", type: "extrema", alias: "minimum" },
  { name: "fewest", type: "extrema", alias: "minimum" },
  { name: "sum", type: "aggregate", func: sum },
  { name: "total", type: "aggregate", alias: "sum" },
  { name: "value", type: "value", func: value },
  { name: "data", alias: "value" },
  //   { name: "mode", func: require("./mode").default },
  //   { name: "variance", func: require("./variance").default },
  //   { name: "standard deviation", func: require("./standardDeviation").default },
];
