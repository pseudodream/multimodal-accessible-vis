import React, { useState, useEffect, useRef } from 'react';
import speech from "libs/speech";
import { Box, TextField } from '@mui/material';
import { VegaLite } from 'react-vega'

import * as d3 from 'd3';
import spec from 'charts/linechart.json';

spec.width = 600;
spec.height = 400;
const formatter = d3.format("$,.2f");
function SpeechLine(props) {
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
    const data = spec.data.values;
    //TODO: automatically derive it from the vega spec
    const variables = [
      { field: "Company", type: "categorical", label: "company", encoding: "colored lines"},
      { field: "Year", type: "categorical", label: "year", encoding:"horizontal axis" },
      { field: "Price", type: "numerical", label: "price", encoding:"vertical axis" }
    ]
 
    console.log("start qna process")
    const qna = speech(data, { onLog:props.onLog, variables, title:spec.title, description: spec.description,responseEl: ariaLiveEl.current, formatters:{Price:formatter} });
    qna.run();
    setQna(qna);
    return ()=>{
      console.log("clear qna process");
      qna.stop();
    }
  }, [])


  return (<Box mt={5}>
    <VegaLite spec={spec} actions={false} />
    <Box component="div" mt={3} aria-live="assertive" ref={ariaLiveEl}></Box>
    <TextField sx={{mt:5}} id="outlined-basic" value={question} label="Type your question here and press enter if speech is not accessible" fullWidth variant="outlined" onChange={handleChange} onKeyPress={handleKeyPress}/>
  </Box>)
}

export default SpeechLine;