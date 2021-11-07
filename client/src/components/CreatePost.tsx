import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import PreviewPopUp from "./PreviewPopUp";

const theme = createTheme();

function CreatePost() {
  // create hooks for input fields
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState("");
  const [tags, setTags] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const [openPopup, setOpenPopup] = useState(false);

  // handle functions
  const handleClickOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  // handle functions
  const handleImageUpload = (event: React.ChangeEvent<{}>) => {
    const target = event.target as HTMLInputElement;
    /** do something with the file **/
    let url = URL.createObjectURL((target.files as FileList)[0]);
    setFile(url);
    console.log(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h3" variant="h3" fontWeight="bold">
            Create Post
          </Typography>
          {/* form  begins*/}
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  placeholder="title"
                  size="small"
                  data-testid="titleTextField"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Body"
                  data-testid="bodyTextField"
                  placeholder="description"
                  multiline
                  rows={6}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  required
                  label="Upload Thumbnail"
                  type="file"
                  fullWidth
                  data-testid="fileField"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  onChange={(e) => handleImageUpload(e)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Event Capacity"
                  placeholder="40"
                  fullWidth
                  size="small"
                  onChange={(e) => setEventCapacity(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="Zoom: https://utoronto.zoom.us/j/7227206933#success"
                  size="small"
                  onChange={(e) => setEventLocation(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (Separate tags by a comma)"
                  placeholder="Clubs, Math, MCS"
                  size="small"
                  onChange={(e) => setTags(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* form  done */}
            <Box sx={{ mt: 2 }}>
              <Divider />
            </Box>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={5} md={3}>
                <Tooltip title="Enter all required fields!">
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      color="secondary"
                      onClick={() => handleClickOpen()}
                      data-testid="previewButton"
                      size="large"
                      disabled={!(title !== "" && body !== "")}
                    >
                      Preview
                    </Button>
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={7} md={5}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="large"
                >
                  Post
                </Button>
              </Grid>
            </Grid>
          </Box>

          <PreviewPopUp
            title={title}
            body={body}
            img={file}
            tags={tags}
            eventCapacity={eventCapacity}
            location={eventLocation}
            openPopup={openPopup}
            handleClose={handleClose}
          ></PreviewPopUp>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CreatePost;
