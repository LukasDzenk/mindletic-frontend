import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';

type OptionType = {
  text: string;
  value: number;
};

type QuestionType = {
  text: string;
  type: 'rating' | 'text';
  options: OptionType[];
};

type SurveyType = {
  title: string;
  description: string;
  questions: QuestionType[];
};

const SurveyCreator: React.FC = () => {
  const [survey, setSurvey] = useState<SurveyType>({
    title: '',
    description: '',
    questions: []
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const addQuestion = (type: 'rating' | 'text') => {
    const newQuestion: QuestionType = {
      text: '',
      type: type,
      options: type === 'rating' ? [
        { text: 'Very Poor', value: 1 },
        { text: 'Poor', value: 2 },
        { text: 'Average', value: 3 },
        { text: 'Good', value: 4 },
        { text: 'Excellent', value: 5 }
      ] : []
    };
    setSurvey({...survey, questions: [...survey.questions, newQuestion]});
  };

  const updateQuestion = (index: number, field: keyof QuestionType, value: string) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index] = {...updatedQuestions[index], [field]: value};
    setSurvey({...survey, questions: updatedQuestions});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // !NOTE: Hardcoded URL for local development
      const response = await axios.post('http://localhost:8000/api/surveys', survey);
      console.log('Survey created:', response.data);
      setSnackbar({
        open: true,
        message: 'Survey created successfully!',
        severity: 'success'
      });
      // Reset the form after successful submission
      setSurvey({
        title: '',
        description: '',
        questions: []
      });
    } catch (error) {
      console.error('Error creating survey:', error);
      setSnackbar({
        open: true,
        message: 'Error creating survey. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create a New Survey
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Survey Title"
            name="title"
            autoFocus
            value={survey.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSurvey({...survey, title: e.target.value})}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Survey Description"
            name="description"
            value={survey.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSurvey({...survey, description: e.target.value})}
          />
          
          {survey.questions.map((question, index) => (
            <Box key={index} sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Question Text"
                    value={question.text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuestion(index, 'text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={question.type}
                      label="Question Type"
                      onChange={(e) => updateQuestion(index, 'type', e.target.value as 'rating' | 'text')}
                    >
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => addQuestion('rating')} sx={{ mr: 1 }}>
              Add Rating Question
            </Button>
            <Button variant="outlined" onClick={() => addQuestion('text')}>
              Add Text Question
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Survey
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

export default SurveyCreator;