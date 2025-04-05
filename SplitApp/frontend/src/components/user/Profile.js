import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  TextField, 
  Button,
  Avatar,
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import userService from '../../services/userService';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: 'auto',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  successSnackbar: {
    backgroundColor: green[600],
  },
}));

function Profile() {
  const classes = useStyles();
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      await userService.updateProfile(user);
      setSuccessMessage('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container className={classes.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar className={classes.avatar}>
            {user.firstName ? user.firstName.charAt(0) : ''}{user.lastName ? user.lastName.charAt(0) : ''}
          </Avatar>
          <Typography component="h1" variant="h5">
            User Profile
          </Typography>
        </Box>
        
        {error && <Typography color="error">{error}</Typography>}
        
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={user.firstName || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={user.lastName || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={user.username || ''}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={user.email || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <SnackbarContent
          className={classes.successSnackbar}
          message={successMessage}
          action={
            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
              Close
            </Button>
          }
        />
      </Snackbar>
    </Container>
  );
}

export default Profile;