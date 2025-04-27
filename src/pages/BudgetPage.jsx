import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { BudgetContext } from "../context/BudgetContext";
import { CategoryContext } from "../context/CategoryContext";

export default function BudgetPage() {
  const {
    totalBudget,
    categoryBudgets,
    saveTotalBudget,
    saveCategoryBudgets,
    deleteCategoryBudget,
    expenses,
  } = useContext(BudgetContext);
  const { categories } = useContext(CategoryContext);
  const { enqueueSnackbar } = useSnackbar();
  const [localTotalBudget, setLocalTotalBudget] = useState("");
  const [localCategoryBudgets, setLocalCategoryBudgets] = useState([]);
  const [newBudgets, setNewBudgets] = useState([
    { categoryId: "", budget: "" },
  ]);
  const [showNewCategorySection, setShowNewCategorySection] = useState(false);
  const [loading, setLoading] = useState({
    total: false,
    categories: false,
    new: false,
  });
  const [overBudget, setOverBudget] = useState({
    total: false,
    categories: [],
  });

  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (totalBudget !== null) setLocalTotalBudget(totalBudget);
  }, [totalBudget]);

  useEffect(() => {
    setLocalCategoryBudgets(categoryBudgets);
  }, [categoryBudgets]);

  useEffect(() => {
    if (!expenses || totalBudget === null) return;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
      return acc;
    }, {});

    const crossedCategories = (categoryBudgets || []).filter((catBud) => {
      const spent = categoryTotals[catBud.categoryId] || 0;
      return spent > catBud.budget;
    });

    setOverBudget({
      total: totalSpent > totalBudget,
      categories: crossedCategories.map((cat) => cat.categoryId),
    });
  }, [expenses, totalBudget, categoryBudgets]);

  const handleCategoryBudgetChange = (index, value) => {
    const updated = [...localCategoryBudgets];
    updated[index].budget = value;
    setLocalCategoryBudgets(updated);
  };

  const handleDeleteCategoryBudget = async (index) => {
    const categoryToDelete = localCategoryBudgets[index];
    if (!categoryToDelete) return;
    try {
      await deleteCategoryBudget(categoryToDelete.categoryId);
      enqueueSnackbar(`Deleted budget for ${categoryToDelete.categoryName}`);
    } catch (error) {
      enqueueSnackbar("Failed to delete budget");
    }
  };

  const handleNewBudgetChange = (index, field, value) => {
    const updated = [...newBudgets];
    updated[index][field] =
      field === "budget" ? parseFloat(value) || "" : value;
    setNewBudgets(updated);
  };

  const addNewBudgetField = () => {
    setNewBudgets([...newBudgets, { categoryId: "", budget: "" }]);
  };

  const handleSaveAllBudgets = async () => {
    setLoading((prev) => ({ ...prev, total: true, categories: true }));
    await saveTotalBudget(parseFloat(localTotalBudget));
    await saveCategoryBudgets(localCategoryBudgets);
    enqueueSnackbar("All budget changes saved!");
    setLoading((prev) => ({ ...prev, total: false, categories: false }));
  };

  const handleSaveNewBudgets = async () => {
    const valid = newBudgets.filter(
      (entry) => entry.categoryId && entry.budget
    );
    if (valid.length === 0) return;

    const formatted = valid.map((entry) => ({
      categoryId: parseInt(entry.categoryId),
      budget: entry.budget,
      categoryName:
        categories.find((c) => c.id === parseInt(entry.categoryId))?.name || "",
    }));

    const allBudgets = [...localCategoryBudgets, ...formatted];
    setLoading((prev) => ({ ...prev, new: true }));
    await saveCategoryBudgets(allBudgets);
    enqueueSnackbar("New category budgets added!");
    setNewBudgets([{ categoryId: "", budget: "" }]);
    setShowNewCategorySection(false);
    setLoading((prev) => ({ ...prev, new: false }));
  };

  const amountSpent = (expenses || []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Navbar
        expenses={expenses}
        categoryBudgets={categoryBudgets}
        totalBudget={totalBudget}
        overBudget={overBudget}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 3,
          py: 2,
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            pr: isMobile ? 0 : 2,
            pb: isMobile ? 2 : 0,
            width: isMobile ? "100%" : "50%",
          }}
        >
          <Paper elevation={2} sx={{}}>
            <Typography variant="h6" mb={2} gutterBottom>
              Total Monthly Budget
            </Typography>
            <Stack direction="row">
              <FormControl fullWidth variant="standard">
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  placeholder="Enter your total budget"
                  value={localTotalBudget}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setLocalTotalBudget("");
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      if (numValue === 0) {
                        setLocalTotalBudget("0");
                      } else {
                        setLocalTotalBudget(numValue.toString());
                      }
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
                  startAdornment={
                    <InputAdornment position="start" sx={{ pl: 1 }}>
                      ₹
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Stack>
            <Typography mt={2}>
              You have spent <span>₹{amountSpent}</span> this month.
            </Typography>
            <Typography variant="h6" mt={3} gutterBottom>
              Budget Per Category
            </Typography>
            {localCategoryBudgets.length === 0 ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  You have not added budget for any categories yet.
                </Typography>
                <Button
                  sx={{ mt: 1, width: "50%" }}
                  variant="contained"
                  onClick={handleSaveAllBudgets}
                  disabled={loading.total || loading.categories}
                  startIcon={
                    (loading.total || loading.categories) && (
                      <CircularProgress
                        size={20}
                        color="var(--color-primary)"
                      />
                    )
                  }
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Stack
                  spacing={2}
                  sx={{
                    my: 2,
                    position: "relative",
                    border: "1px solid var(--color-secondary)",
                    borderRadius: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    paddingY: 2,
                    paddingX: 2,
                    backgroundColor: "#fff",
                    transition: "box-shadow 0.2s",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {localCategoryBudgets.map((cat, index) => (
                    <Stack direction="row" spacing={2} key={cat.categoryId}>
                      <FormControl fullWidth variant="standard" sx={{ pl: 1 }}>
                        <Input
                          type="number"
                          label={cat.categoryName}
                          value={cat.budget}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              handleCategoryBudgetChange(index, "");
                              return;
                            }
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue >= 0) {
                              if (numValue === 0) {
                                handleCategoryBudgetChange(index, "0");
                              } else {
                                handleCategoryBudgetChange(
                                  index,
                                  numValue.toString()
                                );
                              }
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
                          startAdornment={
                            <InputAdornment position="start">₹</InputAdornment>
                          }
                        />
                        <FormHelperText
                          id="standard-weight-helper-text"
                          sx={{ color: "var(--color-secondary)" }}
                        >
                          {cat.categoryName}
                        </FormHelperText>
                      </FormControl>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCategoryBudget(index)}
                        sx={{ p: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  sx={{ mt: 1, width: "50%" }}
                  variant="contained"
                  onClick={handleSaveAllBudgets}
                  disabled={loading.total || loading.categories}
                  startIcon={
                    (loading.total || loading.categories) && (
                      <CircularProgress
                        size={20}
                        color="var(--color-primary)"
                      />
                    )
                  }
                >
                  Save Changes
                </Button>
              </>
            )}
          </Paper>
        </Box>

        {/* Right Section - Add New Category Budgets */}
        <Box
          sx={{
            pb: isMobile ? 0 : 2,
            pt: isMobile ? 2 : 0,
            pl: isMobile ? 0 : 2,
            width: isMobile ? "100%" : "50%",
          }}
        >
          <Paper elevation={2}>
            <Typography variant="h6" mb={2} gutterBottom>
              Add Category Budgets
            </Typography>
            <Stack spacing={2}>
              {newBudgets.map((entry, index) => (
                <Stack direction="row" spacing={2} key={index}>
                  <FormControl fullWidth>
                    <InputLabel>Select Category</InputLabel>
                    <Select
                      value={entry.categoryId}
                      label="Select Category"
                      onChange={(e) =>
                        handleNewBudgetChange(
                          index,
                          "categoryId",
                          e.target.value
                        )
                      }
                    >
                      {categories
                        .filter(
                          (cat) =>
                            !localCategoryBudgets.some(
                              (existing) => existing.categoryId === cat.id
                            ) &&
                            !newBudgets.some(
                              (nb, i) =>
                                nb.categoryId === cat.id.toString() &&
                                i !== index
                            )
                        )
                        .map((cat) => (
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
                    onChange={(e) =>
                      handleNewBudgetChange(index, "budget", e.target.value)
                    }
                    fullWidth
                  />
                </Stack>
              ))}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
                  startIcon={
                    loading.new && (
                      <CircularProgress
                        size={20}
                        color="var(--color-primary)"
                      />
                    )
                  }
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
