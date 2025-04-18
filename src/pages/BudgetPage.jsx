import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { BudgetContext } from '../context/BudgetContext';
import Navbar from '../components/NavBar';

export default function BudgetPage() {
  const {
    totalBudget,
    categoryBudgets,
    saveTotalBudget,
    saveCategoryBudgets,
  } = useContext(BudgetContext);

  const [localTotalBudget, setLocalTotalBudget] = useState('');
  const [localCategoryBudgets, setLocalCategoryBudgets] = useState([]);

  useEffect(() => {
    if (totalBudget !== null) setLocalTotalBudget(totalBudget);
  }, [totalBudget]);

  useEffect(() => {
    setLocalCategoryBudgets(categoryBudgets);
  }, [categoryBudgets]);

  const handleCategoryBudgetChange = (index, value) => {
    const updatedBudgets = [...localCategoryBudgets];
    updatedBudgets[index] = {
      ...updatedBudgets[index],
      budget: parseFloat(value) || 0,
    };
    setLocalCategoryBudgets(updatedBudgets);
  };

  const handleSaveTotal = async () => {
    await saveTotalBudget(localTotalBudget);
    alert('Total budget saved');
  };

  const handleSaveCategories = async () => {
    await saveCategoryBudgets(localCategoryBudgets);
    alert('Category budgets saved');
    setLocalCategoryBudgets(categoryBudgets);
  };

  return (
    <>
    <Navbar />
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Set Budgets
      </Typography>

      {/* Total Budget Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Total Budget</Typography>
        <TextField
          type="number"
          value={localTotalBudget}
          onChange={(e) => setLocalTotalBudget(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSaveTotal}>
          Save Total Budget
        </Button>
      </Paper>

      {/* Category Budgets Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Category Budgets</Typography>
        <Stack spacing={2}>
          {localCategoryBudgets.map((cat, index) => (
            <TextField
              key={cat.categoryId}
              label={cat.categoryName}
              type="number"
              value={cat.budget}
              onChange={(e) => handleCategoryBudgetChange(index, e.target.value)}
              fullWidth
            />
          ))}
        </Stack>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleSaveCategories}>
          Save Category Budgets
        </Button>
      </Paper>
    </Box>
    </>
  );
}
