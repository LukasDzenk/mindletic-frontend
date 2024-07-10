import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ResultItem = {
  question: string;
  type: 'rating' | 'text';
  average?: number;
  distribution?: number[] | Record<string, number>;
  answers?: string[];
};

type SurveyResults = {
  results: ResultItem[];
};

const SurveyResults: React.FC = () => {
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      // !NOTE: Hardcoded survey ID for now
      const response = await axios.get<SurveyResults>('http://localhost:8000/api/surveys/1/results');
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching survey results:', error);
      setLoading(false);
    }
  };

  const renderChart = (item: ResultItem) => {
    if (item.type !== 'rating' || !item.distribution) return null;

    let labels: string[];
    let data: number[];

    if (Array.isArray(item.distribution)) {
      labels = item.distribution.map((_, index) => (index + 1).toString());
      data = item.distribution;
    } else {
      labels = Object.keys(item.distribution);
      data = Object.values(item.distribution);
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Responses',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: item.question,
        },
      },
    };

    return <Bar options={options} data={chartData} />;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!results) {
    return <Typography>No results found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Survey Results
        </Typography>
        {results.results.map((item, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {item.question}
            </Typography>
            {item.type === 'rating' && (
              <>
                <Typography variant="body1" gutterBottom>
                  Average rating: {item.average?.toFixed(2)}
                </Typography>
                {renderChart(item)}
              </>
            )}
            {item.type === 'text' && (
              <ul>
                {item.answers?.map((answer, answerIndex) => (
                  <li key={answerIndex}>{answer}</li>
                ))}
              </ul>
            )}
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default SurveyResults;