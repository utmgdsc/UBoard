import React from 'react';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

import { useNavigate } from 'react-router-dom';

import ServerApi from '../api/v1/index';
import { UserContext } from '../App';

const api = new ServerApi();

/* Styling outer box of the search area */
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 100,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 'auto',
}));

/* Styling the icon of the search box */
const SearchIconWrapper = styled('div')(() => ({
  paddingLeft: 15,
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/* Style of the search input text, adjusts based on screen size. */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 64px',
    width: '50ch',

    /* Resize searchbar based on screen size */
    [theme.breakpoints.up('lg')]: {
      width: '90ch',
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      width: '25ch',
    },
    [theme.breakpoints.down('sm')]: {
      width: '9ch',
    },
  },
}));

function AccountMenu(props: { setSearch: Function, setEscapedQuery: Function }) {
  const [isOpen, openMenu] = React.useState(false);
  const authedUser = React.useContext(UserContext);
  const navigate = useNavigate();

  const closeMenu = () => {
    openMenu(false);
  };

  return (
    <div>
      <IconButton
        id='acc-menu-icon'
        data-testid='test-acc-menu-icon'
        color='inherit'
        aria-controls='basic-menu'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => {
          openMenu(true);
        }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id='acc-menu'
        data-testid='test-acc-menu'
        anchorEl={document.getElementById('acc-menu-icon')}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'menu-btn',
        }}
      >
        <MenuItem
          onClick={async () => {
            try {
              const result = await api.me();
              const user = result.data;
              if (!user) { 
                throw new Error("Current user could not be found.");
              }

              const query = `${user.firstName} ${user.lastName}`;
              props.setSearch(query);
              props.setEscapedQuery(query);
            } catch (err) {
              console.error(err);
            }

            closeMenu();
          }}
        >
          My Posts
        </MenuItem>
        <MenuItem
          onClick={() => {
            api.signOut();
            authedUser.setLoading(true); // force auth to be cleared
            navigate('/');
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default function Header(props: { setEscapedQuery: Function }) {
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      props.setEscapedQuery(search);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <AppBar position='static'>
      <Toolbar sx={{ alignItems: 'center' }}>
        <Link variant='h6' color='#FFFF' href='' underline='none'>
          UBoard
        </Link>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder='Search'
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                props.setEscapedQuery(search);
              }
            }}
          />
        </Search>
        <AccountMenu setSearch={setSearch} setEscapedQuery={props.setEscapedQuery} />
      </Toolbar>
    </AppBar>
  );
}
