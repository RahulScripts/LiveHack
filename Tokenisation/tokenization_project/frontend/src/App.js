import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AlgoProvider } from './context/AlgoContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TokenManagement from './pages/TokenManagement';
import TokenRecovery from './pages/TokenRecovery';
import TokenActions from './pages/TokenActions';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlgoProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage" element={<TokenManagement />} />
            <Route path="/recover" element={<TokenRecovery />} />
            <Route path="/actions" element={<TokenActions />} />
          </Routes>
        </Router>
      </AlgoProvider>
    </ThemeProvider>
  );
}

export default App;
