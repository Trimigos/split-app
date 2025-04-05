import api from './api';

const expenseSplitService = {
  // Get all expense splits
  getAllExpenseSplits: () => {
    return api.get('/expense-splits');
  },
  
  // Get a specific expense split by ID
  getExpenseSplit: (splitId) => {
    return api.get(`/expense-splits/${splitId}`);
  },
  
  // Get expense splits for a specific expense
  getSplitsByExpense: (expenseId) => {
    return api.get(`/expenses/${expenseId}/splits`);
  },
  
  // Get expense splits for a specific user
  getSplitsByUser: (userId) => {
    return api.get(`/users/${userId}/expense-splits`);
  },
  
  // Get unsettled expense splits for a specific user
  getUnsettledSplitsByUser: (userId) => {
    return api.get(`/users/${userId}/expense-splits/unsettled`);
  },
  
  // Create a new expense split
  createExpenseSplit: (expenseSplitData) => {
    return api.post('/expense-splits', expenseSplitData);
  },
  
  // Create multiple expense splits
  createExpenseSplits: (expenseSplits) => {
    return api.post('/expense-splits/batch', expenseSplits);
  },
  
  // Update an existing expense split
  updateExpenseSplit: (splitId, splitData) => {
    return api.put(`/expense-splits/${splitId}`, splitData);
  },
  
  // Delete an expense split
  deleteExpenseSplit: (splitId) => {
    return api.delete(`/expense-splits/${splitId}`);
  },
  
  // Mark an expense split as settled
  markAsSettled: (splitId) => {
    return api.put(`/expense-splits/${splitId}/settle`, { settled: true });
  },
  
  // Mark multiple expense splits as settled
  markMultipleAsSettled: (splitIds) => {
    return api.put('/expense-splits/batch/settle', { splitIds });
  }
};

export default expenseSplitService;