
import * as d3 from 'd3';

// catVal: optional
// catVar: group by category, optional
const median = (data, variables, numVar, catVals) => {
    const cats = variables.filter(v => v.type === "categorical");
    catVals = catVals.map(v=>v.toLowerCase());
    const filtered =  catVals.length>0? data.filter(d => cats.some(c => catVals.includes(d[c.field].toString().toLowerCase()))):data;
    const median = d3.median(filtered, d => d[numVar]);
    return median;

    
};

export default median;
