import api from './api';

const expenseService = {
  // Get all expenses (optionally filtered by group)
  getExpenses: (groupId = null) => {
    return groupId 
      ? api.get(`/groups/${groupId}/expenses`)
      : api.get('/expenses');
  },
  
  // Get a specific expense by ID
  getExpense: (expenseId) => {
    return api.get(`/expenses/${expenseId}`);
  },
  
  // Create a new expense
  createExpense: (expenseData) => {
    return api.post('/expenses', expenseData);
  },
  
  // Update an existing expense
  updateExpense: (expenseId, expenseData) => {
    return api.put(`/expenses/${expenseId}`, expenseData);
  },
  
  // Delete an expense
  deleteExpense: (expenseId) => {
    return api.delete(`/expenses/${expenseId}`);
  },
  
  // Get expense splits for a specific expense
  getExpenseSplits: (expenseId) => {
    return api.get(`/expenses/${expenseId}/splits`);
  },
  
  // Update expense splits for a specific expense
  updateExpenseSplits: (expenseId, splitsData) => {
    return api.put(`/expenses/${expenseId}/splits`, splitsData);
  }
};

export default expenseService;