import React from 'react';
import './App.css';
import Home from 'pages/Home';
import BasicBar from 'components/BasicBar';
import BasicLine from 'components/BasicLine';
import BasicScatterPlot from 'components/BasicScatterPlot';
import BasicMap from 'components/BasicMap';

import MultimodalBar from 'components/MultimodalBar';
import MultimodalLine from 'components/MultimodalLine';
import MultimodalMap from 'components/MultimodalMap';
import MultimodalScatterPlot from 'components/MultimodalScatterPlot';
import Stimuli from 'pages/Stimuli';
import { SessionProvider } from 'contexts/Session';

import SpeechBar from 'components/SpeechBar';
import SpeechLine from 'components/SpeechLine';
import SpeechMap from 'components/SpeechMap';
import SpeechScatterPlot from 'components/SpeechScatterPlot';

import { Box, Container, Typography, Button } from '@mui/material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { HashRouter, Link as RouterLink, Routes, Route } from 'react-router-dom';
import InformedConsent from 'pages/InformedConsent';
import Presurvey from 'pages/Presurvey';
import Ready from 'pages/Ready';
import Postsurvey from 'pages/Postsurvey';
import TaskSurvey from 'pages/TaskSurvey';
import Tutorial from 'pages/Tutorial';
import Task from 'pages/Task';
import Main from 'pages/Main';
import Debrief from 'pages/Debrief';
import Dashboard from 'pages/Dashboard';

import BasicTutorial from 'components/BasicTutorial';
import MultimodalTutorial from 'components/MultimodalTutorial';
import SpeechTutorial from 'components/SpeechTutorial';

function App() {
  console.log('process.env.PUBLIC_URL', process.env.PUBLIC_URL);
  const baseURL = process.env.PUBLIC_URL;
  return (
    <HashRouter>
      <SessionProvider>
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path={`informedconsent`} element={<InformedConsent />}></Route>
            <Route path={`ready`} element={<Ready />}></Route>
            <Route path={`presurvey`} element={<Presurvey />}></Route>
            <Route path={`main`} element={<Main />}></Route>
            <Route path={`tutorial/:stage`} element={<Tutorial />}></Route>
            <Route path={`task/:stage`} element={<Task />}></Route>
            <Route path={`tasksurvey/:stage`} element={<TaskSurvey />}></Route>
            <Route path={`postsurvey`} element={<Postsurvey/>}></Route>
            <Route path={`debrief`} element={<Debrief/>}></Route>
            <Route path={`dashboard`} element={<Dashboard/>}></Route>

            <Route path={`stimuli`} element={<Stimuli />}></Route>
            <Route path={`stimuli/basic-tutorial`} element={<BasicTutorial />}></Route>
            <Route path={`stimuli/basic-bar-chart`} element={<BasicBar />}></Route>
            <Route path={`stimuli/basic-line-chart`} element={<BasicLine />}></Route>
            <Route path={`stimuli/basic-scatter-plot`} element={<BasicScatterPlot />}></Route>
            <Route path={`stimuli/basic-map`} element={<BasicMap />}></Route>

            <Route path={`stimuli/multimodal-tutorial`} element={<MultimodalTutorial />}></Route>
            <Route path={`stimuli/multimodal-bar-chart`} element={<MultimodalBar />}></Route>
            <Route path={`stimuli/multimodal-line-chart`} element={<MultimodalLine />}></Route>
            <Route path={`stimuli/multimodal-scatter-plot`} element={<MultimodalScatterPlot />}></Route>
            <Route path={`stimuli/multimodal-map`} element={<MultimodalMap />}></Route>
   <Route path={`stimuli/speech-tutorial`} element={<SpeechTutorial />}></Route>
            <Route path={`stimuli/speech-bar-chart`} element={<SpeechBar />}></Route>
            <Route path={`stimuli/speech-line-chart`} element={<SpeechLine />}></Route>
            <Route path={`stimuli/speech-map`} element={<SpeechMap />}></Route>
            <Route path={`stimuli/speech-scatter-plot`} element={<SpeechScatterPlot />}></Route>
          </Routes>

        </Container>
      </SessionProvider>
    </HashRouter>
  );
}

export default App;