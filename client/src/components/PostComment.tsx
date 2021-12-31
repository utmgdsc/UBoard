import React from 'react';

import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem/';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { CommentsUser } from '../api/v1';

function MoreOptions() {
  const [isOpen, toggleMenu] = React.useState(false);
  const [isAlertOpen, showAlert] = React.useState(false);
  const [alertMsg, setMsg] = React.useState('An error has occurred');

  const closeMenu = () => {
    toggleMenu(false);
  };

  const deleteComment = () => {
    closeMenu();
  };

  const editComment = () => {
    closeMenu();
  };

  // TODO: hide this if not author
  return (
    <>
      <IconButton
        id='comment-settings'
        color='inherit'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => {
          toggleMenu(true);
        }}
      >
        <MoreVert fontSize='small' />
      </IconButton>
      <Menu
        anchorEl={document.getElementById('comment-settings')}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'comment-settings',
          style: { minWidth: '110px' },
        }}
      >
        {/* <MenuItem onClick={ }>Edit</MenuItem> */}
        <MenuItem onClick={deleteComment}>Delete</MenuItem>
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


export default function PostComment(props: { data: CommentsUser, userHasCreatedComment: boolean }) {
  const [showMoreText, toggleMoreText] = React.useState(false);
  const body = props.data.body;

  return (
    <>
      <Paper elevation={3} style={{ borderRadius: '10px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12}sm={8} md={10} lg={11}>
            <Stack direction='row'>
            <AccountCircleIcon fontSize='large' sx={{mt: 1, ml: 1}} />
              <Stack>
                <Typography
                  style={{ fontWeight: 'bold' }}
                  sx={{ pt: 1, pl: 1, pr: 1 }}
                >
                  {props.data.User.firstName} {" "} {props.data.User.lastName} 
                </Typography>
                <Typography variant='caption' sx={{ pl: 1 }}>
                  {new Date(props.data.createdAt).toString()}
                </Typography>
              </Stack>
              </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={1}>
          {props.userHasCreatedComment ? <MoreOptions /> : undefined}
          </Grid>
        </Grid>
        <Typography
          variant='body1'
          sx={{ px: 2, py: 2 }}
          style={{ wordWrap: 'break-word' }}
        >
          {showMoreText ? body : body.slice(0, 125)}
          {/* For longer comments, show 'read more' */}
          {body.length >= 25 && !showMoreText ? (
            <Link
              onClick={() => {
                toggleMoreText((prev) => !prev);
              }}
              style={{ cursor: 'pointer' }}
              sx={{ pl: 1 }}
            >
              Read more
            </Link>
          ) : body.length >= 25 ? (
            <Link
              onClick={() => {
                toggleMoreText((prev) => !prev);
              }}
              style={{ cursor: 'pointer' }}
              sx={{ pl: 1 }}
            >
              Show less
            </Link>
          ) : undefined}
        </Typography>
      </Paper>
    </>
  );
}
