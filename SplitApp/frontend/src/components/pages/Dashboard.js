import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Divider,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
  makeStyles
} from '@material-ui/core';
import { AddCircle, Group, AccountBalance, MonetizationOn } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  summaryCard: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(2),
  },
  summaryIcon: {
    fontSize: 48,
    marginBottom: theme.spacing(1),
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
}));

function Dashboard() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [recentGroups, setRecentGroups] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [summary, setSummary] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalBalance: 0,
    pendingSettlements: 0,
  });

  // For demo purposes, let's simulate loading data
  useEffect(() => {
    // In a real app, you would fetch data from your API
    setTimeout(() => {
      setRecentGroups([
        { id: 1, name: 'Trip to Paris', members: 5, totalExpenses: 1250.75 },
        { id: 2, name: 'Roommates', members: 3, totalExpenses: 450.25 },
        { id: 3, name: 'Office Lunch', members: 8, totalExpenses: 124.50 },
      ]);
      
      setRecentExpenses([
        { id: 1, description: 'Dinner at Le Restaurant', amount: 245.50, group: 'Trip to Paris', date: '2023-03-15' },
        { id: 2, description: 'Electricity bill', amount: 120.30, group: 'Roommates', date: '2023-03-12' },
        { id: 3, description: 'Pizza party', amount: 89.75, group: 'Office Lunch', date: '2023-03-10' },
      ]);
      
      setPendingSettlements([
        { id: 1, fromUser: 'John', toUser: 'You', amount: 75.25, group: 'Trip to Paris' },
        { id: 2, description: 'You', toUser: 'Alice', amount: 32.40, group: 'Roommates' },
      ]);
      
      setSummary({
        totalGroups: 3,
        totalExpenses: 1825.50,
        totalBalance: 42.85,
        pendingSettlements: 2,
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h4" className={classes.title} gutterBottom>
        Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} className={classes.summarySection}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.summaryCard}>
            <CardContent>
              <Group className={classes.summaryIcon} />
              <Typography variant="h6" gutterBottom>Groups</Typography>
              <Typography variant="h4" className={classes.summaryValue}>
                {summary.totalGroups}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="inherit" component={RouterLink} to="/groups">
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.summaryCard}>
            <CardContent>
              <MonetizationOn className={classes.summaryIcon} />
              <Typography variant="h6" gutterBottom>Expenses</Typography>
              <Typography variant="h4" className={classes.summaryValue}>
                ${summary.totalExpenses.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="inherit" component={RouterLink} to="/expenses">
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.summaryCard}>
            <CardContent>
              <AccountBalance className={classes.summaryIcon} />
              <Typography variant="h6" gutterBottom>Your Balance</Typography>
              <Typography variant="h4" className={classes.summaryValue}>
                ${summary.totalBalance.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="inherit" component={RouterLink} to="/profile">
                Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.summaryCard}>
            <CardContent>
              <AccountBalance className={classes.summaryIcon} />
              <Typography variant="h6" gutterBottom>Pending Settlements</Typography>
              <Typography variant="h4" className={classes.summaryValue}>
                {summary.pendingSettlements}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button size="small" color="inherit" component={RouterLink} to="/settlements">
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Recent Groups */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Groups
            </Typography>
            <List>
              {recentGroups.length > 0 ? (
                recentGroups.map((group) => (
                  <React.Fragment key={group.id}>
                    <ListItem 
                      button 
                      className={classes.listItem} 
                      component={RouterLink} 
                      to={`/groups/${group.id}`}
                    >
                      <ListItemText 
                        primary={group.name} 
                        secondary={`${group.members} members • $${group.totalExpenses.toFixed(2)} total`} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No groups yet" />
                </ListItem>
              )}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              className={classes.addButton}
              component={RouterLink}
              to="/groups/create"
            >
              Create New Group
            </Button>
          </Paper>
        </Grid>

        {/* Recent Expenses */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            <List>
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <React.Fragment key={expense.id}>
                    <ListItem 
                      button 
                      className={classes.listItem}
                    >
                      <ListItemText 
                        primary={expense.description} 
                        secondary={`${expense.group} • ${expense.date}`} 
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="body2" color="textPrimary">
                          ${expense.amount.toFixed(2)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No expenses yet" />
                </ListItem>
              )}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              className={classes.addButton}
              component={RouterLink}
              to="/expenses/create"
            >
              Add New Expense
            </Button>
          </Paper>
        </Grid>

        {/* Pending Settlements */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Pending Settlements
            </Typography>
            <List>
              {pendingSettlements.length > 0 ? (
                pendingSettlements.map((settlement) => (
                  <React.Fragment key={settlement.id}>
                    <ListItem button className={classes.listItem}>
                      <ListItemText 
                        primary={`${settlement.fromUser} → ${settlement.toUser}`} 
                        secondary={`Group: ${settlement.group}`} 
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="body2" color="textPrimary">
                          ${settlement.amount.toFixed(2)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No pending settlements" />
                </ListItem>
              )}
            </List>
            <Button
              variant="contained"
              color="primary"
              className={classes.addButton}
              component={RouterLink}
              to="/settlements"
            >
              View All Settlements
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;