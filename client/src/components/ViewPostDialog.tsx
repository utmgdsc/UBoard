import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import MoreVert from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';

import { UserContext } from '../App';
import { LocationMap } from './LocationMap';

import ServerApi, { PostUser, PostUserPreview } from '../api/v1';

const api = new ServerApi();

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction='up' ref={ref} {...props} />;
  }
);

/* Post settings, choosing between deleting, editing or reporting a post. The delete
  and edit options are only shown if the user is authorized. */
function MoreOptions(props: {
  postID: string;
  isAuth: boolean;
  closeDialog: Function;
}) {
  const [isOpen, toggleMenu] = React.useState(false);
  const [isAlertOpen, showAlert] = React.useState(false);
  const [alertMsg, setMsg] = React.useState('An error has occurred');

  const closeMenu = () => {
    toggleMenu(false);
  };

  const deletePost = () => {
    api
      .deletePost(props.postID)
      .then((res) => {
        if (res.status === 204) {
          props.closeDialog();
        }
      })
      .catch((err) => {
        setMsg('Failed to delete post');
        showAlert(true);
        console.error(err);
      });

    closeMenu();
  };

  const reportPost = () => {
    // TODO need to fix spam / backend interactions

    api
      .reportPost(props.postID)
      .then((res) => {
        if (res.status === 204) {
          setMsg('Post has been reported.');
        } else {
          setMsg('Failed to report post.');
        }
      })
      .catch(() => {
        setMsg('Failed to report post.');
      })
      .finally(() => {
        showAlert(true);
      });
  };

  return (
    <>
      <IconButton
        id='post-settings'
        data-testid='test-post-settings'
        color='inherit'
        aria-controls='settings-menu'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => {
          toggleMenu(true);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id='post-settings-menu'
        data-testid='test-post-settings-menu'
        anchorEl={document.getElementById('post-settings')}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'post-settings',
        }}
      >
        {props.isAuth ? (
          <>
            <MenuItem onClick={closeMenu}>Edit</MenuItem>
            <MenuItem onClick={deletePost}>Delete</MenuItem>
          </>
        ) : (
          <></>
        )}
        <MenuItem onClick={reportPost}>Report</MenuItem>
      </Menu>
      <Snackbar
        open={isAlertOpen}
        autoHideDuration={6000}
        onClose={() => showAlert(false)}
        message={alertMsg}
      />
    </>
  );
}

/* Like button. Handles liking/unliking a post */
function LikeButton(props: { numLikes: number }) {
  // TODO: update/get data from db
  const [isLiked, toggleLiked] = React.useState(false);
  let numLikes = !isNaN(props.numLikes) ? props.numLikes : 0;

  const handleClick = () => {
    toggleLiked((prevLike) => !prevLike);
  };

  const likeButton = isLiked ? (
    <ThumbUpIcon onClick={handleClick} fontSize='large' />
  ) : (
    <ThumbUpOffAltIcon onClick={handleClick} fontSize='large' />
  );

  return (
    <Stack direction='row'>
      {likeButton}
      <Typography sx={{ pt: 0.5, px: 1, pl: 1 }}>{numLikes}</Typography>
    </Stack>
  );
}

function CapacityBar(props: { maxCapacity: number }) {
  // TODO: This data should be synced with db -- models needs to be updated
  const [capacity, setCapacity] = React.useState(0);
  const [isCheckedin, toggleCheckin] = React.useState(false);
  const maxCapacity = !isNaN(props.maxCapacity) ? props.maxCapacity : 0;

  const handleCheckIn = () => {
    toggleCheckin((prev) => !prev);
  };

  React.useEffect(() => {
    if (isCheckedin) {
      setCapacity((prev) => prev + 1);
    } else {
      setCapacity((prev) => (prev > 0 ? prev - 1 : prev));
    }
  }, [isCheckedin]);

  const buttonHandler =
    capacity < props.maxCapacity ? (
      isCheckedin ? (
        <Button onClick={handleCheckIn} variant='contained'>
          Undo
        </Button>
      ) : (
        <Button onClick={handleCheckIn} variant='outlined'>
          Check In
        </Button>
      )
    ) : (
      <Button disabled variant='outlined'>
        AT CAPACITY
      </Button>
    );

  return (
    <Stack spacing={1} sx={{ mr: 4 }}>
      <Typography variant='body1' sx={{ pr: 2 }}>
        Capacity: {capacity}/{maxCapacity}
      </Typography>
      <LinearProgress
        variant='determinate'
        value={(capacity * 100) / maxCapacity}
      ></LinearProgress>
      {buttonHandler}
    </Stack>
  );
}

