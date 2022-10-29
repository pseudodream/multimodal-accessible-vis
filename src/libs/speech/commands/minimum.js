import * as d3 from "d3";

// catVal: optional
// catVar: group by category, optional
const minimum = (data, variables, numVar, catVals, catVar, aggCmd) => {
  const cats = variables.filter((v) => v.type === "categorical");
  catVals = catVals.map((v) => v.toLowerCase());
  let filtered =
    catVals.length > 0
      ? data.filter((d) =>
          cats.some((c) =>
            catVals.includes(d[c.field].toString().toLowerCase())
          )
        )
      : data;
  if (catVar) {
    const groups = d3.rollup(
      filtered,
      (group) => {
        // filtered = catVal? d.filter(d => cats.some(c => d[c.field].toLowerCase() === catVal)):d;

        let agg;
        switch (aggCmd) {
          case "average":
            agg = d3.mean(group, (d) => d[numVar]);
            break;
          case "median":
            agg = d3.median(group, (d) => d[numVar]);
            break;
          case "sum":
            agg = d3.sum(group, (d) => d[numVar]);
            break;
          default:
            agg = d3.mean(group, (d) => d[numVar]);
            break;
        }

        return agg;
      },
      (d) => d[catVar]
    );
    const minimum = d3.least(groups, ([, agg]) => agg);
    return minimum;
  }

  // const filtered = catVal? data.filter(d => cats.some(c => d[c.field].toLowerCase() === catVal)):data;
  const minimum = d3.least(filtered, (d) => d[numVar]);
  return minimum;
};

export default minimum;
