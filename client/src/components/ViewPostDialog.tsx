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
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* Generate pre-formatted TagItems based on an array of provided tags */
export function GenerateTags(tags: Array<string>) {
  const formattedTags = 
  <Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
    {
      tags.map((tag: string)=> (
        <TagItem>{tag}</TagItem>
      ))
    }
  </Stack>;

  return formattedTags;
}

/* Structure for each tag item -- colored "bubble" */
const TagItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5, 2, 0.5, 2),
  textAlign: "center",
  color: theme.palette.text.primary,
  background: "#ef9a9a",
  borderRadius: "15px",
}));

/* Post settings, choosing between deleting, editing or reporting a post. The delete
  and edit options are only shown if the user is authorized. */
function MoreOptions() {
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
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="acc-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Report</MenuItem>
      </Menu>
    </div>
  );
}

/* Opens a full screen dialog containing a post. */
export default function ViewPostDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{mb: 3}}>
        Read More
      </Button>
      <Dialog
        fullScreen
        open={open}
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
        </Stack>

        {/* Capacity information and check-in (if applicable -- otherwise, this is hidden) */}
        <Stack direction="row" sx={{ px: 8, pb: 5 }}>
          <Stack spacing={1}>
            {/* TODO: Make dynamic.. Value of progressbar should be equal to capacity */}
            <Typography variant="body1" sx={{ pr: 4 }}>
              Capacity: 50/100
            </Typography>
            <LinearProgress variant="determinate" value={50}></LinearProgress>
            <Button variant="contained">Check In </Button>
            {/*TODO: Button should be disabled and replaced with "AT CAPACITY" when max */}
          </Stack>
        </Stack>

        {/* TODO: "Like" a post -- later problem */}

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