function LocationHandler(props: {
  coords?: { lat: number; lng: number };
  location: string;
}) {
  const [isMapVisible, toggleMap] = React.useState(true);
  const mapEnabled =
    props.coords && props.coords.lat !== -1 && props.coords.lng !== -1; // disable google maps with invalid coords

  return (
    <>
      <Typography variant='body2' sx={{ pt: 2 }}>
        Location: {props.location}
        {mapEnabled && (
          <Switch
            checked={isMapVisible}
            onChange={() => toggleMap((prev) => !prev)}
            size='medium'
          />
        )}
      </Typography>
      {/* Show google maps on valid coordinates */}
      {mapEnabled && (
        <LocationMap
          visible={isMapVisible}
          location={props.location}
          lat={props.coords!.lat}
          lng={props.coords!.lng}
        />
      )}
    </>
  );
}

/* Opens a full screen dialog containing a post. */
export default function ViewPostDialog(props: {
  postUser: PostUserPreview;
  tags: JSX.Element;
  setOpenedPost: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, toggleDialog] = React.useState(false);
  const [postData, setData] = React.useState(props.postUser as any as PostUser);
  const [isAuthor, setIsAuthor] = React.useState(false);
  const userContext = React.useContext(UserContext);

  /* Need to fetch the rest of the post data (or update it incase the post has changed) */
  const fetchData = () => {
    api
      .fetchPost(props.postUser.id)
      .then((res) => {
        if (res.data && res.data.data && res.data.data.result) {
          setData(res.data.data.result);
          if (userContext.data) {
            setIsAuthor(userContext.data.id === props.postUser.User.id);
          }
        }
      })
      .catch((err) => console.error(`Error making post ${err}`));
  };

  React.useEffect(() => {
    /* Fetch incase data has changed / post was edited */
    if (isOpen) {
      const interval = setInterval(() => {
        fetchData();
      }, 500);
      return () => clearInterval(interval);
    }
  });

  const closeDialog = () => {
    props.setOpenedPost(false);
    toggleDialog(false);
  };

  if (!postData || !postData.User) {
    return <></>;
  }

  return (
    <>
      <Button
        data-testid='test-btn-preview'
        variant='outlined'
        onClick={() => {
          toggleDialog(true);
          props.setOpenedPost(true);
          fetchData();
        }}
        sx={{ mb: 3 }}
      >
        Read More
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={closeDialog}
        TransitionComponent={Transition}
        data-testid='test-post-dialog'
        aria-label='post-dialog'
        id={postData.id}
      >
        <AppBar sx={{ position: 'relative' }}>
          <IconButton
            data-testid='test-btn-close'
            edge='start'
            color='inherit'
            onClick={closeDialog}
            aria-label='close'
          >
            <ArrowBack />
          </IconButton>
        </AppBar>

        {/* Title and Options (3 dots) */}
        <Grid>
          <Stack direction='row' sx={{ pt: 5, pl: 4 }}>
            <Grid item xs={11}>
              <Typography variant='h5' style={{ wordWrap: 'break-word' }}>
                {postData.title}
              </Typography>
            </Grid>
            <MoreOptions
              postID={postData.id}
              isAuth={isAuthor}
              closeDialog={closeDialog}
            />
          </Stack>
        </Grid>
        {/* Top information (author, date, tags..) */}
        <Stack sx={{ pl: 4 }}>
          <Typography variant='body2' sx={{ mb: 1, mt: 0.5 }}>
            Posted on {new Date(props.postUser.createdAt).toString()} by{' '}
            {postData.User.firstName} {postData.User.lastName}
          </Typography>
          {props.tags}
          <LocationHandler coords={postData.coords} location={postData.location} />
        </Stack>

        {/* Post image and body */}
        <Stack sx={{ pl: 4 }}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              // TODO src={props.postUser.thumbnail}
              src='https://i.imgur.com/8EYKtwP.png'
              alt='Thumbnail'
              height='400px'
              width='400px'
            />
          </Box>
          <Typography
            variant='body1'
            sx={{ px: 4, py: 1, pb: 4 }}
            style={{ wordWrap: 'break-word' }}
          >
            {postData.body}
          </Typography>
          <Stack direction='row' sx={{ px: 4, pb: 5 }}>
            {Number(postData.capacity) > 0 ? (
              <CapacityBar maxCapacity={Number(postData.capacity)} />
            ) : (
              <></>
            )}
            <LikeButton numLikes={Number(postData.feedbackScore)} />
          </Stack>
        </Stack>

        {/* Comment Section */}
        <Stack sx={{ px: 8, pb: 5 }}>
          <Typography variant='h5' sx={{ py: 2 }}>
            Comments
          </Typography>
          <TextField
            variant='filled'
            placeholder='Write a comment'
            size='small'
          ></TextField>
          <Button variant='contained' sx={{ mt: 2 }}>
            Add Comment
          </Button>
        </Stack>
        {/* TODO: Create Comment component later */}
      </Dialog>
    </>
  );
}
