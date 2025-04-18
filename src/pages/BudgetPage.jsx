import { useContext, useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Stack, IconButton,
  Collapse, CircularProgress, FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { BudgetContext } from '../context/BudgetContext';
import { CategoryContext } from '../context/CategoryContext';
import Navbar from '../components/NavBar';
import { useMediaQuery } from '@mui/material';

export default function BudgetPage() {
  const { totalBudget, categoryBudgets, saveTotalBudget, saveCategoryBudgets } = useContext(BudgetContext);
  const { categories } = useContext(CategoryContext);
  const { enqueueSnackbar } = useSnackbar();

  const [localTotalBudget, setLocalTotalBudget] = useState('');
  const [localCategoryBudgets, setLocalCategoryBudgets] = useState([]);
  const [newBudgets, setNewBudgets] = useState([{ categoryId: '', budget: '' }]);
  const [showNewCategorySection, setShowNewCategorySection] = useState(false);
  const [loading, setLoading] = useState({ total: false, categories: false, new: false });
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    if (totalBudget !== null) setLocalTotalBudget(totalBudget);
  }, [totalBudget]);

  useEffect(() => {
    setLocalCategoryBudgets(categoryBudgets);
  }, [categoryBudgets]);

  const handleCategoryBudgetChange = (index, value) => {
    const updated = [...localCategoryBudgets];
    updated[index].budget = Math.max(0, parseFloat(value) || 0); // Ensure non-negative value
    setLocalCategoryBudgets(updated);
  };

  const handleDeleteCategoryBudget = (index) => {
    const updated = [...localCategoryBudgets];
    updated.splice(index, 1);
    setLocalCategoryBudgets(updated);
  };

  const handleNewBudgetChange = (index, field, value) => {
    const updated = [...newBudgets];
    updated[index][field] = field === 'budget' ? parseFloat(value) || '' : value;
    setNewBudgets(updated);
  };

  const addNewBudgetField = () => {
    setNewBudgets([...newBudgets, { categoryId: '', budget: '' }]);
  };

  const handleSaveAllBudgets = async () => {
    setLoading((prev) => ({ ...prev, total: true, categories: true }));
    await saveTotalBudget(parseFloat(localTotalBudget));
    await saveCategoryBudgets(localCategoryBudgets);
    enqueueSnackbar('All budget changes saved!', { variant: 'success' });
    setLoading((prev) => ({ ...prev, total: false, categories: false }));
  };

  const handleSaveNewBudgets = async () => {
    const valid = newBudgets.filter(entry => entry.categoryId && entry.budget);
    if (valid.length === 0) return;

    const formatted = valid.map(entry => ({
      categoryId: parseInt(entry.categoryId),
      budget: entry.budget,
      categoryName: categories.find(c => c.id === parseInt(entry.categoryId))?.name || ''
    }));

    const allBudgets = [...localCategoryBudgets, ...formatted];
    setLoading((prev) => ({ ...prev, new: true }));
    await saveCategoryBudgets(allBudgets);
    enqueueSnackbar('New category budgets added!', { variant: 'success' });
    setNewBudgets([{ categoryId: '', budget: '' }]);
    setShowNewCategorySection(false);
    setLoading((prev) => ({ ...prev, new: false }));
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Left Section */}
        <Box sx={{ flex: 1, minWidth: '300px', border: '1px solid #ccc', p: 4, borderRadius: 0 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Total Budget</Typography>
            <TextField
              type="number"
              value={localTotalBudget}
              onChange={(e) => setLocalTotalBudget(Math.max(0, e.target.value))}
              inputProps={{ min: 0 }}
              error={localTotalBudget < 0}
              helperText={localTotalBudget < 0 ? 'Budget must be non-negative' : ''}
            />

            <Typography variant="h6" mt={2} gutterBottom>Category Budgets</Typography>

            {localCategoryBudgets.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You have not added budget for any categories yet.
              </Typography>
            ) : (
              <>
                <Stack spacing={2} sx={{ mb: 2 }}>
                  {localCategoryBudgets.map((cat, index) => (
                    <Stack direction="row" spacing={2} key={cat.categoryId}>
                      <TextField
                        label={cat.categoryName}
                        type="number"
                        value={cat.budget}
                        onChange={(e) => handleCategoryBudgetChange(index, e.target.value)}
                        fullWidth
                        inputProps={{ min: 0 }}
                        error={cat.budget < 0}
                        helperText={cat.budget < 0 ? 'Budget must be non-negative' : ''}
                      />
                      <IconButton color="error" onClick={() => handleDeleteCategoryBudget(index)}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  onClick={handleSaveAllBudgets}
                  disabled={loading.total || loading.categories}
                  startIcon={(loading.total || loading.categories) && <CircularProgress size={20} />}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Paper>
        </Box>

        {/* Right Section - Add New Category Budgets */}
        <Box sx={{ flex: 1, minWidth: '300px', border: '1px solid #ccc', p: 4, borderRadius: 0 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add Category Budgets</Typography>
            <Stack spacing={2}>
              {newBudgets.map((entry, index) => (
                <Stack direction="row" spacing={2} key={index}>
                  <FormControl fullWidth>
                    <InputLabel>Select Category</InputLabel>
                    <Select
                      value={entry.categoryId}
                      label="Select Category"
                      onChange={(e) => handleNewBudgetChange(index, 'categoryId', e.target.value)}
                    >
                      {categories
                        .filter(cat =>
                          !localCategoryBudgets.some(existing => existing.categoryId === cat.id) &&
                          !newBudgets.some((nb, i) => nb.categoryId === cat.id.toString() && i !== index)
                        )
                        .map(cat => (
                          <MenuItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Budget"
                    type="number"
                    value={entry.budget}
                    onChange={(e) => handleNewBudgetChange(index, 'budget', e.target.value)}
                    fullWidth
                  />
                </Stack>
              ))}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  onClick={addNewBudgetField}
                  variant="outlined"
                  sx={{ flex: 1 }}
                >
                  Add Another
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveNewBudgets}
                  disabled={loading.new}
                  startIcon={loading.new && <CircularProgress size={20} />}
                  sx={{ flex: 1 }}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
