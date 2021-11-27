import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PreviewPopUp from './PreviewPopUp';
import Snackbar from '@mui/material/Snackbar';

import ServerApi from '../api/v1/index';

const api = new ServerApi();

function CreatePost() {
  const [form, setForm] = useState({
    title: '',
    body: '',
    file: '',
    tags: '',
    capacity: -1,
    location: '',
  });
  const [openPopup, setOpenPopup] = useState(false); // for preview popup
  const [isAlertOpen, showAlert] = useState(false); // for snackbar
  const [alertMsg, setMsg] = useState('An error has occurred'); // for snackbar message
  const [capacityError, setCapacityError] = useState(''); // for capacity input validation
  const [isOpen, toggleDialog] = useState(false); // for create post dialog toggle

  const closeDialog = () => {
    setForm({
      title: '',
      body: '',
      file: '',
      tags: '',
      capacity: -1,
      location: '',
    });
    toggleDialog(false);
  };
  const handleClickOpen = () => {
    setOpenPopup(true);
  };

  const handleSubmit = () => {
    api
      .createPost(form)
      .then((res) => {
        if (res.status === 200) {
          setMsg('Post has been succesfully created.');
        } else {
          setMsg('Failed to create post');
        }
      })
      .catch((err) => {
        console.error(err);
        setMsg('Failed to create post. Ensure all the fields are correct');
      })
      .finally(() => {
        showAlert(true);
      });
  };

  const handleImageUpload = (event: React.ChangeEvent<{}>) => {
    const target = event.target as HTMLInputElement;
    let url = URL.createObjectURL((target.files as FileList)[0]);
    setForm({ ...form, file: url });
  };

  return (
    <>
      <Button
        variant='outlined'
        onClick={() => {
          toggleDialog(true);
        }}
        data-testid='newPostButton'
      >
        New Post
      </Button>
      <Dialog fullScreen open={isOpen} onClose={closeDialog}>
        <Container component='main' maxWidth='md'>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Grid container>
              <Grid item xs={4}>
                <Button
                  onClick={closeDialog}
                  size='large'
                  variant='contained'
                  data-testid='backButton'
                >
                  <ArrowBack />
                  Back
                </Button>
              </Grid>
            </Grid>

            <Typography
              component='h3'
              variant='h3'
              fontWeight='bold'
              paddingTop='10px'
            >
              Create Post
            </Typography>
            {/* form  begins*/}
            <Box component='form' noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label='Title'
                    placeholder='title'
                    size='small'
                    data-testid='titleTextField'
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label='Body'
                    inputProps={{ 'data-testid': 'bodyTextField' }}
                    placeholder='Description (minimum 25 characters)'
                    multiline
                    rows={6}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    label='Upload Thumbnail'
                    type='file'
                    fullWidth
                    data-testid='fileField'
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    onChange={(e) => handleImageUpload(e)}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label='Event Capacity'
                    placeholder='40'
                    fullWidth
                    size='small'
                    onChange={(e) =>
                      setForm({ ...form, capacity: Number(e.target.value) })
                    }
                    onBlur={() => {
                      if (!/^[0-9]*$/.test(form.capacity.toString())) {
                        setCapacityError('Only numbers allowed!');
                      } else {
                        setCapacityError('');
                      }
                    }}
                    error={capacityError !== ''}
                    helperText={capacityError}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label='Location'
                    placeholder='Deerfield Hall'
                    size='small'
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tags (Separate tags by a comma)'
                    placeholder='Clubs, Math, MCS'
                    size='small'
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </Grid>
              </Grid>

              {/* form  done */}
              <Box sx={{ mt: 2 }}>
                <Divider />
              </Box>

              <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={5} md={3}>
                  <Tooltip title='Enter all required fields!'>
                    <Box>
                      <Button
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        color='secondary'
                        onClick={handleClickOpen}
                        data-testid='previewButton'
                        size='large'
                        disabled={
                          !(
                            form.title !== '' &&
                            form.body !== '' &&
                            form.body.length >= 25
                          )
                        }
                      >
                        Preview
                      </Button>
                    </Box>
                  </Tooltip>
                </Grid>
                <Grid item xs={7} md={5}>
                  <Button
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                    size='large'
                    disabled={
                      !(
                        form.title !== '' &&
                        form.body !== '' &&
                        form.body.length >= 25
                      )
                    }
                    onClick={handleSubmit}
                  >
                    Create
                  </Button>
                  <Snackbar
                    open={isAlertOpen}
                    autoHideDuration={6000}
                    onClose={() => showAlert(false)}
                    message={alertMsg}
                  />
                </Grid>
              </Grid>
            </Box>

            <PreviewPopUp
              title={form.title}
              body={form.body}
              img={form.file}
              tags={form.tags}
              eventCapacity={form.capacity}
              location={form.location}
              openPopup={openPopup}
              handleClose={() => setOpenPopup(false)}
            ></PreviewPopUp>
          </Box>
        </Container>
      </Dialog>
    </>
  );
}

export default CreatePost;
