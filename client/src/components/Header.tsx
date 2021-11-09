import React from "react";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";

/* Styling outer box of the search area */
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 100,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  marginRight: "auto",
  width: "auto",
}));

/* Styling the icon of the search box */
const SearchIconWrapper = styled("div")(() => ({
  paddingLeft: 15,
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

/* Style of the search input text, adjusts based on screen size. */
const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 64,
    width: "50ch",

    /* Resize searchbar based on screen size */
    [theme.breakpoints.up("lg")]: {
      width: "90ch",
    },
    [theme.breakpoints.between("sm", "lg")]: {
      width: "25ch",
    },
    [theme.breakpoints.down("sm")]: {
      width: "9ch",
    },
  },
}));

function AccountMenu() {
  const [isOpen, openMenu] = React.useState(false);

  const closeMenu = () => {
    openMenu(false);
  };

  return (
    <div>
      <IconButton
        id="acc-menu-icon"
        data-testid="test-acc-menu-icon"
        color="inherit"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => {openMenu(true)}}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="acc-menu"
        data-testid="test-acc-menu"
        anchorEl={document.getElementById("acc-menu-icon")}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "menu-btn",
        }}
      >
        <MenuItem onClick={closeMenu}>My Posts</MenuItem>
        <MenuItem onClick={closeMenu}>Settings</MenuItem>
        <MenuItem onClick={closeMenu}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ alignItems: "center" }}>
        <Link variant="h6" color="#FFFF" href="" underline="none">
          UBoard
        </Link>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
