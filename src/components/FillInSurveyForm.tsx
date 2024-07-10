import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Option = {
  id: number;
  text: string;
  value: number;
};

type Question = {
  id: number;
  text: string;
  type: 'rating' | 'text';
  options: Option[];
};

type Survey = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

type Response = {
  question_id: number;
  answer: string;
};

const SurveyForm: React.FC = () => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchSurvey();
  }, []);

  const fetchSurvey = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/surveys/1');
      setSurvey(response.data);
      setResponses(response.data.questions.map((q: Question) => ({ question_id: q.id, answer: '' })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching survey:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching survey. Please try again.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: number, answer: string) => {
    setResponses(prevResponses =>
      prevResponses.map(r =>
        r.question_id === questionId ? { ...r, answer } : r
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // !NOTE: Hardcoded URL for local development
      await axios.post('http://localhost:8000/api/surveys/1/responses', { responses });
      setSnackbar({
        open: true,
        message: 'Survey submitted successfully!',
        severity: 'success'
      });
      setResponses(survey!.questions.map(q => ({ question_id: q.id, answer: '' })));
      // Delay redirect for 2 seconds
      setTimeout(() => {
        navigate('/survey-results');
      }, 2_000);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting survey. Please try again.',
        severity: 'error'
      });
    }
    setSubmitting(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!survey) {
    return <Typography>No survey found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {survey.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {survey.description}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {survey.questions.map((question) => (
            <Box key={question.id} sx={{ mt: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">{question.text}</FormLabel>
                {question.type === 'rating' ? (
                  <RadioGroup
                    value={responses.find(r => r.question_id === question.id)?.answer || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.value.toString()}
                        control={<Radio />}
                        label={option.text}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={responses.find(r => r.question_id === question.id)?.answer || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                )}
              </FormControl>
            </Box>
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SurveyForm;