import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import vegaDatasets from "vega-datasets"; // no types
import { VegaLite } from "react-vega";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
// import spec from 'charts/stacked-barchart.json';
import spec from "charts/tutorial.json";

const formatter = d3.format(",");
// spec = JSON.parse(JSON.stringify(spec));
// spec.description = `A horizontal bar chart showing Covid-19 Cases by country and continent as of June 27, 2022. A vertical axis shows bars representing different countries from United States to Netherlands. The length of the bars is mapped to the number of covid cases along the horizontal axis, while their color represents its corresponding continent such as America, Asia, and Europe.`;
// const spec = {
//     "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//     "data": { "name": "table" },
//     "encoding": {
//       "y": {"field": "country", "type": "nominal", "sort": "-x", "axis": {"title":"Country"}},
//       "x": {"field": "cases", "type": "quantitative", "axis":{"format":".2s", "title":"Total Covid-19 Cases"}},
//       "color": {"field":"continent", "legend":{"title":"Continent"}}
//     },
//     "mark": "bar"
//     // "layer": [{
//     //   "mark": "bar"
//     // }, {
//     //   "mark": {
//     //     "type": "text",
//     //     "align": "left",
//     //     "baseline": "middle",
//     //     "dx": 3
//     //   },
//     //   "encoding": {
//     //     "text": {"field": "cases", "type": "quantitative", "format":".2s"}
//     //   }
//     // }]
//   }

// spec.width = 600;
// spec.height = 400;

function BasicTutorial(props) {
  // const [chartData, setChartData] = useState({});
  const [tableData, setTableData] = useState([]);

  // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  async function loadData() {
    // const chartData = await d3.csv('datasets/covid-world.csv');
    // console.log('chartData', chartData);
    // processing data to the view data format
    // chartData.forEach(d => {// get months
    //     d.month = months[d.date.getMonth()].slice(0, 3);
    // });
    // const grouped = d3.flatRollup(chartData, v => v.length, d => d.weather, d => d.month);
    const tableData = spec.data.values; //grouped.map(([weather, month, count]) => ({ weather, month, count }));

    // setChartData({ table: chartData });
    setTableData(tableData);

    // console.log('tableData', tableData);

    console.log("spec", spec);
  }

  useEffect(() => {
    // load dataset
    loadData();
  }, []);
  const comparators = {
    country: {
      asc: d3.ascending,
      desc: d3.descending,
    },
    continent: {
      asc: d3.ascending,
      desc: d3.descending,
    },
    cases: {
      asc: d3.ascending,
      desc: d3.descending,
    },
  };
  const headCells = [
    {
      id: "country",
      numeric: false,
      disablePadding: false,
      label: "Country",
    },
    {
      id: "continent",
      numeric: false,
      disablePadding: false,
      label: "Continent",
    },
    {
      id: "cases",
      numeric: true,
      disablePadding: false,
      label: "Total Cases",
    },
  ];
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleSort = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    if (props.onLog){
      props.onLog("sort",{property,order:isAsc ? "desc" : "asc" }, new Date().toISOString() );
    }
    setTableData((prevTableData) => {
      const order = isAsc ? "desc" : "asc";

      const comparator = comparators[property][order];
      // console.log("comparator", comparator);
      const newTableData = prevTableData.slice().sort((a, b) => {
        return comparator(a[property], b[property]);
      });

      return newTableData;
    });
  };
  return (
    <Box mt={5}>
      {/* <div className="chart" ref={chartEl}></div>
       */}
      {/* <Typography variant="h6" mb={3}>Total Covid-19 Cases by Country as of June 27, 2022 <small>(Data source: Google)</small></Typography> */}
      <VegaLite spec={spec} actions={false} />
      <TableContainer sx={{ marginTop: 5 }}>
        <Table aria-label="Data">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "normal"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={handleSort(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData &&
              tableData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.country}</TableCell>
                  <TableCell>{d.continent}</TableCell>
                  <TableCell align="right">{formatter(d.cases)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BasicTutorial;
