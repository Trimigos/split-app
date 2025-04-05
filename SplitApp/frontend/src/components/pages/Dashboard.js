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
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  summaryPaper: {
    padding: theme.spacing(3),
    margin: theme.spacing(3, 0),
  },
  summaryBox: {
    textAlign: 'center',
    margin: theme.spacing(1),
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
      <div className={classes.heroContent}>
        <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
          Welcome to SplitApp
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Easily manage shared expenses with friends, family, or roommates. 
          Create groups, track expenses, and settle up without the hassle.
        </Typography>
      </div>
      
      <Paper className={classes.summaryPaper}>
        <Typography variant="h5" gutterBottom>Your Summary</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box className={classes.summaryBox}>
              <Typography variant="h4" color="primary">
                {summary.totalGroups}
              </Typography>
              <Typography variant="body2">Groups</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className={classes.summaryBox}>
              <Typography variant="h4" color="secondary">
                {summary.totalExpenses}
              </Typography>
              <Typography variant="body2">Active Expenses</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className={classes.summaryBox}>
              <Typography variant="h4" style={{color: '#ff9800'}}>
                {summary.pendingSettlements}
              </Typography>
              <Typography variant="body2">Pending Settlements</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className={classes.summaryBox}>
              <Typography variant="h4" style={{color: '#4caf50'}}>
                ${summary.totalBalance.toFixed(2)}
              </Typography>
              <Typography variant="body2">Total Balance</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={4} className={classes.cardGrid}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                Your Groups
              </Typography>
              <Typography>
                View and manage your expense groups. See who owes what and track shared expenses.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={RouterLink} to="/groups">
                View Groups
              </Button>
              <Button size="small" color="primary" component={RouterLink} to="/groups/create">
                Create New
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                Expenses
              </Typography>
              <Typography>
                Add new expenses and keep track of who paid what and who owes whom.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={RouterLink} to="/expenses">
                View Expenses
              </Button>
              <Button size="small" color="primary" component={RouterLink} to="/expenses/create">
                Add Expense
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                Settlements
              </Typography>
              <Typography>
                Settle debts and keep track of payment history between group members.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={RouterLink} to="/settlements">
                View Settlements
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;