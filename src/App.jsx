import { Button, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to FinFlow 💰
      </Typography>
      <Button variant="contained" color="primary">
        Track Your Expenses easily with FinFlow
      </Button>
    </Container>
  );
}

export default App;
