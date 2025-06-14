import React from 'react';
import { useAlgo } from '../context/AlgoContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';

function Navbar() {
  const { account, connectWallet } = useAlgo();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Tokenization Platform
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/manage"
            >
              Manage Tokens
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/recover"
            >
              Recover Tokens
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/actions"
            >
              Token Actions
            </Button>
            {account ? (
              <Button
                color="inherit"
                startIcon={<WalletIcon />}
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Button>
            ) : (
              <Button
                color="inherit"
                startIcon={<WalletIcon />}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
