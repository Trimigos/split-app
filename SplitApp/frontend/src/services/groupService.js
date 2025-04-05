import api from './api';

const groupService = {
  // Get all groups for current user
  getGroups: () => {
    return api.get('/groups');
  },
  
  // Get a specific group by ID
  getGroup: (groupId) => {
    return api.get(`/groups/${groupId}`);
  },
  
  // Create a new group
  createGroup: (groupData) => {
    return api.post('/groups', groupData);
  },
  
  // Update an existing group
  updateGroup: (groupId, groupData) => {
    return api.put(`/groups/${groupId}`, groupData);
  },
  
  // Delete a group
  deleteGroup: (groupId) => {
    return api.delete(`/groups/${groupId}`);
  },
  
  // Add a member to a group
  addMember: (groupId, memberData) => {
    return api.post(`/groups/${groupId}/members`, memberData);
  },
  
  // Remove a member from a group
  removeMember: (groupId, memberId) => {
    return api.delete(`/groups/${groupId}/members/${memberId}`);
  }
};

export default groupService;