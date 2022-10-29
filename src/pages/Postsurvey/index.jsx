import React, { useState, useContext,  useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { SessionContext } from "contexts/Session";
import CommentQuestion from "components/CommentQuestion";
import CheckboxQuestion from "components/CheckboxQuestion";
import RadioGroupQuestion from "components/RadioGroupQuestion";
import Questionnaire from "components/Questionnaire";

function Postsurvey() {
  const navigate = useNavigate();
  function handleContinue(e) {
    const incomplete = questions.some((q) =>
      q.type === "checkbox"
        ? q.response.every((r) => r === false)
        : q.response === ""
    );

    console.log("moving ", incomplete, forceContinue);
    if (incomplete && !forceContinue) {
      setError("You have unanswered questions.");
      setForceContinue(true);
      return;
    }
    setTimeout(function () {
      setError("");
    }, 5000);

    console.log(
      "successfully saving the post study survey response",
      questions
    );
    setPostSurvey(questions);
    navigate("/debrief");
  }
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])
  const { PID, setPostSurvey } = useContext(SessionContext);
  // console.log(PID);
  // const baseURL = process.env.PUBLIC_URL;
  const [forceContinue, setForceContinue] = useState(false);
  const [error, setError] = useState(""); // to show an error message
  const [questions, setQuestions] = useState([
    {
      prompt: "Which condition did you like most?",
      type: "radiogroup",
      response: "",
      options: [
        "Data table",
        "Multimodal",
      ],
    },
    {
      prompt: "What did you like the most about this condition?",
      type: "comment",
      response: "",
    },
    {
      prompt: "Which condition did you like the least?",
      type: "radiogroup",
      response: "",
      options: [
        "Data table",
        "Multimodal",
              ],
    },
    {
      prompt: "What did you like least about this condition?",
      type: "comment",
      response: "",
    },
    {
      prompt: "Is there anything you would like to add?",
      type: "comment",
      response: "",
    },
  ]);


  function handleChange(questions) {
    console.log("questions", questions);
    setQuestions(questions);
  }

  return (
    <React.Fragment>
      {/* {PID === '' && <Navigate to={baseURL} replace={true} />} */}
      <Container maxWidth="md" mt={5}>
        <Typography mt={3} variant="h3"  ref={focusEl} tabIndex={-1} gutterBottom>
          Post Study Survey
        </Typography>
        <p>You have engaged with two different condtions (data table and multimodal) for exploring data charts. 
          In this survey, we ask final reflection questions to compare these conditions
          based on your experience.</p>
        <Questionnaire questions={questions} onChange={handleChange} />
        <Box p={3}>
          <Typography variant="subtitle1" color="error" aria-live="assertive">
            {error}
          </Typography>
        </Box>
        <Box mb={5}>
          <Button variant="contained" fullWidth onClick={handleContinue}>
            Continue to Debrief
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Postsurvey;
