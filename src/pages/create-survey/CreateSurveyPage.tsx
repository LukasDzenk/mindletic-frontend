import React from 'react';
import { Container } from '@mui/material';
import FeedbackForm from '../../components/CreateSurveyForm'

const CreateFormPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <FeedbackForm />
    </Container>
  );
};

export default CreateFormPage;