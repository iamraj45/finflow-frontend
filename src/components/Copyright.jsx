import { Typography, Link } from '@mui/material';

export default function Copyright() {
  return (
    <Typography variant="body2" fontWeight="bold" color="text.primary" align="center">
      {'© '}
      <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
        FinFlow
      </Link>{' '}
      {new Date().getFullYear()}
      {''}
    </Typography>
  );
}
