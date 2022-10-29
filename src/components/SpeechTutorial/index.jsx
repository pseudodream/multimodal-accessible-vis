import React, { useState, useEffect, useRef } from "react";
import speech from "libs/speech";
import { Box, TextField } from "@mui/material";
import { VegaLite } from "react-vega";
import * as d3 from 'd3';
import spec from "charts/tutorial.json";

spec.width = 600;
spec.height = 400;
const formatter = d3.format(",.0f");
function SpeechTutorial(props) {
  // spec = JSON.parse(JSON.stringify(spec));
// spec.description = `A horizontal bar chart showing Covid-19 Cases by country and continent as of June 27, 2022. A vertical axis shows bars representing different countries from United States to Netherlands. The length of the bars is mapped to the number of covid cases along the horizontal axis, while their color represents its corresponding continent such as America, Asia, and Europe.`;
  const ariaLiveEl = useRef(null);
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState();

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };
  const handleKeyPress = (event)=>{
    // console.log("keypressed", event, qna);
    if (event.key==="Enter"){//submit question
      event.preventDefault();
      if (qna){
        console.log("question", question);
        qna.inquiry(question);
        setQuestion("")
      }

    }
  }
  useEffect(() => {
    console.log("initialize", ariaLiveEl.current.innerHTML);
    const data = spec.data.values;

    const variables = [
      { field: "country", type: "categorical", title:"Country", label: "country", encoding:"vertical axis" },
      { field: "continent", type: "categorical",title:"Continent", label: "continent", encoding:"color legend" },
      { field: "cases", type: "numerical", title:"Covid-19 cases", label: "case", encoding:"horizontal axis"},
    ];
 
    console.log("start qna process")
    const qna = speech(data, { onLog:props.onLog, variables, title: spec.title, description: spec.description, responseEl: ariaLiveEl.current, formatters:{cases:formatter} });//
    qna.run();
    setQna(qna);

    return ()=>{
      console.log("clear qna process");
      qna.stop();
    }
  }, []);

  return (
    <Box mt={5}>
      <VegaLite spec={spec} actions={false}  />
      <Box component="div" mt={3} aria-live="assertive" ref={ariaLiveEl}></Box>
      <TextField sx={{mt:5}} id="outlined-basic" value={question} label="Type your question here and press enter if speech is not accessible" fullWidth variant="outlined" onChange={handleChange} onKeyPress={handleKeyPress}/>
    </Box>
  );
}

export default SpeechTutorial;
