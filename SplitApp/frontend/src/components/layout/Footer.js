import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Link,
  Container,
  Grid,
  Box,
  Divider,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0),
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
  },
  link: {
    margin: theme.spacing(0, 1),
    '&:hover': {
      textDecoration: 'none',
    },
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  linkSection: {
    margin: theme.spacing(2, 0),
  },
  linkHeader: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      marginBottom: theme.spacing(0.5),
    },
  },
  copyright: {
    marginTop: theme.spacing(3),
  },
}));

function Footer() {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container className={classes.container}>
        <Grid container spacing={4} justify="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={classes.linkHeader}>
              SplitApp
            </Typography>
            <Typography variant="body2" color="textSecondary">
              SplitApp makes it easy to split bills with friends and family. 
              Organize group expenses, track balances, and settle up effortlessly.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} className={classes.linkSection}>
            <Typography variant="subtitle1" className={classes.linkHeader}>
              Features
            </Typography>
            <ul className={classes.linkList}>
              <li>
                <Link component={RouterLink} to="/" color="inherit">
                  Split Expenses
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/" color="inherit">
                  Track Balances
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/" color="inherit">
                  Organize Groups
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/" color="inherit">
                  Settle Debts
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} className={classes.linkSection}>
            <Typography variant="subtitle1" className={classes.linkHeader}>
              Resources
            </Typography>
            <ul className={classes.linkList}>
              <li>
                <Link href="#" color="inherit">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} className={classes.linkSection}>
            <Typography variant="subtitle1" className={classes.linkHeader}>
              Legal
            </Typography>
            <ul className={classes.linkList}>
              <li>
                <Link href="#" color="inherit">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        
        <Divider className={classes.divider} />
        
        <Box textAlign="center" className={classes.copyright}>
          <Typography variant="body2" color="textSecondary">
            © {currentYear} SplitApp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;