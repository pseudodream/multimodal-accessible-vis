import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { compile } from "vega-lite";
import { View, parse } from "vega";
import liteSpec from "charts/barchart.json";
import { Vega } from "react-vega";
import { Typography, Box } from "@mui/material";
import { useCallback } from "react";
import { navtree, prev, next, up, down } from "libs/keynav";
import speech from "libs/speech";
import { TextField } from "@mui/material";
import { VegaLite } from "react-vega";
import spec1 from "charts/barchart.json";
import AIQuery from "libs/api/AIQuery";
import summary from "libs/speech/commands/summary";

function MultimodalBar(props) {
  const ariaLiveEl = useRef(null);

  const [rootNode, setRootNote] = useState();
  const [currentNode, setCurrentNode] = useState();
  const [chartView, setChartView] = useState();

  //speech
  const formatter = d3.format(",.0f");

  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState();
  const handleChange = (event) => {
    setQuestion(event.target.value);
  };
  const handleKeyPress = (event) => {
    // console.log("keypressed", event, qna);
    if (event.key === "Enter") {
      //submit question
      event.preventDefault();
      //TODO: handle question

      if (qna) {
        console.log("question", question);

        var found = qna.inquiry(question.toLowerCase());
        if (!found) {
          AIQuery(question).then((data) => {
            console.log("xx" + data);
            srSpeak(data);
          });
        }
        setQuestion("");
      }
    }
  };
  const data = spec1.data.values;

  const variables = [
    {
      field: "month",
      type: "categorical",
      label: "month",
      encoding: "horizontal axis",
    },
    {
      field: "weather",
      type: "categorical",
      label: "weather",
      encoding: "color legend",
    },
    {
      field: "count",
      type: "numerical",
      label: "count",
      encoding: "vertical axis",
    },
  ];

  const options = {
    onLog: props.onLog,
    variables,
    title: spec1.title,
    description: spec1.description,
    responseEl: ariaLiveEl.current,
    formatters: { count: formatter },
  };

  useEffect(() => {
    console.log("start qna process");
    const qna = speech(data, options);
    qna.run();
    setQna(qna);
    options.responseEl = ariaLiveEl.current;

    return () => {
      console.log("clear qna process");
      qna.stop();
    };
  }, []);

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
  const weather = ["sun", "fog", "drizzle", "rain", "snow"];
  //reference:https://github.com/datawithinreach/edconnect/blob/pantherman594/modularize-chart-component/src/components/Chart.js

  const spec = useMemo(() => {
    // construct a vega spec with signals
    // liteSpec.encoding.color.
    liteSpec.data.values.sort((a, b) => {
      if (months.indexOf(a.month) > months.indexOf(b.month)) {
        return 1;
      }
      if (months.indexOf(a.month) < months.indexOf(b.month)) {
        return -1;
      }
      if (weather.indexOf(a.weather) > weather.indexOf(b.weather)) {
        return 1;
      }
      if (weather.indexOf(a.weather) < weather.indexOf(b.weather)) {
        return -1;
      }
      return 0;
    });
    console.log("lite spec", liteSpec);
    const clone = JSON.parse(JSON.stringify(liteSpec));

    //add sum stats to top level
    const sumstats = summary(data, options);
    clone.description = sumstats;
    clone.encoding.opacity = {
      condition: {
        test: '(!selected || length(selected) == 0) || selected && length(selected) > 0 && indexof(selected, ";" + datum["month"] + ";" + datum["weather"]) >= 0',
        value: 1.0,
      },
      value: 0.1,
    };

    const spec = compile(clone).spec;
    console.log("Vega Spec", spec);
    spec.signals = [];
    spec.signals.push({
      name: "selected",
      value: null,
    });
    console.log(spec);
    return spec;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const rootNode = await navtree(spec, { skip: ["y"] });

      setRootNote(rootNode);
      setCurrentNode(rootNode);
    };
    loadData();
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

    console.log("currentNode", currentNode);
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
    if (
      currentNode.type === "datum" ||
      currentNode.type === "category-subgroup"
    ) {
      var selection = currentNode.selection;

      const strings = selection.map((d) => `;${d["month"]};${d["weather"]}`);
      console.log("update selection", JSON.stringify(strings));
      chartView.signal(
        "selected",
        selection.map((d) => `;${d["month"]};${d["weather"]}`)
      );
      chartView.runAsync();
      console.log("scenegraph", chartView.scenegraph().root);
    } else {
      chartView.signal("selected", []);

      chartView.runAsync();
    }
  }, [currentNode]);

  function jumpToNode(cat1, cat2, root) {
    function searchNode(root) {
      var stack = [];
      var node;
      stack.push(rootNode);
      while (stack.length > 0) {
        node = stack.pop();
        if (
          node.type == "datum" &&
          node.selection[0].month == cat1 &&
          node.selection[0].weather == cat2
        ) {
          return node;
        } else if (node.children && node.children.length) {
          for (var i = 0; i < node.children.length; i++) {
            stack.push(node.children[i]);
          }
        }
      }
    }

    setCurrentNode(searchNode(rootNode));
  }

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
      case "ArrowLeft":
        setCurrentNode((currentNode) => prev(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowRight":
        setCurrentNode((currentNode) => next(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;

      case "ArrowUp":
        setCurrentNode((currentNode) => up(currentNode));
        e.preventDefault();
        e.stopPropagation();
        break;

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
        <div
          aria-label="Please use the arrow keys to navigate this chart object. To use the speech method, type option + I for instruction"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div aria-hidden="true">
            <Vega spec={spec} onNewView={handleNewView} actions={false} />
          </div>
        </div>
        <div ref={ariaLiveEl} aria-live="assertive"></div>
        <TextField
          sx={{ mt: 5 }}
          id="outlined-basic"
          value={question}
          label="Type your question here and press enter if speech is not accessible"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </Box>
  );
}
export default MultimodalBar;
