import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Hidden,
  makeStyles
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard,
  Group,
  Receipt,
  AccountBalance,
  Person,
  ExitToApp,
  Notifications,
  ArrowDropDown,
  Add
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    '&:hover': {
      textDecoration: 'none',
    },
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: theme.spacing(1),
    width: 32,
    height: 32,
  },
  navItems: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(0, 0.5),
    },
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  drawerPaper: {
    width: 240,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  navLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  activeLink: {
    color: theme.palette.primary.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  username: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  createButton: {
    margin: theme.spacing(0, 2),
  },
}));

function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  
  // In a real app, this would come from authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'J',
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createMenuAnchor, setCreateMenuAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateMenuOpen = (event) => {
    setCreateMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null);
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    setIsAuthenticated(false);
    handleMenuClose();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'My Groups', icon: <Group />, path: '/groups' },
    { text: 'Expenses', icon: <Receipt />, path: '/expenses' },
    { text: 'Settlements', icon: <AccountBalance />, path: '/settlements' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {drawerItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={RouterLink} 
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider />
          {isAuthenticated ? (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <ListItem button component={RouterLink} to="/login">
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </div>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>

          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            className={classes.title}
          >
            <img src="/logo.png" alt="SplitApp Logo" className={classes.logo} />
            SplitApp
          </Typography>

          <Hidden smDown>
            <div className={classes.navItems}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                className={isActive('/') ? classes.activeLink : ''}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/groups"
                className={isActive('/groups') ? classes.activeLink : ''}
              >
                Groups
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/expenses"
                className={isActive('/expenses') ? classes.activeLink : ''}
              >
                Expenses
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/settlements"
                className={isActive('/settlements') ? classes.activeLink : ''}
              >
                Settlements
              </Button>
            </div>
          </Hidden>

          {isAuthenticated ? (
            <div className={classes.userSection}>
              <Button
                color="inherit"
                startIcon={<Add />}
                className={classes.createButton}
                onClick={handleCreateMenuOpen}
              >
                Create
              </Button>

              <IconButton color="inherit" aria-label="show notifications">
                <Badge badgeContent={3} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>

              <Box ml={2} className={classes.username}>
                <Typography variant="body2">{user.name}</Typography>
              </Box>
              
              <IconButton 
                edge="end" 
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar className={classes.avatar}>
                  {user.avatar}
                </Avatar>
              </IconButton>
            </div>
          ) : (
            <div>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/register"
                variant="outlined"
              >
                Register
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      {/* User menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate('/profile');
          }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Create menu */}
      <Menu
        id="create-menu"
        anchorEl={createMenuAnchor}
        keepMounted
        open={Boolean(createMenuAnchor)}
        onClose={handleCreateMenuClose}
      >
        <MenuItem 
          onClick={() => {
            handleCreateMenuClose();
            navigate('/groups/create');
          }}
        >
          New Group
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleCreateMenuClose();
            navigate('/expenses/create');
          }}
        >
          New Expense
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleCreateMenuClose();
            navigate('/settlements/new');
          }}
        >
          New Settlement
        </MenuItem>
      </Menu>
      
      {/* This toolbar is just to create space below the app bar */}
      <Toolbar />
    </>
  );
}

export default Header;