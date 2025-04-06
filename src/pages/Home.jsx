import { Link } from "react-router-dom";
import { Box, useMediaQuery } from '@mui/material';
import MyExpenses from "../components/MyExpenses.jsx";
import SpendingCharts from "../components/SpendingCharts.jsx";

export default function Home() {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        p: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ flex: 1, minWidth: '400px' }}>
        <MyExpenses />
      </Box>

      <Box sx={{ flex: 1, minWidth: '400px' }}>
        <SpendingCharts />
      </Box>
    </Box>
  );
}
