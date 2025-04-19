import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { Box, Popover, IconButton, Typography } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function DateRangeFilter({ onDateRangeChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (onDateRangeChange) {
      onDateRangeChange(range[0]);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          backgroundColor: '#130037',
          color: 'white',
          '&:hover': { backgroundColor: '#2d005c' }
        }}
      >
        <Typography variant="caption" sx={{ px: 1, fontWeight: 'bold' }}>
          Filter
        </Typography>
        <FilterAltIcon fontSize="small" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <DateRange
            editableDateInputs={true}
            onChange={item => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
        </Box>
      </Popover>
    </>
  );
}
