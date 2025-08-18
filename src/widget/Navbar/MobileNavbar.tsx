import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box } from '@mui/material';

import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import NavbarLinkMapping from './utils/NavbarLinkMapping';
import { useNavigate } from 'react-router';

function MobileNavbar() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (routeKey: keyof typeof NavbarLinkMapping) => {
    setAnchorEl(null);
    navigate(NavbarLinkMapping[routeKey]);
  };

  const authLinks = () => {
    return (
      <>
        <MenuItem onClick={() => handleMenuClose('Profile')}>Profile</MenuItem>
        <MenuItem onClick={() => handleMenuClose('NewItem')}>New Item</MenuItem>
        <MenuItem onClick={() => handleMenuClose('Settings')}>Settings</MenuItem>
        <MenuItem onClick={() => handleMenuClose('About')}>About</MenuItem>
      </>
    );
  };

  const nonAuthLinks = () => {
    return (
      <>
        <MenuItem onClick={() => handleMenuClose('Login')}>Login</MenuItem>
        <MenuItem onClick={() => handleMenuClose('Register')}>Register</MenuItem>
        <MenuItem onClick={() => handleMenuClose('Settings')}>Settings</MenuItem>
        <MenuItem onClick={() => handleMenuClose('About')}>About</MenuItem>
      </>
    );
  };

  return (
    <AppBar
      position='fixed'
      sx={{ bottom: 0, top: 'auto' }}
    >
      <Toolbar sx={{ justifyContent: 'space-around' }}>
        <IconButton
          color='inherit'
          edge='start'
          onClick={() => {
            navigate('/');
          }}
        >
          <CategoryIcon />
        </IconButton>
        <IconButton
          color='inherit'
          edge='start'
          onClick={() => {
            navigate('/about');
          }}
        >
          <InfoRoundedIcon />
        </IconButton>
        <Box>
          <IconButton
            color='inherit'
            onClick={handleMenuOpen}
          >
            {user?.id ? <AccountCircle /> : <FingerprintIcon />}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {user?.id ? authLinks() : nonAuthLinks()}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default MobileNavbar;
