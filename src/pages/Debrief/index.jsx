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
  Chip,
  // List,
  // ListItem,
  // ListItemButton,
} from "@mui/material";
// import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { useNavigate, useMatch } from "react-router-dom";
import { SessionContext } from "contexts/Session";

function Home() {
  //   const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const str = new Date().toISOString().slice(0, 19).replace("T", "-");
  const { getSessionData, uploadDataToCloud } = useContext(SessionContext);
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])

  useEffect(() => {
    const session = getSessionData();
    if (session.PID===""){ //no  
        return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(session));
    uploadDataToCloud(`session/${session.PID}-report-${str}.json`, dataStr)
    .then((snapshot) => {
        console.log("Uploaded a data_url string!");
        setStatus(true)
    })
    .catch((error) => {
        setStatus(false);
    });

  }, []);
  function handleDownload() {
    const session = getSessionData();
    console.log("session", session);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(session));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${session.PID}-report-${str}.json`);
    dlAnchorElem.click();
  }
  return (
    <React.Fragment>
      <Container maxWidth="md" m={5}>
        <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1} gutterBottom>
          Debrief
        </Typography>
        <p>Thank you for your participation!</p>
        <p>Please ask if you have any lingering questions about the study. </p>
        {status ? (
          <Chip label="Data Upload Successful" color="success" />
        ) : (
          <Chip label="Data Upload Failed" color="error" />
        )}
        <p>
          If data upload is failed, please download the study session data and
          email to <a href="mailto:ataguba@bc.edu">ataguba@bc.edu</a>
        </p>

        <Box mt={5}>
          {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}

          <Box mt={5}>
            <Button variant="contained" fullWidth onClick={handleDownload}>
              Download
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
