import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  TextField, 
  Button,
  Avatar,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

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
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock user data for development
    // In a real app, this would fetch from your backend API
    setUser({
      username: 'user123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
    setLoading(false);
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
      // This would be a real API call in production
      // await axios.put('/api/user/profile', user);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading profile...</Typography>;
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
                value={user.firstName}
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
                value={user.lastName}
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
                value={user.username}
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
                value={user.email}
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
          >
            Update Profile
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Profile;