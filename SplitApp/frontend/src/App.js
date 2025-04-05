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
import ProtectedRoute from './components/auth/ProtectedRoute';

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
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/groups" element={
                <ProtectedRoute>
                  <GroupList />
                </ProtectedRoute>
              } />
              <Route path="/groups/:id" element={
                <ProtectedRoute>
                  <GroupDetail />
                </ProtectedRoute>
              } />
              <Route path="/groups/create" element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <ExpenseList />
                </ProtectedRoute>
              } />
              <Route path="/expenses/create" element={
                <ProtectedRoute>
                  <CreateExpense />
                </ProtectedRoute>
              } />
              <Route path="/settlements" element={
                <ProtectedRoute>
                  <SettlementList />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
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