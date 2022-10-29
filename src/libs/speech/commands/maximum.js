
import * as d3 from 'd3';

// catVal: optional
// catVar: group by category, optional
const maximum = (data, variables, numVar, catVals, catVar, aggCmd) => {
    const cats = variables.filter(v => v.type === "categorical");
    catVals = catVals.map(v=>v.toLowerCase());
    const filtered = catVals.length>0? data.filter(d => cats.some(c => catVals.includes(d[c.field].toString().toLowerCase()))):data;
    if (catVar){
        const groups = d3.rollup(filtered, group => {
            // TODO: maximum total or maximum average (if no method is provided, use mean)
            // const filtered = catVal? d.filter(d => cats.some(c => d[c.field].toLowerCase() === catVal)):d;
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
        }, d => d[catVar]);
        // console.log(groups, numVar, catVar, catVals);
        const maximum = d3.greatest(groups, ([, agg]) => agg);
        return maximum;
    }
    
    const maximum = d3.greatest(filtered, d => d[numVar]);
    return maximum;

    
};

export default maximum;
