import React, { useState } from 'react';
import {
    IconButton,
    Tooltip,
    Menu,
    MenuItem
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ expenses, getCategoryName }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Category', 'Amount', 'Description', 'Date'],
            ...expenses.map(exp => [
                getCategoryName(exp.categoryId),
                exp.amount,
                `"${exp.description}"`,
                new Date(exp.date).toLocaleDateString()
            ])
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expenses.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        handleClose();
    };

    const exportToPDF = async () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('My Expenses', 14, 15);

        const headers = ['Category', 'Amount', 'Description', 'Date'];
        const rows = expenses.map(exp => [
            getCategoryName(exp.categoryId),
            `₹${exp.amount}`,
            exp.description,
            new Date(exp.date).toLocaleDateString()
        ]);

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 25,
            styles: { fontSize: 10 }
        });

        doc.save('expenses.pdf');
        handleClose();
    };

    return (
        <>
            <Tooltip title="Export Expenses">
                <IconButton
                    size="small"
                    onClick={handleClick}
                    sx={{
                        backgroundColor: '#130037',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#2d005c',
                        }
                    }}
                >
                    <FileDownloadIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'export-button' }}
            >
                <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
                <MenuItem onClick={exportToPDF}>Export as PDF</MenuItem>
            </Menu>
        </>
    );
};

export default ExportButtons;
