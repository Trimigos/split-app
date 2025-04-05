import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Add as AddIcon, Group as GroupIcon } from '@material-ui/icons';
import groupService from '../../services/groupService';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  groupName: {
    marginBottom: theme.spacing(1),
  },
  memberCount: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    '& > svg': {
      marginRight: theme.spacing(0.5),
    },
  },
  noGroups: {
    textAlign: 'center',
    padding: theme.spacing(3),
  },
}));

function GroupList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await groupService.getGroups();
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Failed to load groups. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);

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

  return (
    <Container className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h4" component="h1">
          My Groups
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/groups/create"
        >
          Create Group
        </Button>
      </div>
      
      {error && (
        <Box mb={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {groups.length === 0 ? (
        <Card className={classes.noGroups}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              You don't have any groups yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create a new group to start tracking expenses with friends, roommates, or colleagues.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item key={group.id} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Avatar className={classes.avatar}>
                    {group.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" component="h2" className={classes.groupName}>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {group.description}
                  </Typography>
                  
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${group.memberCount} members`} 
                      size="small" 
                      variant="outlined" 
                    />
                    {group.isCreator && (
                      <Chip 
                        label="Creator" 
                        size="small" 
                        color="primary" 
                      />
                    )}
                  </Box>
                  
                  <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Total Expenses
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${group.totalExpenses.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions className={classes.cardActions}>
                  <Button 
                    size="small" 
                    color="primary" 
                    component={RouterLink}
                    to={`/groups/${group.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default GroupList;