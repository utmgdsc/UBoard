import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import MoreVert from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Stack from "@mui/material/Stack/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import GenerateTags from "./Tags";

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    }
  ) => {
    return <Slide direction="up" {...props} />;
  }
);

/* Post settings, choosing between deleting, editing or reporting a post. The delete
  and edit options are only shown if the user is authorized. */
function MoreOptions() {
  const [isOpen, openOptions] = React.useState(false);

  const handleClick = () => {
    openOptions(true);
  };
  const handleClose = () => {
    openOptions(false);
  };

  return (
    <>
      <IconButton
        id="post-settings"
        color="inherit"
        aria-controls="settings-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="acc-menu"
        anchorEl={document.getElementById("post-settings")}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "post-settings",
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Report</MenuItem>
      </Menu>
    </>
  );
}

/* Like button. Handles liking/unliking a post */
function LikeButton() {
  // TODO: update/get data from db
  const [isLiked, likePost] = React.useState(false);

  const handleClick = () => {
    likePost((prevLike) => !prevLike);
  };

  const likeButton = isLiked ? (
    <ThumbUpIcon onClick={handleClick} fontSize="large" />
  ) : (
    <ThumbUpOffAltIcon onClick={handleClick} fontSize="large" />
  );

  return (
    <Stack>
      {likeButton}
      <Typography sx={{ px: 2 }}>0</Typography>
    </Stack>
  );
}

function CapacityBar() {
  const [capacity, setCapacity] = React.useState(0);
  const [checkedIn, setCheckIn] = React.useState(false);
  const maxCapacity = 10; // TODO: Get from db

  const handleCheckIn = () => {
    setCapacity((prevCapacity) => prevCapacity + 1);
    setCheckIn(true);
  };

  const handleUndo = () => {
    setCapacity((prevCapacity) => prevCapacity - 1);
    setCheckIn(false);
  };
  const buttonHandler =
    capacity < maxCapacity ? (
      checkedIn ? (
        <Button onClick={handleUndo} variant="contained">
          Undo
        </Button>
      ) : (
        <Button onClick={handleCheckIn} variant="outlined">
          Check In
        </Button>
      )
    ) : (
      <Button disabled variant="outlined"> AT CAPACITY </Button>
    );

  return (
    <Stack spacing={1} sx={{ mr: 4 }}>
      <Typography variant="body1" sx={{ pr: 2 }}>
        Capacity: {capacity}/{maxCapacity}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(capacity * 100) / maxCapacity}
      ></LinearProgress>
      {buttonHandler}
    </Stack>
  );
}

/* Opens a full screen dialog containing a post. */
export default function ViewPostDialog() {
  const [isOpen, openDialog] = React.useState(false);

  const handleClickOpen = () => {
    openDialog(true);
  };

  const handleClose = () => {
    openDialog(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ mb: 3 }}>
        Read More
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
        </AppBar>

        {/* Title and Options (3 dots) */}
        <Stack direction="row" sx={{ pt: 5, pl: 4 }}>
          <Typography variant="h5">
            This is a placeholder event title
          </Typography>
          <MoreOptions />
        </Stack>

        {/* Top information (author, date, tags..) */}
        <Stack sx={{ pl: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Posted 01/01/1969 by John Smith (username123)
          </Typography>
          {GenerateTags(["Tag 1", "Tag 2"])}
          <Typography variant="body2" sx={{ pt: 2 }}>
            Location: China
          </Typography>
          {/* TODO: Implement Google Maps API */}
        </Stack>

        {/* Post image and body */}
        <Stack sx={{ pl: 4 }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://i.imgur.com/8EYKtwP.png"
              alt="Thumbnail"
              height="400px"
              width="400px"
            />
          </Box>
          <Typography variant="body1" sx={{ px: 4, py: 1, pb: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Typography>
          <Stack direction="row" sx={{ px: 4, pb: 5 }}>
            {/* Capacity information and check-in (if applicable -- otherwise, this is hidden) */}
            <CapacityBar />
            <LikeButton />
          </Stack>
        </Stack>

        {/* Comment Section */}
        <Stack sx={{ px: 8, pb: 5 }}>
          <Typography variant="h5" sx={{ py: 2 }}>
            Comments
          </Typography>
          <TextField
            variant="filled"
            placeholder="Write a comment"
            size="small"
          ></TextField>
          <Button variant="contained" sx={{ mt: 2 }}>
            Add Comment
          </Button>
        </Stack>
        {/* TODO: Create Comment component later */}
      </Dialog>
    </div>
  );
}
