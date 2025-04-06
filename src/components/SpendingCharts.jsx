import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const dummyData = [
  { category: 'Food', Amount: 120 },
  { category: 'Transport', Amount: 80 },
  { category: 'Entertainment', Amount: 150 },
  { category: 'Health', Amount: 90 },
  { category: 'Rent', Amount: 300 },
];

const spendingByDate = [
  { date: '2025-04-01', Amount: 100 },
  { date: '2025-04-02', Amount: 200 },
  { date: '2025-04-03', Amount: 150 },
  { date: '2025-04-04', Amount: 300 },
  { date: '2025-04-05', Amount: 250 },
];

const COLORS = ['#130037', '#6a1b9a', '#9c27b0', '#ab47bc', '#ce93d8'];

const SpendingCharts = () => {
  return (
    <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 4, borderRadius: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Category wise spending</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dummyData}
              dataKey="Amount"
              nameKey="category"
              outerRadius={100}
              fill="#130037"
              label
            >
              {dummyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dummyData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Amount" fill="#130037" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Spending Over Time</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingByDate}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Amount" stroke="#6a1b9a" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SpendingCharts;
