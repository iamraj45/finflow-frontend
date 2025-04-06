import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Typography,
    Button,
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
import axios from 'axios';
import { CategoryContext } from '../context/CategoryContext';

const MyExpenses = () => {
    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const userId = 6; // This can be passed via props or context later
    const { categories } = useContext(CategoryContext);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`https://expense-tracker-hoj5.onrender.com/api/unsecure/expenses/getExpenses?userId=${userId}`);
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [userId]);

    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : 'Unknown';
    };

    const handleExpenseAdded = () => {
        handleClose();
        fetchExpenses();
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>My Expenses</Typography>

            <List sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
                {expenses.map((expense) => (
                    <ListItem key={expense.id} divider>
                        <ListItemText
                            primary={`${getCategoryName(expense.categoryId)}: ₹${expense.amount}`}
                            secondary={expense.description}
                        />
                        <Typography variant="caption" color="textSecondary">
                            {new Date(expense.date).toLocaleDateString()}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            <Button
                variant="contained"
                onClick={handleOpen}
                startIcon={<AddIcon />}
                sx={{
                    backgroundColor: '#130037',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#2d005c',
                    },
                }}
            >
                Add Expense
            </Button>

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
