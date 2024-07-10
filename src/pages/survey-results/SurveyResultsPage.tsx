import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SurveyForm from '../../components/FillInSurveyForm'
import SurveyResults from '../../components/SurveyResults'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/survey-results" element={<SurveyResults />} />
      </Routes>
    </Router>
  );
};

export default App;