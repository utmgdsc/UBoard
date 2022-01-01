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
import ServerApi, { CommentsUser } from '../api/v1';

const api = new ServerApi();

function MoreOptions(props: { data: CommentsUser }) {
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
        id={props.data.id}
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
        anchorEl={document.getElementById(props.data.id)}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': props.data.id,
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

export default function PostComment(props: {
  data: CommentsUser;
  userHasCreatedComment: boolean;
}) {
  const [showMoreText, toggleMoreText] = React.useState(false);
  const body = props.data.body;

  return (
    <>
      <Paper elevation={3} sx={{ borderRadius: '10px', p: 2 }}>
        <Stack direction='row' justifyContent='space-between'>
          <Stack direction='row' spacing={2}>
            <AccountCircleIcon fontSize='large' />
            <Stack sx={{ wordBreak: 'break-word' }}>
              <Typography style={{ fontWeight: 'bold' }}>
                {props.data.User.firstName} {props.data.User.lastName}
              </Typography>
              <Typography variant='caption'>
                {new Date(props.data.createdAt).toString()}
              </Typography>
              <Typography variant='body1' style={{ wordWrap: 'break-word' }}>
                {showMoreText ? body : body.slice(0, 125)}
              </Typography>
              {/* For longer comments, show 'read more' */}
              {body.length >= 25 && !showMoreText ? (
                <Link
                  onClick={() => {
                    toggleMoreText((prev) => !prev);
                  }}
                  underline='hover'
                  color='GrayText'
                  sx={{ cursor: 'pointer' }}
                >
                  Read more
                </Link>
              ) : body.length >= 25 ? (
                <Link
                  onClick={() => {
                    toggleMoreText((prev) => !prev);
                  }}
                  underline='hover'
                  color='GrayText'
                  sx={{ cursor: 'pointer' }}
                >
                  Show less
                </Link>
              ) : undefined}
            </Stack>
          </Stack>
          <Stack>
            {props.userHasCreatedComment ? (
              <MoreOptions data={props.data} />
            ) : undefined}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
