import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Button, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangeFilter = ({ onApply, selectedDateRange }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [localRange, setLocalRange] = useState([
    {
      startDate: selectedDateRange?.startDate || firstDayOfMonth,
      endDate: selectedDateRange?.endDate || today,
      key: 'selection',
    },
  ]);

  const [isCleared, setIsCleared] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Sync prop changes to internal state
  useEffect(() => {
    if (selectedDateRange?.startDate && selectedDateRange?.endDate) {
      setLocalRange([
        {
          startDate: selectedDateRange.startDate,
          endDate: selectedDateRange.endDate,
          key: 'selection',
        },
      ]);
    }
  }, [selectedDateRange]);

  const handleApply = () => {
    const range = { ...localRange[0] };
    const adjustedEndDate = new Date(range.endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    range.endDate = adjustedEndDate;
    onApply(range);
  };

  const handleReset = () => {
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const defaultRange = {
      startDate: startOfToday,
      endDate: today,
      key: 'selection',
    };

    setLocalRange([defaultRange]);
    setIsCleared(true);
  };

  return (
    <Box>
      <Box
        className={isCleared ? 'no-selection' : ''}
        sx={{
          overflowX: 'auto',
          width: isSmallScreen ? '100%' : 'auto',
          maxWidth: isSmallScreen ? '100%' : 'fit-content',
        }}
      >
        <DateRangePicker
          onChange={(item) => {
            setLocalRange([item.selection]);
            setIsCleared(false);
          }}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={isSmallScreen ? 1 : 2}
          ranges={localRange}
          direction={isSmallScreen ? 'vertical' : 'horizontal'}
          staticRanges={isSmallScreen ? [] : undefined}
          inputRanges={isSmallScreen ? [] : undefined}
        />
      </Box>

      <Box mt={2} display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Button
          variant="contained"
          sx={{ backgroundColor: '#130037', '&:hover': { backgroundColor: '#2d005c' } }}
          onClick={handleApply}
        >
          Apply Filter
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#130037', '&:hover': { backgroundColor: '#2d005c' } }}
          onClick={handleReset}
        >
          Reset Filter
        </Button>
      </Box>
    </Box>
  );
};

export default DateRangeFilter;
