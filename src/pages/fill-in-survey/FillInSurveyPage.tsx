import { Container } from '@mui/material'
import React from 'react'
import SurveyForm from '../../components/FillInSurveyForm'

const FillInSurveyPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <SurveyForm />
    </Container>
  );
};

export default FillInSurveyPage;