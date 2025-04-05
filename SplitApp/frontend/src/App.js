import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import Dashboard from './components/pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import GroupList from './components/groups/GroupList';
import GroupDetail from './components/groups/GroupDetail';
import CreateGroup from './components/groups/CreateGroup';
import ExpenseList from './components/expenses/ExpenseList';
import CreateExpense from './components/expenses/CreateExpense';
import SettlementList from './components/settlements/SettlementList';
import Profile from './components/user/Profile';
import NotFound from './components/pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/groups" element={<GroupList />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/groups/create" element={<CreateGroup />} />
              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/expenses/create" element={<CreateExpense />} />
              <Route path="/settlements" element={<SettlementList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;