import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import userService from '../../services/userService';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await userService.login(values.email, values.password);
      
      if (response.data && response.data.token) {
        // Store authentication data
        userService.setAuthData(response.data.token, response.data.user);
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        {error && <Typography color="error">{error}</Typography>}
        
        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    color="primary"
                    checked={values.remember}
                    onChange={handleChange}
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}

export default Login;