import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useMediaQuery, 
  useTheme 
} from '@material-ui/core';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  Group, 
  MonetizationOn, 
  AccountBalance, 
  Person, 
  ExitToApp 
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'white',
  },
  drawer: {
    width: 250,
  },
  navLinks: {
    display: 'flex',
  },
  link: {
    marginLeft: theme.spacing(2),
    color: 'white',
    textDecoration: 'none',
  }
}));

const Header = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawer, setDrawer] = useState(false);
  
  // For actual implementation, you'd get this from authentication context
  const isAuthenticated = false;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open);
  };

  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Groups', icon: <Group />, path: '/groups' },
    { text: 'Expenses', icon: <MonetizationOn />, path: '/expenses' },
    { text: 'Settlements', icon: <AccountBalance />, path: '/settlements' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const drawerContent = (
    <div
      className={classes.drawer}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} component={RouterLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem button key="logout">
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title} component={RouterLink} to="/">
            SplitApp
          </Typography>
          
          {!isMobile && (
            <div className={classes.navLinks}>
              {navItems.map((item) => (
                <Button 
                  key={item.text} 
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                  className={classes.link}
                >
                  {item.text}
                </Button>
              ))}
            </div>
          )}
          
          {!isAuthenticated ? (
            <div>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </div>
          ) : (
            <Button color="inherit">Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default Header;