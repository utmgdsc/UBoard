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
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import GenerateTags from "./Tags";
// import { Post } from "../../../server/models/post";
// import { User } from "../../../server/models/user"


const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* Post settings, choosing between deleting, editing or reporting a post. The delete
  and edit options are only shown if the user is authorized. */
function MoreOptions() {
  const [isOpen, toggleMenu] = React.useState(false);

  const closeMenu = () => {
    toggleMenu(false);
  };

  return (
    <>
      <IconButton
        id="post-settings"
        data-testid="test-post-settings"
        color="inherit"
        aria-controls="settings-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => { toggleMenu(true) }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="post-settings-menu"
        data-testid="test-post-settings-menu"
        anchorEl={document.getElementById("post-settings")}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "post-settings",
        }}
      >
        {/* TODO: Edit and Delete should only be visible to post author */}
        <MenuItem onClick={closeMenu}>Edit</MenuItem>
        <MenuItem onClick={closeMenu}>Delete</MenuItem>
        <MenuItem onClick={closeMenu}>Report</MenuItem>
      </Menu>
    </>
  );
}

/* Like button. Handles liking/unliking a post */
function LikeButton() {
  // TODO: update/get data from db
  const [isLiked, toggleLiked] = React.useState(false);

  const handleClick = () => {
    toggleLiked((prevLike) => !prevLike);
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
  // TODO: This data should be synced with db
  const [capacity, setCapacity] = React.useState(0);
  const [isCheckedin, toggleCheckin] = React.useState(false);
  const maxCapacity = 10;

  const handleCheckIn = () => {
    toggleCheckin((prev) => !prev);
  };

  React.useEffect(() => {
    if (isCheckedin) {
      setCapacity((prev) => prev + 1);
    } else {
      setCapacity((prev) => prev > 0 ? prev - 1 : prev);
    }
  }, [isCheckedin])


  const buttonHandler =
    capacity < maxCapacity ? (
      isCheckedin ? (
        <Button onClick={handleCheckIn} variant="contained">
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
export default function ViewPostDialog(props: { postUser: any, tags: JSX.Element }) {
  const [isOpen, toggleDialog] = React.useState(false);

  const closeDialog = () => {
    toggleDialog(false);
  };

  return (
    <div>
      {/* TODO:  change ID after integrating with API*/}

      <Button data-testid="test-btn-preview" variant="outlined" onClick={() => { toggleDialog(true) }} sx={{ mb: 3 }}>
        Read More
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={closeDialog}
        TransitionComponent={Transition}
        data-testid="test-post-dialog"
        aria-label="post-dialog"
      >
        <AppBar sx={{ position: "relative" }}>
          <IconButton
            data-testid="test-btn-close"
            edge="start"
            color="inherit"
            onClick={closeDialog}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
        </AppBar>

        {/* Title and Options (3 dots) */}
        <Stack direction="row" sx={{ pt: 5, pl: 4 }}>
          <Typography variant="h5">
            {props.postUser.title}
          </Typography>
          <MoreOptions />
        </Stack>

        {/* Top information (author, date, tags..) */}
        <Stack sx={{ pl: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {props.postUser.User.firstName} {props.postUser.User.lastName}
          </Typography>
          {props.tags}
          <Typography variant="body2" sx={{ pt: 2 }}>
            Location: {props.postUser.location}
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
              src={props.postUser.thumbnail}
              alt="Thumbnail"
              height="400px"
              width="400px"
            />
          </Box>
          <Typography variant="body1" sx={{ px: 4, py: 1, pb: 4 }}>
            {props.postUser.body}
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
