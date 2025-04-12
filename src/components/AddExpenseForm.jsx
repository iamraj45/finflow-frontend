import React, { useState } from 'react';
import axios from '../utils/axios';
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
import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

const AddExpenseForm = ({onSuccess}) => {
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const { categories } = useContext(CategoryContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Start loading

        const expenseData = {
            id: 0,
            userId: localStorage.getItem('userId'),
            categoryId: categoryId,
            amount: parseFloat(amount),
            description,
            date: new Date(date).getTime(), // convert to epoch millis
        };

        if (date > new Date()) {
            setSnackbarMsg("You cannot add an expense for a future date.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            setLoading(false); // Stop loading
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await axios.post(
                `${apiUrl}/api/expenses/addExpense`,
                expenseData
            );

            if (response.data.status === true) {
                setAmount("");
                setCategoryId("");
                setDescription("");
                setDate(new Date());
                if (onSuccess) {
                    onSuccess(); // This will close the modal and refresh expenses
                }
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
            <Paper elevation={6} sx={{
                p: { xs: 2, sm: 3, md: 4 },
                width: '80%',
                maxWidth: { xs: '80%', sm: 400, md: 500 },
                mx: 'auto',
                boxShadow: 'none',
            }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField
                        label="Amount"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        InputLabelProps={{ required: false }}
                    />
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        InputLabelProps={{ required: false }}
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
                        maxDate={new Date()}
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
