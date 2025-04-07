import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

function generateShades(baseColor, count) { // Generates shades of a base color
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 10 + i * (70 / count); // Between 10% and 80% lightness
    shades.push(`hsl(270, 100%, ${lightness}%)`);
  }
  return shades;
}

const SpendingCharts = ({ refresh }) => {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const userId = 8;
  const { categories } = useContext(CategoryContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const COLORS = generateShades('#130037', categoryData.length);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/unsecure/expenses/getExpenses?userId=${userId}`);
        const data = response.data;
        setExpenses(data);

        const categoryMap = {};
        let totalAmount = 0;
        data.forEach(exp => {
          totalAmount += exp.amount;
          categoryMap[exp.categoryId] = (categoryMap[exp.categoryId] || 0) + exp.amount;
        });

        const categoryWise = Object.entries(categoryMap)
          .map(([id, amt]) => {
            const categoryName = categories.find(cat => cat.id === parseInt(id))?.name || 'Unknown';
            return {
              category: categoryName,
              amount: amt,
              percentage: totalAmount > 0 ? (amt / totalAmount) * 100 : 0
            };
          })
          .filter(entry => entry.percentage > 0);


        const dateWise = data.reduce((acc, exp) => {
          const dateStr = new Date(exp.date).toISOString().split('T')[0];
          const existing = acc.find(item => item.date === dateStr);
          if (existing) {
            existing.Amount += exp.amount;
          } else {
            acc.push({ date: dateStr, Amount: exp.amount });
          }
          return acc;
        }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

        setCategoryData(categoryWise);
        setDateData(dateWise);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [categories, refresh]);

  return (
      <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom sx={{mb:4}}>My Spendings</Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="category" interval={0} angle={-30} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" name="Amount">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="percentage"
                nameKey="category"
                outerRadius={100}
                fill="#130037"
                label={({ percentage }) => `${percentage.toFixed(2)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      
        <Paper sx={{ p: 2}}>
          <Typography variant="h4" gutterBottom>Spending Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dateData}>
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