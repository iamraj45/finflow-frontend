import React, { useState } from 'react';
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { Button, Box } from '@mui/material';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangeFilter = ({ onApply }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [localRange, setLocalRange] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: 'selection',
    },
  ]);
  
  const handleApply = () => {
    onApply(localRange[0]);
  };

  return (
    <Box>
      <DateRangePicker
        onChange={(item) => setLocalRange([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={localRange}
        direction="horizontal"
      />
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#130037', '&:hover': { backgroundColor: '#2d005c' } }}
          onClick={handleApply}
        >
          Apply Filter
        </Button>
      </Box>
    </Box>
  );
};

export default DateRangeFilter;
