
import * as d3 from 'd3';

// catVal: optional
// catVar: group by category, optional
const sum = (data, variables, numVar, catVals) => {
    const cats = variables.filter(v => v.type === "categorical");
    catVals = catVals.map(v=>v.toLowerCase());
    const filtered = catVals.length>0? data.filter(d => cats.some(c => catVals.includes(d[c.field].toString().toLowerCase()))):data;
    const mean = d3.sum(filtered, d => d[numVar]);
    return mean;

    
};

export default sum;
