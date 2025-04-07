import { Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import MyExpenses from "../components/MyExpenses.jsx";
import SpendingCharts from "../components/SpendingCharts.jsx";

export default function Home() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [refreshCharts, setRefreshCharts] = useState(false);

  const handleExpenseAdded = () => {
    setRefreshCharts(prev => !prev); // toggle to trigger chart re-fetch
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        p: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ flex: 1, minWidth: '400px' }}>
        <MyExpenses onExpenseAdded={handleExpenseAdded} />
      </Box>

      <Box sx={{ flex: 1, minWidth: '400px' }}>
        <SpendingCharts refresh={refreshCharts} />
      </Box>
    </Box>
  );
}
