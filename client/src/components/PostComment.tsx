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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import ServerApi, { CommentsUser } from '../api/v1';

const api = new ServerApi();

function MoreOptions(props: {
  data: CommentsUser;
  toggleEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, toggleMenu] = React.useState(false);
  const [isAlertOpen, showAlert] = React.useState(false);
  const [alertMsg, setMsg] = React.useState('An error has occurred');

  const closeMenu = () => {
    showAlert(false);
    setMsg('An error has occurred');
    toggleMenu(false);
  };

  const deleteComment = () => {
    api
      .deleteComment(props.data.id)
      .then((res) => {
        if (res.status === 204) {
          setMsg('Comment has been deleted. ');
        } else {
          setMsg('Failed to delete comment.');
        }
      })
      .catch((err) => {
        setMsg('Failed to delete comment. ');
      })
      .finally(() => {
        showAlert(true);
        closeMenu();
      });
  };

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
        <MenuItem
          onClick={() => {
            props.toggleEditor((prev) => !prev);
            closeMenu();
          }}
        >
          Edit
        </MenuItem>
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
  userAuthoredComment: boolean;
}) {
  const [isEditing, toggleEditor] = React.useState(false);
  const [editingInput, setInput] = React.useState(props.data.body);

  const updateComment = async () => {
    await api.updateComment(props.data.id, { body: editingInput });
    toggleEditor(false);
  };

  return (
    <>
      <Paper elevation={3} sx={{ borderRadius: '10px', p: 2 }}>
        <Stack>
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
                {!isEditing ? (
                  <>
                    {' '}
                    <Typography
                      variant='body1'
                      style={{ wordWrap: 'break-word' }}
                    >
                      {props.data.body}
                    </Typography>
                  </>
                ) : undefined}
              </Stack>
            </Stack>
            <Stack>
              {props.userAuthoredComment ? (
                <MoreOptions
                  data={props.data}
                  toggleEditor={toggleEditor}
                />
              ) : undefined}
            </Stack>
          </Stack>
          {isEditing ? (
            <>
              <TextField
                defaultValue={props.data.body}
                inputProps={{ maxLength: 250 }}
                value={editingInput}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                variant='contained'
                onClick={updateComment}
                disabled={editingInput.length < 10 || editingInput.length > 250}
                sx={{ mt: 1 }}
              >
                Update
              </Button>
            </>
          ) : undefined}
        </Stack>
      </Paper>
    </>
  );
}
