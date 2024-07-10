import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import CreateFormPage from './pages/create-survey/CreateSurveyPage'
import FillInSurveyPage from './pages/fill-in-survey/FillInSurveyPage'

const HomePage: React.FC = () => (
  <Container>
    <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
      Welcome to the Feedback System
    </Typography>
    <Button component={Link} to="/create-form" variant="contained" color="primary">
      Create Feedback Form
    </Button>
    <Button component={Link} to="/fill-in-form" variant="contained" color="primary" sx={{ ml: 2 }}>
      Fill In Feedback Form
    </Button>
  </Container>
);

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Feedback App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/create-form">
            Create Form
          </Button>
          <Button color="inherit" component={Link} to="/fill-in-form">
            Fill In Form
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-form" element={<CreateFormPage />} />
        <Route path="/fill-in-form" element={<FillInSurveyPage />} />
      </Routes>
    </Router>
  );
};

export default App;