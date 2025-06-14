import React from 'react';
import { useAlgo } from '../context/AlgoContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Token as TokenIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

function Dashboard() {
  const {
    account,
    balance,
    tokenBalance,
    loading,
    error,
    connectWallet,
  } = useAlgo();

  const formatBalance = (amount) => {
    return (amount / 1e6).toFixed(6);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!account ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to Tokenization Platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<WalletIcon />}
            onClick={connectWallet}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Connect Wallet'}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Connected Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}
              >
                {account}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WalletIcon sx={{ mr: 1 }} />
                <Typography variant="h6">ALGO Balance</Typography>
              </Box>
              <Typography variant="h3" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                {formatBalance(balance)} ALGO
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TokenIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Token Balance</Typography>
              </Box>
              <Typography variant="h3" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                {formatBalance(tokenBalance)} MTK
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Actions</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/manage"
                    sx={{ height: '100%' }}
                  >
                    Manage Tokens
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/recover"
                    sx={{ height: '100%' }}
                  >
                    Recover Tokens
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;
