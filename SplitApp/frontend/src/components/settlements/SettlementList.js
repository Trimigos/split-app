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
  makeStyles
} from '@material-ui/core';
import {
  Add as AddIcon,
  Search as SearchIcon,
  AccountBalance,
  ArrowUpward,
  ArrowDownward
} from '@material-ui/icons';
import settlementService from '../../services/settlementService';
import groupService from '../../services/groupService';
import userService from '../../services/userService';

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
  statusPending: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  statusCompleted: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  statusCancelled: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
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
  noSettlements: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  tableRow: {
    cursor: 'pointer',
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
  directionIcon: {
    marginRight: theme.spacing(1),
  },
}));

function SettlementList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState([]);
  const [filteredSettlements, setFilteredSettlements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [groups, setGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch settlements and groups from API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user info
        const userResponse = await userService.getCurrentUser();
        setCurrentUser(userResponse.data);
        
        // Fetch settlements
        const settlementsResponse = await settlementService.getSettlements();
        
        // Fetch groups for filtering
        const groupsResponse = await groupService.getGroups();
        
        setSettlements(settlementsResponse.data);
        setFilteredSettlements(settlementsResponse.data);
        setGroups(groupsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settlements data:', error);
        setError('Failed to load settlements. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter state changes
    const filtered = settlements.filter(settlement => {
      const matchesSearch = 
        settlement.fromUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        settlement.toUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        settlement.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
      
      const matchesGroup = groupFilter === 'all' || settlement.groupId.toString() === groupFilter;
      
      return matchesSearch && matchesStatus && matchesGroup;
    });
    
    setFilteredSettlements(filtered);
  }, [searchTerm, statusFilter, groupFilter, settlements]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };
  
  const handleGroupFilterChange = (event) => {
    setGroupFilter(event.target.value);
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          className: classes.statusCompleted
        };
      case 'PENDING':
        return {
          label: 'Pending',
          className: classes.statusPending
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: classes.statusCancelled
        };
      default:
        return {
          label: status,
        };
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
            Settlements
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage all your payments and settlements across groups
          </Typography>
        </div>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/settlements/new"
        >
          New Settlement
        </Button>
      </div>
      
      <Paper className={classes.paper}>
        <div className={classes.filterContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Settlements"
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
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
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
        
        {filteredSettlements.length === 0 ? (
          <Box className={classes.noSettlements}>
            <AccountBalance fontSize="large" color="disabled" />
            <Typography variant="h6" color="textSecondary">
              No settlements found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your filters or create a new settlement
            </Typography>
          </Box>
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSettlements.map((settlement) => {
                  const statusChipProps = getStatusChipProps(settlement.status);
                  
                  return (
                    <TableRow
                      key={settlement.id}
                      className={classes.tableRow}
                      component={RouterLink}
                      to={`/settlements/${settlement.id}`}
                      hover
                    >
                      <TableCell>
                        {new Date(settlement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {settlement.fromUser === currentUser.name ? (
                            <ArrowUpward className={classes.directionIcon} color="error" />
                          ) : (
                            <ArrowDownward className={classes.directionIcon} color="primary" />
                          )}
                          {settlement.fromUser === currentUser.name ? (
                            <span>To {settlement.toUser}</span>
                          ) : (
                            <span>From {settlement.fromUser}</span>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{settlement.description}</TableCell>
                      <TableCell>{settlement.groupName}</TableCell>
                      <TableCell align="right" className={classes.amount}>
                        ${settlement.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusChipProps.label}
                          className={statusChipProps.className}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default SettlementList;