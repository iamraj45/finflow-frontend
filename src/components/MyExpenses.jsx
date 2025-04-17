import React, { useState, useContext } from 'react';
import {
    Box,
    Typography,
    Tooltip,
    Modal,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddExpenseForm from './AddExpenseForm';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../utils/axios';
import { CategoryContext } from '../context/CategoryContext';
import ExportButtons from './ExportButtons';

const MyExpenses = ({ expenses, onExpenseAdded }) => {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { categories } = useContext(CategoryContext);

    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: 'white',
                    pb: 2,
                    pt: 1,
                    borderBottom: '1px solid #ddd'
                }}
            >
                <Typography variant="h4" sx={{ textAlign: 'left' }}>
                    My Expenses
                </Typography>

                <Box display="flex" gap={2}>
                    <Tooltip title="Add Expense">
                        <IconButton
                            size='small'
                            onClick={handleOpen}
                            sx={{
                                backgroundColor: '#130037',
                                color: 'white',
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: '#2d005c',
                                }
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    {deleteMode && selectedExpenses.length > 0 && (
                        <IconButton
                            size='small'
                            sx={{
                                color: 'white',
                                backgroundColor: 'red',
                                ml: 1,
                            }}
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
                            sx={{
                                backgroundColor: '#130037',
                                color: 'white',
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: '#2d005c',
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <ExportButtons expenses={expenses} getCategoryName={getCategoryName} />
                </Box>
            </Box>

            <List
                sx={{
                    maxWidth: 800,
                    mx: 'auto',
                    mb: 3,
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    pr: 1
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
                            <ListItemText
                                primary={`${getCategoryName(expense.categoryId)}: ₹${expense.amount}`}
                                secondary={expense.description}
                            />
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
                            <Tooltip title="Edit Expense">
                                <IconButton
                                    className="edit-icon"
                                    size='small'
                                    sx={{
                                        opacity: 0,
                                        transition: 'opacity 0.3s',
                                        backgroundColor: '#130037',
                                        color: 'white',
                                        ml: 1,
                                        '&:hover': {
                                            backgroundColor: '#2d005c',
                                        }
                                    }}
                                    onClick={() => alert(`Edit clicked for ID ${expense.id}`)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </ListItem>
                ))}
            </List>

            <Modal open={open} onClose={handleClose}>
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ color: '#130037', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
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
