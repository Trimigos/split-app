import React from 'react';
import { Typography, Container, Box, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[200],
    textAlign: 'center'
  },
}));

function Footer() {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary">
          {'© '}
          {currentYear}
          {' SplitApp - Expense Sharing Made Simple'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Link color="inherit" href="#">
            Terms of Service
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Privacy Policy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;