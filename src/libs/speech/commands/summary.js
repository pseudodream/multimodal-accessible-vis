// import { getArrayFromObject } from "speech-sys/utils";
import * as d3 from "d3";
import {capitalize} from "../utils";
const summary = (data, options) => {
  const { variables } = options;
  const { formatters } = options;
  const findFormatter = (formatters, field) => {
    console.log(formatters, field);
    return formatters[field] ? formatters[field] : d3.format("");
  };
  let response = `Graph with title: ${options.title}.`;

  variables.forEach((v) => {
    let subtext;
    if (v.type === "numerical") {
      const range = d3.extent(data, (d) => d[v.field]);
      const formatter = findFormatter(formatters, v.field);
      subtext = `ranging from ${formatter(range[0])} to ${formatter(range[1])}`;
    } else {
      // const groups = d3.group(datasource, d => d[field]);
      // const domain = Array.from(groups.keys()); // unique categories

      //   console.log(d3.group(data, (d) => d[v.field]));
      const range = Array.from(d3.group(data, (d) => d[v.field]).keys());
      
      subtext = `including ${range.join(", ")}`;//[0]} to ${range[range.length - 1]}`;
    }
    response += ` ${capitalize(v.encoding)} represents ${v.label}, ${subtext}.`;
  });

  return response;
};

export default summary;
