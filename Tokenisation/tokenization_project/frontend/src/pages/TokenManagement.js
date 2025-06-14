import React, { useState } from 'react';
import { useAlgo } from '../context/AlgoContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

function TokenManagement() {
  const { account, tokenBalance, loading, error, transferTokens } = useAlgo();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const txId = await transferTokens(receiver, parseInt(amount * 1e6));
      setTxId(txId);
      setSuccess(true);
      setReceiver('');
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const formatBalance = (amount) => {
    return (amount / 1e6).toFixed(6);
  };

  if (!account) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please connect your wallet first to manage tokens.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Token Management
            </Typography>
            <Typography variant="body1" gutterBottom>
              Current Balance: {formatBalance(tokenBalance)} MTK
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transfer Tokens
            </Typography>
            <Box component="form" onSubmit={handleTransfer}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Receiver Address"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    required
                    helperText="Enter the Algorand address to send tokens to"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    inputProps={{ step: "0.000001" }}
                    helperText="Enter the amount of tokens to send"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={loading || !receiver || !amount}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Transfer Tokens'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={`Transfer successful! Transaction ID: ${txId}`}
      />
    </Container>
  );
}

export default TokenManagement;
