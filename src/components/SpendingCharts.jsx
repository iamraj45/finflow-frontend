import { Box, Typography } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryContext } from "../context/CategoryContext";

function generateColors(count) {
  const colors = [];
  const avoidRedRanges = [
    [0, 20],
    [340, 360],
  ];

  let hueStep = 360 / (count * 1.2);
  let hue = 0;
  while (colors.length < count) {
    const inRedRange = avoidRedRanges.some(
      ([min, max]) => hue >= min && hue <= max
    );
    if (!inRedRange) {
      colors.push(`hsl(${Math.round(hue)}, 80%, 50%)`);
    }
    hue += hueStep;
    if (hue > 360) hue -= 360; // wrap around
  }
  return colors;
}

const SpendingCharts = ({
  expenses,
  totalBudget,
  categoryBudgets,
  overBudget,
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const { categories } = useContext(CategoryContext);
  const [showTotalAlert, setShowTotalAlert] = useState(true);
  const [showCategoryAlert, setShowCategoryAlert] = useState(true);

  const amountSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percentageUsed = (amountSpent / totalBudget) * 100;

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const categoryMap = {};
    let totalAmount = 0;

    expenses.forEach((exp) => {
      totalAmount += exp.amount;
      categoryMap[exp.categoryId] =
        (categoryMap[exp.categoryId] || 0) + exp.amount;
    });

    const categoryWise = Object.entries(categoryMap)
      .map(([id, amt]) => {
        const categoryName =
          categories.find((cat) => cat.id === parseInt(id))?.name || "Unknown";
        return {
          categoryId: id,
          category: categoryName,
          amount: amt,
          percentage: totalAmount > 0 ? (amt / totalAmount) * 100 : 0,
        };
      })
      .filter((entry) => entry.percentage > 0);

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("en-CA");
    });

    const dateMap = {};
    expenses.forEach((exp) => {
      const dateStr = new Date(exp.date).toLocaleDateString("en-CA"); // 'YYYY-MM-DD' format
      dateMap[dateStr] = (dateMap[dateStr] || 0) + exp.amount;
    });

    const last7Data = last7Days.map((date) => ({
      date,
      Amount: dateMap[date] || 0,
    }));

    // Add an extra field for tooltips with formatting already applied
    const maxAmount = Math.max(...last7Data.map((d) => d.Amount));
    const highlightedData = last7Data.map((d) => ({
      ...d,
      label: d.Amount === maxAmount ? `₹${d.Amount} (Highest)` : `₹${d.Amount}`,
      isMax: d.Amount === maxAmount,
    }));

    setDateData(highlightedData);
    setCategoryData(categoryWise);
  }, [expenses, categories]);

  const COLORS = generateColors(categoryData.length);

  const overLimitCategories = categoryData
    .filter((entry) =>
      overBudget?.categories?.includes(parseInt(entry.categoryId))
    )
    .map((entry) => entry.category);

  const transformedData = categoryData.map((entry) => {
    const categoryId = parseInt(entry.categoryId);
    const budgetEntry = categoryBudgets?.find(
      (b) => b.categoryId === categoryId
    );

    if (!budgetEntry) {
      return {
        ...entry,
        withinBudget: entry.amount,
        overBudget: 0,
        hasBudget: false,
      };
    }

    const budget = budgetEntry.budget;
    return {
      ...entry,
      withinBudget: entry.amount > budget ? budget : entry.amount,
      overBudget: entry.amount > budget ? entry.amount - budget : 0,
      hasBudget: true,
    };
  });

  return (
    <Box sx={{ textAlign: "left", p: 0, width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2.5 }}>
        Monthly Spendings
      </Typography>
      {expenses.length === 0 ? (
        <Typography variant="h5" color="textSecondary" sx={{ py: 5 }}>
          No expenses found. Start by adding some to view your charts!
        </Typography>
      ) : (
        <>
          {totalBudget > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">
                Amount spent this month: ₹{amountSpent} / ₹{totalBudget}.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  mb: 2,
                }}
              >
                <span
                  style={{
                    color: percentageUsed >= 90 ? "red" : "var(--color-secondary)", 
                    fontWeight: 'bold',
                  }}
                >
                  {percentageUsed.toFixed(2)}%
                </span>{" "} of your budget has been utilized.
                <Link
                  to="/budget"
                  style={{ textDecoration: "none", fontWeight: "bold" }}
                >
                  {" "}
                  Change budget?
                </Link>
              </Typography>

              <Box
                sx={{
                  height: 17,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${percentageUsed}%`,
                    backgroundColor:
                      amountSpent > totalBudget ? "#d32f2f" : "#261052",
                    height: "100%",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Bar Chart */}
          <Box
            mt={2}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              paddingY: 1,
              // paddingX: 2,
              backgroundColor: "#fff",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <BarChart
              height={350}
              dataset={transformedData}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "category",
                  categoryGapRatio: 0.4,
                },
              ]}
              series={[
                {
                  dataKey: "withinBudget",
                  label: "Within Budget",
                  stack: "a",
                  color: "#261052", // Use one consistent color
                },
                {
                  dataKey: "overBudget",
                  label: "Over Budget",
                  stack: "a",
                  color: "#d32f2f", // Red for over budget
                },
              ]}
            />
          </Box>

          {/* Pie Chart */}
          <Box
            mt={4}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              paddingY: 1,
              // paddingX: 2,
              backgroundColor: "#fff",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <PieChart
              height={250}
              width={250} 
              sx={{mx: 2}}
              series={[
                {
                  arcLabel: (item) => `${item.value.toFixed(0)}%`, 
                  arcLabelMinAngle: 20, // Minimum angle before showing labels
                  data: categoryData.map((entry, index) => ({
                    id: entry.category,
                    value: entry.percentage,
                    label: entry.category,
                    color: COLORS[index % COLORS.length], 
                  })),
                  highlightScope: { fade: "global", highlight: "item" }, // Highlight functionality for slices
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  }, 
                },
              ]}
              slotProps={{
                legend: { hidden: false },
              }}
            />
          </Box>

          {/* Line Chart */}
          <Box mt={4}>
            <Typography variant="h5" sx={{}}>
              Last 7 Days Spendings
            </Typography>
            <Box
              sx={{
                mt: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                paddingY: 1,
                // paddingX: 2,
                backgroundColor: "#fff",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <LineChart
                height={300}
                xAxis={[{ scaleType: "point", dataKey: "date" }]}
                dataset={dateData}
                series={[
                  {
                    dataKey: "Amount",
                    label: "Amount",
                    color: "#6a1b9a",
                    showMark: true,
                  },
                ]}
                tooltip={{
                  trigger: "item",
                  formatter: ({ data }) =>
                    `Date: ${data.date}<br/>Amount: ₹${data.Amount}${
                      data.isMax ? " (Highest)" : ""
                    }`,
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SpendingCharts;
