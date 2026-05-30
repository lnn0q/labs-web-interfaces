import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ background: 'rgba(18, 18, 18, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}>
      <Toolbar>
        <LocalFireDepartmentIcon sx={{ fontSize: 32, color: '#FF6B00', mr: 1.5 }} />
        <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700, letterSpacing: 1 }}>
          Takibi
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer 
              anchor="right" 
              open={mobileOpen} 
              onClose={() => setMobileOpen(false)} 
              PaperProps={{ sx: { bgcolor: '#1E1E1E', color: 'white', width: 250 } }}
            >
              <List sx={{ mt: 2 }}>
                <ListItem button component={Link} to="/" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Каталог фандомів" />
                </ListItem>
                <ListItem button component={Link} to="/about" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Про нас" />
                </ListItem>
                {isAuthenticated ? (
                  <>
                    {user?.is_staff && (
                      <ListItem button component={Link} to="/admin" onClick={() => setMobileOpen(false)}>
                        <ListItemText primary="Адмін-панель" sx={{ color: '#FF6B00' }} />
                      </ListItem>
                    )}
                    <ListItem button component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="Мій профіль" />
                    </ListItem>
                    <ListItem button onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      <ListItemText primary="Вийти" sx={{ color: '#FF4444' }} />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem button component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="Увійти" />
                    </ListItem>
                    <ListItem button component={Link} to="/register" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="Реєстрація" />
                    </ListItem>
                  </>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/">Каталог</Button>
            <Button color="inherit" component={Link} to="/about">Про нас</Button>
            
            {isAuthenticated ? (
              <>
                {user?.is_staff && (
                  <Button color="secondary" component={Link} to="/admin">Адмін</Button>
                )}
                <IconButton onClick={handleMenu} color="inherit">
                  {user?.avatar ? (
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{ sx: { bgcolor: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' } }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleClose}>Профіль</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#FF4444' }}>Вийти</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="outlined" color="primary">Увійти</Button>
                <Button component={Link} to="/register" variant="contained" color="primary">Реєстрація</Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
