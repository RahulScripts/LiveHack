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
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function TokenActions() {
  const { account, tokenBalance, loading, error, contract } = useAlgo();
  const [courseId, setCourseId] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const handleClaimCertificate = async (e) => {
    e.preventDefault();
    try {
      const txId = await contract.claim_certificate(courseId);
      setTxId(txId);
      setSuccess(true);
      setCourseId('');
    } catch (err) {
      console.error('Certificate claim failed:', err);
    }
  };

  const handleBurnTokens = async (e) => {
    e.preventDefault();
    try {
      const amount = parseInt(burnAmount * 1e6);
      const txId = await contract.burn_token(amount);
      setTxId(txId);
      setSuccess(true);
      setBurnAmount('');
    } catch (err) {
      console.error('Token burn failed:', err);
    }
  };

  const formatBalance = (amount) => {
    return (amount / 1e6).toFixed(6);
  };

  if (!account) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please connect your wallet first to perform token actions.
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
              Token Actions
            </Typography>
            <Typography variant="body1" gutterBottom>
              Current Balance: {formatBalance(tokenBalance)} MTK
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Claim Course Certificate
            </Typography>
            <Box component="form" onSubmit={handleClaimCertificate}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course ID"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                    helperText="Enter the course ID to claim certificate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SchoolIcon />}
                    disabled={loading || !courseId}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Claim Certificate'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Burn Tokens
            </Typography>
            <Box component="form" onSubmit={handleBurnTokens}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount to Burn"
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    required
                    inputProps={{ step: "0.000001" }}
                    helperText="Enter the amount of tokens to burn"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    disabled={loading || !burnAmount}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Burn Tokens'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Certificate claiming rewards you with 500 MTK tokens
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • You can only claim each course certificate once
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Burning tokens permanently reduces the total supply
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={`Transaction successful! Transaction ID: ${txId}`}
      />
    </Container>
  );
}

export default TokenActions;
