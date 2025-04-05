import api from './api';

const settlementService = {
  // Get all settlements (optionally filtered by group)
  getSettlements: (groupId = null) => {
    return groupId 
      ? api.get(`/groups/${groupId}/settlements`)
      : api.get('/settlements');
  },
  
  // Get a specific settlement by ID
  getSettlement: (settlementId) => {
    return api.get(`/settlements/${settlementId}`);
  },
  
  // Create a new settlement
  createSettlement: (settlementData) => {
    return api.post('/settlements', settlementData);
  },
  
  // Update settlement status (e.g., mark as COMPLETED)
  updateSettlementStatus: (settlementId, status) => {
    return api.put(`/settlements/${settlementId}/status`, { status });
  },
  
  // Get unsettled balances for a group
  getUnsettledBalances: (groupId) => {
    return api.get(`/groups/${groupId}/balances`);
  },
  
  // Get suggested settlements for a group
  getSuggestedSettlements: (groupId) => {
    return api.get(`/groups/${groupId}/suggested-settlements`);
  }
};

export default settlementService;