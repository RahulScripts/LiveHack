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
} from '@mui/material';
import { Restore as RestoreIcon } from '@mui/icons-material';

function TokenRecovery() {
  const { account, loading, error, recoverTokens } = useAlgo();
  const [userId, setUserId] = useState('');
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
      const txId = await recoverTokens(userId);
      setTxId(txId);
      setSuccess(true);
      setUserId('');
    } catch (err) {
      console.error('Recovery failed:', err);
    }
  };

  if (!account) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please connect your wallet first to recover tokens.
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
              Token Recovery
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Recover your lost tokens by providing your user identifier. This could be your email hash or any unique identifier associated with your account.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleRecovery}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="User Identifier"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    helperText="Enter your user identifier (email hash, user ID, etc.)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<RestoreIcon />}
                    disabled={loading || !userId}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Recover Tokens'}
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
                Recovery Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • You can recover your tokens up to 3 times
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • There is a 24-hour cooldown period between recovery attempts
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • The recovered tokens will have the same metadata as your original tokens
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={`Recovery successful! Transaction ID: ${txId}`}
      />
    </Container>
  );
}

export default TokenRecovery;
