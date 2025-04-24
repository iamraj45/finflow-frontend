import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Link,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

const TermsAndConditions = ({ agreed, setAgreed, setError }) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
    if (e.target.checked) setError('');
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={agreed}
            onChange={handleCheckboxChange}
          />
        }
        label={
          <Typography variant="body2">
            I agree to the{' '}
            <Link sx={{verticalAlign: 'bottom'}} component="button" onClick={() => setOpen(true)}>
              Terms & Conditions
            </Link>
          </Typography>
        }
        sx={{ mt: 1 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Dialog>Terms & Conditions</Dialog>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            Welcome to FinFlow! By creating an account, you agree to:
          </Typography>
          <ul style={{ paddingLeft: '1rem' }}>
            <li>
              Use FinFlow only for personal financial tracking purposes.
            </li>
            <li>
              Not share your login credentials with others.
            </li>
            <li>
              Acknowledge that FinFlow does not offer financial advice or guarantee accuracy of financial summaries.
            </li>
            <li>
              Allow us to store and process your data in accordance with our privacy policy.
            </li>
            <li>
              Accept that we may update these terms, and it's your responsibility to review them.
            </li>
          </ul>
          <Typography variant="body2" mt={2}>
            If you have questions, feel free to contact our support team.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TermsAndConditions;
