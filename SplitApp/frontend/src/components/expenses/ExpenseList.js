import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Receipt,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant,
  LocalTaxi,
  ShoppingCart,
  LocalGroceryStore,
  Hotel,
  LocalMovies,
  Category
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  filterContainer: {
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  amount: {
    fontWeight: 'bold',
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  searchInput: {
    marginBottom: theme.spacing(2),
  },
  noExpenses: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  categoryIcon: {
    marginRight: theme.spacing(1),
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  positive: {
    color: theme.palette.success.main,
  },
  negative: {
    color: theme.palette.error.main,
  },
  categoryChip: {
    margin: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
  },
}));

function ExpenseList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);

  // Helper function to get icon for category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'FOOD':
        return <Restaurant />;
      case 'TRANSPORT':
        return <LocalTaxi />;
      case 'SHOPPING':
        return <ShoppingCart />;
      case 'GROCERIES':
        return <LocalGroceryStore />;
      case 'ACCOMMODATION':
        return <Hotel />;
      case 'ENTERTAINMENT':
        return <LocalMovies />;
      default:
        return <Category />;
    }
  };

  useEffect(() => {
    // Simulate API call to fetch expenses
    const fetchExpenses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data
        const expenseData = [
          {
            id: 1,
            description: 'Dinner at Italian Restaurant',
            totalAmount: 120.50,
            paidBy: 'John Doe',
            date: '2025-04-01',
            category: 'FOOD',
            groupId: 1,
            groupName: 'Trip to Paris',
            userShare: -30.50,
            participants: ['John Doe', 'Alice Smith', 'Emma Wilson', 'Bob Johnson']
          },
          {
            id: 2,
            description: 'Taxi to Airport',
            totalAmount: 45.75,
            paidBy: 'Alice Smith',
            date: '2025-04-02',
            category: 'TRANSPORT',
            groupId: 1,
            groupName: 'Trip to Paris',
            userShare: 15.25,
            participants: ['John Doe', 'Alice Smith', 'Emma Wilson']
          },
          {
            id: 3,
            description: 'Grocery shopping',
            totalAmount: 78.30,
            paidBy: 'John Doe',
            date: '2025-04-03',
            category: 'GROCERIES',
            groupId: 2,
            groupName: 'Roommates',
            userShare: -39.15,
            participants: ['John Doe', 'Bob Johnson']
          },
          {
            id: 4,
            description: 'Movie tickets',
            totalAmount: 32.50,
            paidBy: 'Emma Wilson',
            date: '2025-04-02',
            category: 'ENTERTAINMENT',
            groupId: 1,
            groupName: 'Trip to Paris',
            userShare: 8.12,
            participants: ['John Doe', 'Alice Smith', 'Emma Wilson', 'Bob Johnson']
          },
          {
            id: 5,
            description: 'Hotel for weekend',
            totalAmount: 250.00,
            paidBy: 'Bob Johnson',
            date: '2025-03-28',
            category: 'ACCOMMODATION',
            groupId: 1,
            groupName: 'Trip to Paris',
            userShare: 62.50,
            participants: ['John Doe', 'Alice Smith', 'Emma Wilson', 'Bob Johnson']
          },
          {
            id: 6,
            description: 'Lunch at work',
            totalAmount: 35.75,
            paidBy: 'John Doe',
            date: '2025-04-01',
            category: 'FOOD',
            groupId: 3,
            groupName: 'Office Lunch',
            userShare: -17.87,
            participants: ['John Doe', 'Emma Wilson']
          },
        ];
        
        const groupsData = [
          { id: 1, name: 'Trip to Paris' },
          { id: 2, name: 'Roommates' },
          { id: 3, name: 'Office Lunch' },
        ];
        
        const categoriesData = [
          'FOOD', 'TRANSPORT', 'SHOPPING', 'GROCERIES', 'ACCOMMODATION', 'ENTERTAINMENT', 'OTHERS'
        ];
        
        setExpenses(expenseData);
        setFilteredExpenses(expenseData);
        setGroups(groupsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter state changes
    const filtered = expenses.filter(expense => {
      const matchesSearch = 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.groupName.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      const matchesGroup = groupFilter === 'all' || expense.groupId.toString() === groupFilter;
      
      return matchesSearch && matchesCategory && matchesGroup;
    });
    
    setFilteredExpenses(filtered);
  }, [searchTerm, categoryFilter, groupFilter, expenses]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };
  
  const handleGroupFilterChange = (event) => {
    setGroupFilter(event.target.value);
  };

  const handleDeleteExpense = (expenseId) => {
    // In a real app, this would call an API
    console.log(`Delete expense with ID: ${expenseId}`);
    // Then update the state
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  if (loading) {
    return (
      <Container className={classes.container}>
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <div className={classes.header}>
        <div>
          <Typography variant="h4" component="h1" className={classes.title}>
            Expenses
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage all your expenses across different groups
          </Typography>
        </div>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/expenses/create"
        >
          Add Expense
        </Button>
      </div>
      
      <Paper className={classes.paper}>
        <div className={classes.filterContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Expenses"
                value={searchTerm}
                onChange={handleSearchChange}
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      <Box display="flex" alignItems="center">
                        {getCategoryIcon(category)}
                        <Box ml={1}>{category.charAt(0) + category.slice(1).toLowerCase()}</Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="group-filter-label">Group</InputLabel>
                <Select
                  labelId="group-filter-label"
                  id="group-filter"
                  value={groupFilter}
                  onChange={handleGroupFilterChange}
                  label="Group"
                >
                  <MenuItem value="all">All Groups</MenuItem>
                  {groups.map(group => (
                    <MenuItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <Box className={classes.noExpenses}>
            <Receipt fontSize="large" color="disabled" />
            <Typography variant="h6" color="textSecondary">
              No expenses found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your filters or add a new expense
            </Typography>
          </Box>
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Paid By</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Your Share</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className={classes.tableRow}
                    hover
                  >
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box 
                        component={RouterLink} 
                        to={`/expenses/${expense.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {expense.description}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(expense.category)}
                        label={expense.category.charAt(0) + expense.category.slice(1).toLowerCase()}
                        className={classes.categoryChip}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box 
                        component={RouterLink} 
                        to={`/groups/${expense.groupId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {expense.groupName}
                      </Box>
                    </TableCell>
                    <TableCell>{expense.paidBy}</TableCell>
                    <TableCell align="right" className={classes.amount}>
                      ${expense.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell 
                      align="right" 
                      className={`${classes.amount} ${expense.userShare > 0 ? classes.positive : classes.negative}`}
                    >
                      {expense.userShare > 0 ? '+' : ''}${expense.userShare.toFixed(2)}
                    </TableCell>
                    <TableCell className={classes.actionButtons}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          component={RouterLink} 
                          to={`/expenses/${expense.id}/edit`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default ExpenseList;