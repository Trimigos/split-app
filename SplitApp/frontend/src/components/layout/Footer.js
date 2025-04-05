import React from 'react';
import { Typography, Container, Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[200],
    textAlign: 'center',
  },
}));

function Footer() {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary">
          {'© '}
          {currentYear}
          {' '}
          <Link color="inherit" href="/">
            SplitApp
          </Link>
          {' | '}
          <Link color="inherit" href="/about">
            About
          </Link>
          {' | '}
          <Link color="inherit" href="/terms">
            Terms
          </Link>
          {' | '}
          <Link color="inherit" href="/privacy">
            Privacy
          </Link>
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;