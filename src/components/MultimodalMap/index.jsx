import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { compile } from "vega-lite";
import { View, parse } from "vega";
import liteSpec from "charts/map.json";
import { Vega } from "react-vega";
import { Box } from "@mui/material";
import { useCallback } from "react";
import { navtree, prev, next, up, down } from "libs/keynav";

const formatter = (d) => d3.format(".2%")(d / 100);
function MultimodalMap(props) {
  const ariaLiveEl = useRef(null);
  //   const [chartData, setChartData] = useState({});
  const [rootNode, setRootNote] = useState();
  const [currentNode, setCurrentNode] = useState();
  const [chartView, setChartView] = useState();
  //reference:https://github.com/datawithinreach/edconnect/blob/pantherman594/modularize-chart-component/src/components/Chart.js
  const spec = useMemo(() => {
    // construct a vega spec with signals
    // liteSpec.encoding.color.

    liteSpec.data.values.sort((a, b) =>
      d3.descending(a.vaccination_rate, b.vaccination_rate)
    );
    console.log("lite spec", liteSpec);
    const clone = JSON.parse(JSON.stringify(liteSpec));
    clone.description =
      "A U.S. map showing vaccination rates of all states in the U.S.";
    clone.encoding.opacity = {
      condition: {
        test: '(length(selectedStates) == 0 && length(selectedRange)==0) || (length(selectedStates) > 0 && indexof(selectedStates, datum["state"]) >= 0 ) || (length(selectedRange)>0 && inrange(datum["vaccination_rate"],selectedRange)) ',
        value: 1.0,
      },
      value: 0.1,
    };

    const spec = compile(clone).spec;
    console.log("Vega Spec", spec);
    spec.signals = [];
    spec.signals.push(
      {
        name: "selectedStates",
        value: [],
      },
      {
        name: "selectedRange",
        value: [],
      }
    );
    console.log(spec);
    return spec;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      //   const chartData = await d3.csv("datasets/covid-world.csv");
      //   console.log("Data", chartData);
      //   setChartData({ table: chartData });
      const datumDesc = (datum, index, field, group) => {
        return `${index + 1} of ${group.length} items. state: ${
          datum.state
        }, vaccination rate: ${formatter(datum.vaccination_rate)}`;
      }; // encoding name
      // encoding type
      // encoding title
      const rootNode = await navtree(spec, {
        datumDesc,
        formatters: { vaccination_rate: formatter },
        customGroups: [
          {
            type: "geoshape encoding",
            title: "A Map of the U.S.",
            field: "state",
          },
        ],
      });
      console.log("Navigation Tree", rootNode);
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
    if (currentNode.type === "datum") {
      console.log(
        "selected datum",
        currentNode.selection.map((d) => d.state)
      );
      chartView.signal(
        "selectedStates",
        currentNode.selection.map((d) => d.state)
      );
      chartView.signal("selectedRange", []);
      chartView.runAsync();
    } else if (currentNode.type === "numeric-subgroup") {
      const extent = d3.extent(
        currentNode.selection,
        (d) => d.vaccination_rate
      );
      console.log("selected extent", extent);
      chartView.signal("selectedRange", extent);
      chartView.signal("selectedStates", []);
      chartView.runAsync();
    } else {
      chartView.signal("selectedStates", []);
      chartView.signal("selectedRange", []);

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
    console.log("key", e.key, currentNode, rootNode);

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

  const options = { actions: false };
  return (
    <Box mt={5}>
      {/* <Typography variant="h6" mb={3}>Total Covid-19 Cases by Country as of June 27, 2022 <small>(Data source: Google)</small></Typography> */}
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
export default MultimodalMap;
