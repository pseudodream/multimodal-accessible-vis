import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { compile } from "vega-lite";
import { View, parse } from "vega";
import liteSpec from "charts/scatterplot.json";
import { Vega } from "react-vega";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { navtree, prev, next, up, down } from "libs/keynav";
const formatIncome = d3.format("$,");
const formatExpectancy = (d) => `${d} years`;
function MultimodalScatterPlot(props) {
  const ariaLiveEl = useRef(null);
  //   const [chartData, setChartData] = useState({});
  const [rootNode, setRootNote] = useState();
  const [currentNode, setCurrentNode] = useState();
  const [chartView, setChartView] = useState();
  //reference:https://github.com/datawithinreach/edconnect/blob/pantherman594/modularize-chart-component/src/components/Chart.js
  const spec = useMemo(() => {
    // construct a vega spec with signals
    // liteSpec.encoding.color.

    console.log("lite spec", liteSpec);
    const clone = JSON.parse(JSON.stringify(liteSpec));
    clone.description =
      "A scatter plot showing life expectancy and income per person for 38 OECD countries in different regions.";
    clone.encoding.opacity = {
      condition: {
        test: '(length(selected) == 0) ||  indexof(selected, datum["country"]) >= 0',
        value: 1.0,
      },
      value: 0.1,
    };

    const spec = compile(clone).spec;
    console.log("Vega Spec", spec);
    spec.signals = [];
    spec.signals.push({
      name: "selected",
      value: [],
    });
    console.log(spec);
    return spec;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      //   const chartData = await d3.csv("datasets/covid-world.csv");
      //   console.log("Data", chartData);
      //   setChartData({ table: chartData });
      const datumDesc = (datum, index, field, group) => {
        return `${index + 1} of ${group.length} items. Country: ${
          datum.country
        }, Income: ${formatIncome(datum.income)}, Life Expectancy: ${
          datum.life_expectancy
        } years,  Region: ${datum.region}`;
      };
      const rootNode = await navtree(spec, {
        datumDesc,
        formatters: { income: formatIncome, life_expectancy: formatExpectancy },
      });
      console.log("scatter plot navigation tree", rootNode);
      setRootNote(rootNode);
      setCurrentNode(rootNode);
    };
    loadData();
    // document.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    // }
  }, []);

  useEffect(() => {
    if (!currentNode) {
      return;
    }
    srSpeak(currentNode.description);

    if (!chartView) {
      return;
    }

    if (currentNode.parent) {
      currentNode.parent.lastVisitedChild = currentNode;
    }

    if (props.onLog) {
      props.onLog(
        "navigate",
        {
          node: {
            ...currentNode,
            parent: undefined,
            children: undefined,
            lastVisitedChild: undefined,
          },
          title: liteSpec.title,
        },
        new Date().toISOString()
      );
    }
    console.log("====currentNode selection", currentNode.selection, currentNode.type)
    if (
      currentNode.type === "datum" ||
      currentNode.type === "numeric-subgroup" ||
      currentNode.type === "category-subgroup"
    ) {
      console.log(
        "selected datum",
        currentNode.selection.map((d) => d.country)
      );
      chartView.signal(
        "selected",
        currentNode.selection.map((d) => d.country)
      );
      chartView.runAsync();
    } else {
      chartView.signal("selected", []);

      chartView.runAsync();
    }
  }, [currentNode]);

  function srSpeak(text) {
    ariaLiveEl.current.innerHTML = text;
  }
  const handleNewView = useCallback(
    (view) => {
      console.log("new view", view);
      setChartView(view);
    },
    [chartView]
  );

  const handleKeyDown = (e) => {
    // console.log("key", e.key, currentNode, rootNode);

    switch (e.key) {
      case "a":
      case "ArrowLeft":
        setCurrentNode((currentNode) => prev(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;
      case "d":
      case "ArrowRight":
        setCurrentNode((currentNode) => next(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;
      case "w":
      case "ArrowUp":
        setCurrentNode((currentNode) => up(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;
      case "s":
      case "ArrowDown":
        setCurrentNode((currentNode) => down(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  return (
    <Box mt={5}>
      <div role="application">
        <div ref={ariaLiveEl} aria-live="assertive"></div>
        <div
          aria-label="Please use the arrow keys or WASD keys to navigate this chart object"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div aria-hidden="true">
            <Vega spec={spec} onNewView={handleNewView} actions={false} />
          </div>
        </div>
      </div>
    </Box>
  );
}
export default MultimodalScatterPlot;
