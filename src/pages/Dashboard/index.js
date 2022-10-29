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
// import { useNavigate, useMatch } from "react-router-dom";
import { SessionContext } from "contexts/Session";

function Dashboard() {
  //   const navigate = useNavigate();
  // const [status, setStatus] = useState(false);
  const [data, setData] = useState([]);

  const { downloadDataFromCloud } = useContext(SessionContext);

  useEffect(() => {
    downloadDataFromCloud().then((data) => {
      data = data.filter((d) => d.PID.toLowerCase().includes("test") === false);
      //temporary
      data = data.filter((d) => d.date && new Date(d.date)> new Date('2022-08-31'));
      console.log("data", data);
      setData(data);
    });
  }, []);
  
  function handleBackgroundDownload(){
    if (data.length<1){
      return;
    }
    const header =data[0].background.reduce((acc, cur)=>{
        acc.push(cur.prompt.replace(/"/g, ''));
        return acc;
      }, ["PID"]);
    const rows =data.map(d=>{
      const row = d.background.reduce((acc, cur)=>{
        acc.push(cur.response);
        return acc;
      }, [d.PID])
      return row;
    });
    rows.unshift(header);
    // console.log('headers', header);
    console.log('rows',  rows.map(e => e.map(d=>`\"${d}\"`).join(",")));
    const dataStr =
      "data:text/csv;charset=utf-8,"  + rows.map(e => e.map(d=>`\"${d}\"`).join(",")).join("\n");
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `background.csv`);
    dlAnchorElem.click();
  }

  function handleTaskDownload(){
    if (data.length<1){
      return;
    }
    // pid, chart, method, q1, q1-time,  q2, q2-time, ..., survey-q1, survey-q2, ...
    let header = ["pid", "chart", "method"];
    header = header.concat(data[0].tasks[0].map((q,i)=>[`q${i+1}`,`q${i+1}-response`, `q${i+1}-answer`, `q${i+1}-time`]).flat());
    header = header.concat(data[0].tasksurveys[0].map(q=>q.prompt));
    console.log("header", header);
    // rows
    const rows = [];
    data.map(d=>{
      d.setup.map((condition,i)=>{
        let row = [d.PID, condition.chart, condition.method];
        row = row.concat(d.tasks[i].map(q=>[q.response.prompt, q.response.response, q.response.answer, q.timespan]).flat());
        row = row.concat(d.tasksurveys[i].map(q=>q.response));
        // console.log("row",i, row);
        rows.push(row);
      });
    });
    rows.unshift(header);
    // console.log('rows',  rows.map(e => e.map(d=>`\"${d}\"`).join(",")));
    const dataStr =
      "data:text/csv;charset=utf-8,"  + rows.map(e => e.map(d=>`\"${d}\"`).join(",")).join("\n");
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `tasks.csv`);
    dlAnchorElem.click();
  }
  function handlePostSurveyDownload(){
    if (data.length<1){
      return;
    }
    const header =data[0].postsurvey.reduce((acc, cur)=>{
      acc.push(cur.prompt.replace(/"/g, ''));
      return acc;
    }, ["PID"]);
  const rows =data.map(d=>{
    const row = d.postsurvey.reduce((acc, cur)=>{
      acc.push(cur.response);
      return acc;
    }, [d.PID])
    return row;
  });
  rows.unshift(header);
  // console.log('headers', header);
  console.log('rows',  rows.map(e => e.map(d=>`\"${d}\"`).join(",")));
  const dataStr =
    "data:text/csv;charset=utf-8,"  + rows.map(e => e.map(d=>`\"${d}\"`).join(",")).join("\n");
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `postsurvey.csv`);
  dlAnchorElem.click();
  }
  return (
    <React.Fragment>
      <Container maxWidth="md" m={5}>
        <Typography mt={3} variant="h3" gutterBottom>
          Data Dashboard
        </Typography>
        <div>
          Number of Participants: {data.length} (PIDs:{" "}
          {data.map((d) => d.PID).join(",")})
        </div>

        <Typography mt={3}  variant="h4" gutterBottom>
          Background
        </Typography>
        <Button variant="contained" fullWidth onClick={handleBackgroundDownload}>
          Download Background Survey Result
        </Button>

        <Typography mt={3}  variant="h4" gutterBottom>
          Task
        </Typography>
        <Button variant="contained" fullWidth onClick={handleTaskDownload}>
          Download Task Result
        </Button>

        <Typography mt={3}  variant="h4" gutterBottom>
          Post-survey
        </Typography>
        <Button variant="contained" fullWidth onClick={handlePostSurveyDownload}>
          Download Post-Survey Result
        </Button>
      </Container>
    </React.Fragment>
  );
}

export default Dashboard;
