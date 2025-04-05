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
import expenseService from '../../services/expenseService';
import groupService from '../../services/groupService';

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
  const [error, setError] = useState('');

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
    // Fetch expenses and groups from API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch expenses
        const expensesResponse = await expenseService.getExpenses();
        
        // Fetch groups for filtering
        const groupsResponse = await groupService.getGroups();
        
        // Set categories (could come from API in a real app)
        const categoriesData = [
          'FOOD', 'TRANSPORT', 'SHOPPING', 'GROCERIES', 'ACCOMMODATION', 'ENTERTAINMENT', 'OTHERS'
        ];
        
        setExpenses(expensesResponse.data);
        setFilteredExpenses(expensesResponse.data);
        setGroups(groupsResponse.data);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load expenses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
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

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.deleteExpense(expenseId);
      // Update local state after successful delete
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      setFilteredExpenses(filteredExpenses.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      // Show error message to user (could use a toast/snackbar in a real app)
      alert('Failed to delete expense. Please try again.');
    }
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