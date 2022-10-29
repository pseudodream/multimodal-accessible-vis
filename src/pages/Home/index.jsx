import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  // TextField,
  // InputLabel,
  // Input,
  // FormHelperText,
  // FormControl,
  Container,
  Typography,
  Button,
  // List,
  // ListItem,
  // ListItemButton,
} from "@mui/material";
// import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { useNavigate, useMatch } from "react-router-dom";
// import { SessionContext } from "contexts/Session";

function Home() {
  const navigate = useNavigate();
  const focusEl = useRef(null);
  function handleContinue(){
    console.log("navigate to /informedconsent")
    navigate("/informedconsent", { replace: true });
  }
  useEffect(()=>{
    focusEl.current.focus();
  },[])
  return (
    <React.Fragment>
      <Container maxWidth="md" m={5}>
        <Typography mt={3} variant="h3" gutterBottom ref={focusEl} tabIndex={-1}>
          User Study on Ways to Make Charts Accessible
        </Typography>
        <p>
          Welcome!
        </p>
        <p>Please make sure that you are in a quiet environment with no distractions. </p>
        <p>Close any unnecessary tabs or programs on your computer. </p>
        <p>Use your screen reader software that you are most comfortable with.</p>        
        <p>When you are ready, please click the "continue" button below to continue.</p>
        <Box mt={5}>
          
          {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}

          <Box mt={5}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleContinue}
              
            >
              Continue
            </Button>
          </Box>
        </Box>

        {/* <InputLabel htmlFor="my-input">Participant Code</InputLabel> */}

        {/* <FormControl>
        <InputLabel htmlFor="my-input">Type Your Participant Code</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">If you don't know the code, please ask the experimenter.</FormHelperText>
      </FormControl> */}
      </Container>
    </React.Fragment>
  );
}

export default Home;
