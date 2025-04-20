import React, { useEffect, useState, useContext } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

function generateShades(baseColor, count) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 10 + i * (70 / count);
    shades.push(`hsl(270, 100%, ${lightness}%)`);
  }
  return shades;
}

const SpendingCharts = ({ expenses, totalBudget, categoryBudgets, overBudget }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const { categories } = useContext(CategoryContext);
  const [showTotalAlert, setShowTotalAlert] = useState(true);
  const [showCategoryAlert, setShowCategoryAlert] = useState(true);

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const categoryMap = {};
    let totalAmount = 0;

    expenses.forEach(exp => {
      totalAmount += exp.amount;
      categoryMap[exp.categoryId] = (categoryMap[exp.categoryId] || 0) + exp.amount;
    });

    const categoryWise = Object.entries(categoryMap).map(([id, amt]) => {
      const categoryName = categories.find(cat => cat.id === parseInt(id))?.name || 'Unknown';
      return {
        categoryId: id,
        category: categoryName,
        amount: amt,
        percentage: totalAmount > 0 ? (amt / totalAmount) * 100 : 0,
      };
    }).filter(entry => entry.percentage > 0);

    // const dateWise = expenses.reduce((acc, exp) => {
    //   const dateStr = new Date(exp.date).toISOString().split('T')[0];
    //   const existing = acc.find(item => item.date === dateStr);
    //   if (existing) {
    //     existing.Amount += exp.amount;
    //   } else {
    //     acc.push({ date: dateStr, Amount: exp.amount });
    //   }
    //   return acc;
    // }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    });

    const dateMap = {};
    expenses.forEach(exp => {
      const dateStr = new Date(exp.date).toISOString().split('T')[0];
      dateMap[dateStr] = (dateMap[dateStr] || 0) + exp.amount;
    });

    const last7Data = last7Days.map(date => ({
      date,
      Amount: dateMap[date] || 0,
    }));

    const maxAmount = Math.max(...last7Data.map(d => d.Amount));
    const highlightedData = last7Data.map(d => ({
      ...d,
      isMax: d.Amount === maxAmount,
    }));
    setDateData(highlightedData);
    setCategoryData(categoryWise);
  }, [expenses, categories]);

  const COLORS = generateShades('#130037', categoryData.length);

  const overLimitCategories = categoryData
    .filter(entry => overBudget?.categories?.includes(parseInt(entry.categoryId)))
    .map(entry => entry.category);

  const transformedData = categoryData.map(entry => {
    const categoryId = parseInt(entry.categoryId);
    const budgetEntry = categoryBudgets?.find(b => b.categoryId === categoryId);

    if (!budgetEntry) {
      // No budget set for this category
      return {
        ...entry,
        withinBudget: entry.amount,
        overBudget: 0,
        hasBudget: false
      };
    }

    const budget = budgetEntry.budget;
    return {
      ...entry,
      withinBudget: entry.amount > budget ? budget : entry.amount,
      overBudget: entry.amount > budget ? entry.amount - budget : 0,
      hasBudget: true
    };
  });

  return (
    <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 2 }}>
      {expenses.length === 0 ? (
        <Typography variant="h5" color="textSecondary" sx={{ py: 5 }}>
          No expenses found. Start by adding some to view your charts!
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>Monthly Spendings</Typography>

            {showTotalAlert && overBudget?.total && (
              <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setShowTotalAlert(false)}>
                You have exceeded your <strong>total monthly budget</strong> of ₹{totalBudget}
              </Alert>
            )}

            {showCategoryAlert && overLimitCategories.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setShowCategoryAlert(false)}>
                Budget limit exceeded for: <strong>{overLimitCategories.join(', ')}</strong>
              </Alert>
            )}

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={transformedData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="category" interval={0} angle={-30} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend
                  content={() => (
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: 14, height: 14, backgroundColor: '#6a1b9a' /* or COLORS[0] */ }}></div>
                        <span>Within Budget</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: 14, height: 14, backgroundColor: '#d32f2f' }}></div>
                        <span>Over Budget</span>
                      </div>
                    </div>
                  )}
                />

                <Bar dataKey="withinBudget" name="Within Budget" stackId="a">
                  {transformedData.map((entry, index) => (
                    <Cell
                      key={`cell-wb-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>

                <Bar dataKey="overBudget" name="Over Budget" stackId="a">
                  {transformedData.map((entry, index) => (
                    <Cell
                      key={`cell-ob-${index}`}
                      fill={entry.hasBudget ? '#d32f2f' : COLORS[index % COLORS.length]} // fallback to same color if no budget
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer> */}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Last 7 Days Spendings</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dateData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) =>
                    props.payload.isMax
                      ? [`₹${value} (Highest)`, name]
                      : [`₹${value}`, name]
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Amount"
                  stroke="#6a1b9a"
                  strokeWidth={2}
                  dot={({ cx, cy, payload, index }) => (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill={payload.isMax ? '#d32f2f' : '#6a1b9a'}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  )}                  
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default SpendingCharts;
