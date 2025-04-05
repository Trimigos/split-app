import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import {
  Add as AddIcon,
  MonetizationOn,
  AccountBalance,
  Person,
  People,
  Receipt,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon
} from '@material-ui/icons';
import groupService from '../../services/groupService';
import expenseService from '../../services/expenseService';
import settlementService from '../../services/settlementService';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(0, 0, 3, 0),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
  },
  headerButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  groupAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
  groupInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  tabContent: {
    padding: theme.spacing(3),
  },
  infoGrid: {
    marginBottom: theme.spacing(3),
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  memberList: {
    marginTop: theme.spacing(2),
  },
  expensesList: {
    marginTop: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  expenseAmount: {
    fontWeight: 'bold',
  },
  balancePositive: {
    color: theme.palette.success.main,
    fontWeight: 'bold',
  },
  balanceNegative: {
    color: theme.palette.error.main,
    fontWeight: 'bold',
  },
  balanceZero: {
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
  },
  memberChip: {
    margin: theme.spacing(0.5),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function GroupDetail() {
  const classes = useStyles();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch group data
        const groupResponse = await groupService.getGroup(id);
        setGroup(groupResponse.data);
        
        if (groupResponse.data && groupResponse.data.members) {
          setMembers(groupResponse.data.members);
        }
        
        // Fetch expenses for this group
        const expensesResponse = await expenseService.getExpenses(id);
        setExpenses(expensesResponse.data);
        
        // Fetch settlements for this group
        const settlementsResponse = await settlementService.getSettlements(id);
        setSettlements(settlementsResponse.data);
        
        // Fetch balances for this group
        const balancesResponse = await settlementService.getUnsettledBalances(id);
        setBalances(balancesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setError('Failed to load group details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAddMemberDialogOpen = () => {
    setAddMemberDialog(true);
  };
  
  const handleAddMemberDialogClose = () => {
    setAddMemberDialog(false);
    setNewMemberEmail('');
  };
  
  const handleAddMember = async () => {
    try {
      if (!newMemberEmail || !newMemberEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return;
      }

      await groupService.addMember(id, { email: newMemberEmail });
      
      // Refresh members list
      const groupResponse = await groupService.getGroup(id);
      if (groupResponse.data && groupResponse.data.members) {
        setMembers(groupResponse.data.members);
      }
      
      handleAddMemberDialogClose();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await groupService.removeMember(id, memberId);
        
        // Update members list
        setMembers(members.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Container className={classes.container}>
        <Typography variant="h5">
          Group not found
        </Typography>
        <Button 
          component={RouterLink} 
          to="/groups"
          variant="contained" 
          color="primary"
          style={{ marginTop: 16 }}
        >
          Back to Groups
        </Button>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <div className={classes.groupInfo}>
            <Avatar className={classes.groupAvatar}>
              {group.name.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="h4" component="h1">
                {group.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {group.description}
              </Typography>
            </div>
          </div>
          
          <div className={classes.headerButtons}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to={`/expenses/create?groupId=${group.id}`}
            >
              Add Expense
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AccountBalance />}
              component={RouterLink}
              to={`/settlements/new?groupId=${group.id}`}
            >
              Settle Up
            </Button>
          </div>
        </div>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="Expenses" />
          <Tab label="Members" />
          <Tab label="Settlements" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <div className={classes.tabContent}>
            <Grid container spacing={3} className={classes.infoGrid}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" className={classes.paper}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ${group.totalExpenses.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" className={classes.paper}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Members
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {members.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" className={classes.paper}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Expenses
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {expenses.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" className={classes.paper}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created On
                  </Typography>
                  <Typography variant="h6">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Balances
            </Typography>
            <List>
              {balances.map((balance, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {balance.member.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={balance.member} />
                    <ListItemSecondaryAction>
                      <Typography 
                        className={
                          balance.balance > 0 
                            ? classes.balancePositive 
                            : balance.balance < 0 
                              ? classes.balanceNegative 
                              : classes.balanceZero
                        }
                      >
                        {balance.balance > 0 ? '+' : ''}
                        ${balance.balance.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < balances.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom style={{ marginTop: 24 }}>
              Recent Expenses
            </Typography>
            <List>
              {expenses.slice(0, 3).map((expense, index) => (
                <React.Fragment key={expense.id}>
                  <ListItem button component={RouterLink} to={`/expenses/${expense.id}`}>
                    <ListItemAvatar>
                      <Avatar>
                        <Receipt />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={expense.description} 
                      secondary={`Paid by ${expense.paidBy} on ${new Date(expense.date).toLocaleDateString()}`} 
                    />
                    <ListItemSecondaryAction>
                      <Typography className={classes.expenseAmount}>
                        ${expense.amount.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < Math.min(2, expenses.length - 1) && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            {expenses.length > 3 && (
              <Button
                color="primary"
                onClick={() => setTabValue(1)}
                style={{ marginTop: 8 }}
              >
                View all expenses
              </Button>
            )}
          </div>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <div className={classes.tabContent}>
            <div className={classes.header}>
              <Typography variant="h6">
                All Expenses
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={RouterLink}
                to={`/expenses/create?groupId=${group.id}`}
              >
                Add Expense
              </Button>
            </div>
            
            {expenses.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No expenses added yet.
              </Typography>
            ) : (
              <List className={classes.expensesList}>
                {expenses.map((expense, index) => (
                  <React.Fragment key={expense.id}>
                    <ListItem button component={RouterLink} to={`/expenses/${expense.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <MonetizationOn />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={expense.description} 
                        secondary={`Paid by ${expense.paidBy} on ${new Date(expense.date).toLocaleDateString()}`} 
                      />
                      <ListItemSecondaryAction>
                        <Typography className={classes.expenseAmount}>
                          ${expense.amount.toFixed(2)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < expenses.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </div>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <div className={classes.tabContent}>
            <div className={classes.header}>
              <Typography variant="h6">
                Group Members ({members.length})
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddMemberDialogOpen}
              >
                Add Member
              </Button>
            </div>
            
            <List className={classes.memberList}>
              {members.map((member, index) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {member.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <>
                          {member.name} 
                          {member.isCreator && (
                            <Chip 
                              size="small" 
                              label="Creator" 
                              color="primary" 
                              style={{ marginLeft: 8 }}
                            />
                          )}
                        </>
                      } 
                      secondary={member.email} 
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="email">
                        <EmailIcon />
                      </IconButton>
                      {!member.isCreator && (
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < members.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </div>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <div className={classes.tabContent}>
            <Typography variant="h6" gutterBottom>
              Settlements
            </Typography>
            
            {settlements.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No settlements recorded yet.
              </Typography>
            ) : (
              <List>
                {settlements.map((settlement, index) => (
                  <React.Fragment key={settlement.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AccountBalance />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${settlement.from} → ${settlement.to}`} 
                        secondary={`${new Date(settlement.date).toLocaleDateString()} • Status: ${settlement.status}`} 
                      />
                      <ListItemSecondaryAction>
                        <Typography className={classes.expenseAmount}>
                          ${settlement.amount.toFixed(2)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < settlements.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AccountBalance />}
              className={classes.addButton}
              component={RouterLink}
              to={`/settlements/new?groupId=${group.id}`}
            >
              Settle Up
            </Button>
          </div>
        </TabPanel>
      </Paper>
      
      {/* Add Member Dialog */}
      <Dialog open={addMemberDialog} onClose={handleAddMemberDialogClose}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMemberDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMember} color="primary" variant="contained">
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GroupDetail;