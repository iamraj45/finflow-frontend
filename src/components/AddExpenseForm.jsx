import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Utilities' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Health' },
    { id: 6, name: 'Groceries' },
    { id: 7, name: 'Shopping' },
    { id: 8, name: 'Education' },
    { id: 9, name: 'Travel' },
    { id: 10, name: 'Rent' },
    { id: 11, name: 'Subscriptions' },
    { id: 12, name: 'Others' },
];

const AddExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Start loading

        const expenseData = {
            id: 0,
            userId: 9,
            categoryId: categoryId,
            amount: parseFloat(amount),
            description,
            date: new Date(date).getTime(), // convert to epoch millis
        };

        try {
            const response = await axios.post(
                "https://expense-tracker-hoj5.onrender.com/api/unsecure/expenses/addExpense",
                expenseData
            );

            if (response.data.status === true) {
                alert("Expense added successfully!");

                // Clear form fields
                setAmount("");
                setCategoryId("");
                setDescription("");
                setDate("");
            } else {
                alert("Failed to add expense!");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Error occurred. Check console for details.");
        } finally {
            setLoading(false); // Stop loading
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 5 }}>
                <Typography variant="h5" gutterBottom>Add New Expense</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Description"
                        multiline
                        rows={2}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newDate) => setDate(newDate)}
                        renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Expense"}
                    </Button>

                </Box>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMsg}
                    </Alert>
                </Snackbar>
            </Paper>
        </LocalizationProvider>
    );
};

export default AddExpenseForm;
