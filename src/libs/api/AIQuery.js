import { basicQuery } from "./queries";

const wh_keywords = "(what)|(when)|(where)|(who)|(whom)|(which)|(whose)";
var terminologies = [];

const charts = [
  "bar chart",
  "barchart",
  "stacked barchart",
  "chart",
  "scatter plot",
  "scatterplot",
  "plot",
  "map",
  "linechart",
  "line chart",
];
//add all categorical variables for the charts
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weather = ["sun", "fog", "drizzle", "rain", "snow", "seattle"];
const company = [
  "apple",
  "google",
  "amazon",
  "ibm",
  "microsoft",
  "stock",
  "stock price",
];
const country = ["life expectancy"];
terminologies = months + weather + charts + company + country;

//build regex
//terminlogy/domain related questions
const term1 = new RegExp(".*(mean by)", "i");
const term2 = new RegExp("(how).*defin", "i");
const term3 = new RegExp(`${wh_keywords}.*(is|are)`, "i");
const term4 = new RegExp("why", "i");

async function AIQuery(question) {
  console.log(terminologies);
  console.log("passing to filter for ai");
  console.log(question);
  var flag = false;
  if (
    term1.test(question) |
    term2.test(question) |
    term3.test(question) |
    term4.test(question)
  ) {
    for (const word of terminologies) {
      console.log(word);
      if (question.includes(word)) {
        flag = true;
        break;
      }
    }
  }

  if (flag === true) {
    console.log("passing the question to OpenAI");
    const response = basicQuery(question).then((data) => {
      return data;
    });
    console.log("res" + response);
    return response;
  } else {
    return `I heard you say "${question}". Command not recognized. Please try again.`;
  }
}

export default AIQuery;
