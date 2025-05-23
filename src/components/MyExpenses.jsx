import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { useContext, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";
import axios from "../utils/axios";
import AddExpenseForm from "./AddExpenseForm";
import CategoryFilter from "./CategoryFilter";
import DateRangeFilter from "./DateRangeFilter";
import ExportButtons from "./ExportButtons";

const MyExpenses = ({
  expenses,
  onExpenseAdded,
  selectedDateRange,
  setSelectedDateRange,
  selectedCategory,
  setSelectedCategory,
  onApplyCategoryFilter,
  onClearCategoryFilter,
  totalPages,
  pageNo,
  setPageNo,
}) => {
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

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const isMobile = useMediaQuery("(max-width:768px)");

  const inputSx = {
    "& .MuiInputBase-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      width: "100%",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#999",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.95rem",
    },
  };

  const commonIconButtonStyles = {
    backgroundColor: "var(--color-secondary)",
    color: "white",
    "&:hover": {
      backgroundColor: "#2d005c",
    },
  };

  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setSelectedExpenses([]); // Clear selection when toggled
  };

  const handleSelectExpense = (expenseId) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleDeleteExpenses = async () => {
    try {
      const params = new URLSearchParams();
      selectedExpenses.forEach((id) => params.append("expenseId", id));

      const response = await axios.post(
        `${apiUrl}/api/expenses/deleteExpense?${params.toString()}`
      );

      if (response.data.status === true) {
        alert("Expenses deleted successfully");
        onExpenseAdded(); // Refresh the list
        setDeleteMode(false);
        setSelectedExpenses([]);
      } else {
        alert("Failed to delete expenses. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting expenses:", error);
      alert("An error occurred while deleting expenses.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedExpense = {
        id: editingExpenseId,
        amount: parseFloat(editValues.amount),
        description: editValues.description,
        date: new Date(editValues.date).getTime(),
        categoryId: parseInt(editValues.categoryId),
      };
      const response = await axios.post(
        `${apiUrl}/api/expenses/updateExpense`,
        updatedExpense
      );
      if (response.data.status === true) {
        setEditingExpenseId(null);
        setOpenEditDialog(false);
        onExpenseAdded(); // refresh
      } else {
        alert("Failed to update expense");
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Error occurred while updating");
    }
  };

  const getCategoryName = (id) => {
    if (!Array.isArray(categories)) return "Loading...";
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown category";
  };

  const handleExpenseAdded = () => {
    handleClose();
    onExpenseAdded(); // Notify parent to refresh
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ textAlign: "center", p: 0, width: "100%" }}>
      {/* Title */}
      <Typography variant="h5" sx={{ textAlign: "left", mb: 3 }}>
        My Expenses
      </Typography>

      {/* Buttons + Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box display="flex" gap={2}>
          <Tooltip title="Add Expense">
            <IconButton
              size="small"
              onClick={handleOpen}
              sx={{
                ...commonIconButtonStyles,
                ...(isMobile && {
                  // Mobile-specific styles here
                  position: "fixed",
                  bottom: "24px",
                  right: "24px",
                  zIndex: 1000,
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  backgroundColor: "var(--color-secondary)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#2d005c",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.8rem",
                  },
                }),
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          {deleteMode && selectedExpenses.length > 0 && (
            <IconButton
              size="small"
              sx={{ color: "white", backgroundColor: "red" }}
              onClick={handleDeleteExpenses}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <Tooltip title="Delete Expenses">
            <IconButton
              size="small"
              color={deleteMode ? "error" : "default"}
              onClick={toggleDeleteMode}
              sx={commonIconButtonStyles}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <ExportButtons
            expenses={expenses}
            getCategoryName={getCategoryName}
          />
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title="Filter By Category">
            <IconButton
              size="small"
              onClick={() => setCategoryFilterOpen(true)}
              sx={commonIconButtonStyles}
            >
              <FilterAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter By Date">
            <IconButton
              size="small"
              onClick={handleFilterOpen}
              sx={commonIconButtonStyles}
            >
              <EditCalendarIcon />
            </IconButton>
          </Tooltip>

          <Modal open={filterOpen} onClose={handleFilterClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 2,
                p: 3,
                outline: "none",
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
              backgroundColor: "var(--color-secondary)",
              color: "white",
              "&:hover": { backgroundColor: "#2d005c" },
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
            mx: "auto",
            mb: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              sx={{
                position: "relative",
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                paddingY: 1,
                paddingX: 2,
                backgroundColor: "#fff",
                transition: "box-shadow 0.2s",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
                "&:hover .date-text": {
                  transform: "translateX(-40px)",
                },
                "&:hover .edit-icon": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              }}
            >
              {deleteMode && (
                <Checkbox
                  checked={selectedExpenses.includes(expense.id)}
                  onChange={() => handleSelectExpense(expense.id)}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {getCategoryName(expense.categoryId)}: ₹{expense.amount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {expense.description}
                  </Typography>
                </Box>

                <Typography
                  className="date-text"
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "nowrap",
                    transition: "transform 0.3s ease",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Tooltip title="Edit Expense">
                <IconButton
                  className="edit-icon"
                  size="small"
                  sx={{
                    ...commonIconButtonStyles,
                    position: "absolute",
                    right: 16,
                    transform: "translateX(20px)",
                    opacity: 0,
                    transition: "opacity 0.3s, transform 0.3s",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    setEditingExpenseId(expense.id);
                    setEditValues({
                      amount: expense.amount,
                      description: expense.description,
                      date: new Date(expense.date).toLocaleDateString("en-CA"),
                      categoryId: expense.categoryId,
                    });
                    setOpenEditDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      )}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
      >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              type="number"
              startAdornment={
                <InputAdornment position="start">₹</InputAdornment>
              }
              label="Amount"
              value={editValues.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  handleEditChange("amount", "");
                  return;
                }
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0) {
                  handleEditChange("amount", numValue.toString());
                }
              }}
              inputProps={{
                min: 0,
                onKeyDown: (e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                },
              }}
            />
          </FormControl>
          <TextField
            value={editValues.description}
            onChange={(e) => handleEditChange("description", e.target.value)}
            label="Description"
          />
          <TextField
            type="date"
            value={editValues.date}
            onChange={(e) => handleEditChange("date", e.target.value)}
            label="Date"
            inputProps={{
              max: new Date().toISOString().split("T")[0],
              onKeyDown: (e) => e.preventDefault(),
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={editValues.categoryId}
              label="Category"
              onChange={(e) => handleEditChange("categoryId", e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            sx={{ width: isMobile ? "50%" : "auto", px: isMobile ? 0 : 3 }}
            onClick={() => setOpenEditDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              width: isMobile ? "50%" : "auto",
              px: isMobile ? 0 : 3,
              backgroundColor: "var(--color-secondary)",
              "&:hover": { backgroundColor: "#2d005c" },
            }}
            onClick={() => {
              handleSave();
              setOpenEditDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={pageNo}
            onChange={(event, value) => setPageNo(value)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "var(--color-secondary)",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2d005c",
                },
              },
            }}
          />
        </Box>
      )}

      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: isMobile ? "90%" : "40%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  color: "var(--color-secondary)",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Expense added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyExpenses;
