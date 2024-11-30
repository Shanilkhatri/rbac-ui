import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { isAuthenticated, logout } from '../services/authService';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true); // To control the drawer open state
  const isMobile = useMediaQuery('(max-width: 600px)'); // Detect mobile screen size
 const navigate = useNavigate()
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout(); // Clear auth token or session
    navigate('/login'); // Redirect to login page
  };


  return (
    <div style={{ display: 'flex' }}>
      {isAuthenticated() && 
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'} // Use temporary drawer on mobile
        open={open}
        onClose={handleDrawerToggle} // Handle drawer close on mobile
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem  component={Link} to="/users" onClick={handleDrawerToggle}>
            {isMobile ? <ListItemIcon><PeopleIcon />Users</ListItemIcon> : <><PeopleIcon /><ListItemText primary="Users" /></>}
          </ListItem>
          <ListItem  component={Link} to="/roles" onClick={handleDrawerToggle}>
            {isMobile ? <ListItemIcon><SecurityIcon />Roles</ListItemIcon> : <><SecurityIcon /><ListItemText primary="Roles" /></>}
          </ListItem>
          <ListItem  component={Link} to="/permissions" onClick={handleDrawerToggle}>
            {isMobile ? <ListItemIcon><SettingsIcon />Manage Permissions</ListItemIcon> : <><SettingsIcon /><ListItemText primary="Manage Permissions" /></>}
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      }

      <div style={{ flexGrow: 1, marginLeft: open && !isMobile ? 0 : 0 }}>
        <AppBar position="static">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">RBAC Dashboard</Typography>
            {isAuthenticated() && (
            <Button sx={{ ml: 'auto' }} color="inherit" onClick={handleLogout}>
                Logout
            </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Content , we will render the children here*/}
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
