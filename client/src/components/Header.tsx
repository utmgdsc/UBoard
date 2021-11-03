import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Menu from '@mui/material/Menu';
import React from 'react';
import Button from '@mui/material/Button/Button';
import AccountCircle from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton/IconButton';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  marginRight: "auto",
  width: '100%',
  [theme.breakpoints.up('sm')]: { // min width sm to active this
    marginLeft: "auto",
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(8)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: { // activate >= sm
      width: '100ch', // 50 chars width
    },
  },
}));

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

return (
  <div>
       <IconButton
        id="basic-button"
        color="inherit"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
         >
        <AccountCircle/>
      </IconButton>
    <Menu
        id="acc-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }} >
        <MenuItem onClick={handleClose}>My Posts</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
</div>

);
}

    
export default function Header() {
  return ( <AppBar position="static">
          <Toolbar sx={{ alignItems: "center" }}>
            <Link variant="h6" color="#FFFF" href="" underline="none"> UBoard</Link>
          <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase 
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <AccountMenu/>
          </Toolbar>

        </AppBar> );
}
        