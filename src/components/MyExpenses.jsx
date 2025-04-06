import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddExpenseForm from './AddExpenseForm';

const dummyExpenses = [
    { id: 1, category: "Food", amount: 120, description: "Lunch", date: "2024-04-06" },
    { id: 2, category: "Transport", amount: 50, description: "Bus fare", date: "2024-04-05" },
];

const MyExpenses = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>My Expenses</Typography>

            <List sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
                {dummyExpenses.map((expense) => (
                    <ListItem key={expense.id} divider>
                        <ListItemText
                            primary={`${expense.category}: ₹${expense.amount}`}
                            secondary={`${expense.description}`}
                        />
                        <Typography variant="caption" color="textSecondary"/>
                            {new Date(expense.date).toLocaleDateString()}
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <AddExpenseForm onClose={handleClose} />
                </Paper>
            </Modal>
        </Box>
    );
};

export default MyExpenses;
