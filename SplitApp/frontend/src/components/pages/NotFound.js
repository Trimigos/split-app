import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, makeStyles, Box } from '@material-ui/core';
import { SentimentVeryDissatisfied } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    fontSize: 100,
    margin: theme.spacing(2),
    color: theme.palette.grey[500],
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(4),
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <SentimentVeryDissatisfied className={classes.icon} />
      <Typography variant="h3" className={classes.title}>
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Box mt={2}>
        <Typography variant="body1" color="textSecondary">
          Check the URL or try navigating to another section of the app.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/"
        className={classes.button}
      >
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default NotFound;