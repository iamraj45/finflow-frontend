import React, { useState, useContext } from 'react';
import { Box, TextField, Typography, Tooltip, Modal, IconButton, Paper, List, ListItem, ListItemText, Snackbar, Alert, MenuItem, FormControl, Button, InputLabel, Select, Chip, Stack, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddExpenseForm from './AddExpenseForm';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../utils/axios';
import { CategoryContext } from '../context/CategoryContext';
import ExportButtons from './ExportButtons';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DateRangeFilter from './DateRangeFilter';
import CategoryFilter from './CategoryFilter';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const MyExpenses = ({ expenses, onExpenseAdded, selectedDateRange, setSelectedDateRange, selectedCategory, setSelectedCategory, onApplyCategoryFilter, onClearCategoryFilter, totalPages, pageNo, setPageNo }) => {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { categories } = useContext(CategoryContext);

    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState([]);

    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [filterOpen, setFilterOpen] = useState(false);
    const handleFilterOpen = () => setFilterOpen(true);
    const handleFilterClose = () => setFilterOpen(false);

    const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const inputSx = {
        '& .MuiInputBase-root': {
            borderRadius: 2,
            backgroundColor: '#fff',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#999',
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.95rem',
        }
    };

    const commonIconButtonStyles = {
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        '&:hover': {
            backgroundColor: '#2d005c',
        },
    };

    const toggleDeleteMode = () => {
        setDeleteMode(prev => !prev);
        setSelectedExpenses([]); // Clear selection when toggled
    };

    const handleSelectExpense = (expenseId) => {
        setSelectedExpenses(prev =>
            prev.includes(expenseId)
                ? prev.filter(id => id !== expenseId)
                : [...prev, expenseId]
        );
    };

    const handleDeleteExpenses = async () => {
        try {
            const params = new URLSearchParams();
            selectedExpenses.forEach(id => params.append('expenseId', id));

            const response = await axios.post(`${apiUrl}/api/expenses/deleteExpense?${params.toString()}`);

            if (response.data.status === true) {
                alert('Expenses deleted successfully');
                onExpenseAdded(); // Refresh the list
                setDeleteMode(false);
                setSelectedExpenses([]);
            } else {
                alert('Failed to delete expenses. Please try again.');
            }
        } catch (error) {
            console.error("Error deleting expenses:", error);
            alert('An error occurred while deleting expenses.');
        }
    };

    const handleEditChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedExpense = {
                id: editingExpenseId,
                amount: parseFloat(editValues.amount),
                description: editValues.description,
                date: new Date(editValues.date).getTime(),
                categoryId: parseInt(editValues.categoryId)
            };
            const response = await axios.post(`${apiUrl}/api/expenses/updateExpense`, updatedExpense);
            if (response.data.status === true) {
                setEditingExpenseId(null);
                onExpenseAdded(); // refresh
            } else {
                alert('Failed to update expense');
            }
        } catch (err) {
            console.error('Error updating expense:', err);
            alert('Error occurred while updating');
        }
    };

    const getCategoryName = (id) => {
        if (!Array.isArray(categories)) return 'Loading...';
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : 'Unknown';
    };

    const handleExpenseAdded = () => {
        handleClose();
        onExpenseAdded();  // Notify parent to refresh
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 4, borderRadius: 0 }}>
            {/* Title */}
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                My Expenses
            </Typography>

            {/* Buttons + Filter */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1
                }}
            >
                <Box display="flex" gap={2}>
                    <Tooltip title="Add Expense">
                        <IconButton
                            size='small'
                            onClick={handleOpen}
                            sx={commonIconButtonStyles}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    {deleteMode && selectedExpenses.length > 0 && (
                        <IconButton
                            size='small'
                            sx={{ color: 'white', backgroundColor: 'red' }}
                            onClick={handleDeleteExpenses}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}

                    <Tooltip title="Delete Expenses">
                        <IconButton
                            size='small'
                            color={deleteMode ? "error" : "default"}
                            onClick={toggleDeleteMode}
                            sx={commonIconButtonStyles}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    <ExportButtons expenses={expenses} getCategoryName={getCategoryName} />
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <Tooltip title="Filter By Category">
                        <IconButton
                            size='small'
                            onClick={() => setCategoryFilterOpen(true)}
                            sx={commonIconButtonStyles}
                        >
                            <FilterAltIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter By Date">
                        <IconButton
                            size='small'
                            onClick={handleFilterOpen}
                            sx={commonIconButtonStyles}
                        >
                            <EditCalendarIcon />
                        </IconButton>
                    </Tooltip>

                    <Modal open={filterOpen} onClose={handleFilterClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 3,
                                outline: 'none',
                            }}
                        >
                            <DateRangeFilter
                                selectedDateRange={selectedDateRange}
                                onApply={(range) => {
                                    setSelectedDateRange({
                                        startDate: range.startDate,
                                        endDate: range.endDate,
                                    });
                                    handleFilterClose();
                                }}
                            />
                        </Box>
                    </Modal>
                    <CategoryFilter
                        open={categoryFilterOpen}
                        onClose={() => setCategoryFilterOpen(false)}
                        onApply={(selectedCategory) => {
                            setSelectedCategory(selectedCategory);
                            onApplyCategoryFilter(selectedCategory.id, selectedCategory.name);
                            setCategoryFilterOpen(false);
                        }}
                    />
                </Box>
            </Box>
            {selectedCategory && selectedCategory.name && (
                <Stack direction="row" spacing={1} mb={2} justifyContent="flex-end">
                    <Chip
                        label={`Category: ${selectedCategory.name}`}
                        onDelete={onClearCategoryFilter}
                        color="primary"
                        sx={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'white',
                            '&:hover': { backgroundColor: '#2d005c' },
                        }}
                    />
                </Stack>
            )}
            {expenses.length === 0 ? (
                <Typography align="center" color="textSecondary" mt={2}>
                    No expenses to display.
                </Typography>
            ) : (
                <List
                    sx={{
                        maxWidth: 800,
                        mx: 'auto',
                        mb: 3,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                    }}
                >
                    {expenses.map((expense) => (
                        <ListItem
                            key={expense.id}
                            divider
                            sx={{
                                position: 'relative',
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                },
                                paddingRight: 0,
                                paddingLeft: 0,
                            }}
                        >
                            {deleteMode && (
                                <Checkbox
                                    checked={selectedExpenses.includes(expense.id)}
                                    onChange={() => handleSelectExpense(expense.id)}
                                />
                            )}
                            <Box sx={{ flexGrow: 1 }}>
                                {editingExpenseId === expense.id ? (
                                    <Box display="flex" flexDirection="column" gap={1} my={2}>
                                        <TextField
                                            type="number"
                                            value={editValues.amount}
                                            onChange={(e) => handleEditChange('amount', e.target.value)}
                                            label="Amount"
                                            size="small"
                                            sx={inputSx}
                                        />
                                        <TextField
                                            value={editValues.description}
                                            onChange={(e) => handleEditChange('description', e.target.value)}
                                            label="Description"
                                            size="small"
                                            sx={inputSx}
                                        />
                                        <TextField
                                            type="date"
                                            value={editValues.date}
                                            onChange={(e) => handleEditChange('date', e.target.value)}
                                            label="Date"
                                            size="small"
                                            sx={inputSx}
                                            inputProps={{
                                                max: new Date().toISOString().split('T')[0], // Prevent future dates
                                                onKeyDown: (e) => e.preventDefault() // Disable manual input
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <FormControl fullWidth size="small" sx={inputSx}>
                                            <InputLabel id="category-label">Category</InputLabel>
                                            <Select
                                                labelId="category-label"
                                                value={editValues.categoryId}
                                                label="Category"
                                                onChange={(e) => handleEditChange('categoryId', e.target.value)}
                                            >
                                                {categories.map((cat) => (
                                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                ) : (
                                    <ListItemText
                                        primary={`${getCategoryName(expense.categoryId)}: ₹${expense.amount}`}
                                        secondary={expense.description}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    minWidth: 140,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                {editingExpenseId !== expense.id && (
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        {new Date(expense.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                )}
                                {editingExpenseId === expense.id ? (
                                    <>
                                        <Tooltip title="Save">
                                            <IconButton
                                                size="small"
                                                sx={commonIconButtonStyles}
                                                onClick={handleSave}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                            <IconButton
                                                size="small"
                                                sx={{ ...commonIconButtonStyles, ml: 2 }}
                                                onClick={() => setEditingExpenseId(null)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <Tooltip title="Edit Expense">
                                        <IconButton
                                            className="edit-icon"
                                            size="small"
                                            sx={{
                                                ...commonIconButtonStyles,
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                ml: 1,
                                            }}
                                            onClick={() => {
                                                setEditingExpenseId(expense.id);
                                                setEditValues({
                                                    amount: expense.amount,
                                                    description: expense.description,
                                                    date: new Date(expense.date).toISOString().split('T')[0],
                                                    categoryId: expense.categoryId
                                                });
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
            {totalPages > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={pageNo}
                        onChange={(event, value) => setPageNo(value)}
                        sx={{
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: 'var(--color-secondary)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#2d005c',
                                },
                            },
                        }}
                    />
                </Box>
            )}

            <Modal open={open} onClose={handleClose}>
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                                Add New Expense
                            </Typography>
                        </Box>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <AddExpenseForm onSuccess={handleExpenseAdded} />
                </Paper>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Expense added successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyExpenses;
