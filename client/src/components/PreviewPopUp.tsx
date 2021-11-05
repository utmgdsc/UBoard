import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function PreviewPopUp(props: any) {
  const {
    title,
    body,
    img,
    tags,
    eventCapacity,
    location,
    openPopup,
    handleClose,
  } = props;
  return (
    <Dialog open={openPopup} scroll="paper">
      <DialogContent>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <CardMedia
            component="img"
            image={img}
            alt="placeholder"
            sx={{ maxWidth: "700px", maxHeight: "200px" }}
          />
          <CardContent sx={{ py: 1 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {title}
            </Typography>
            <Typography sx={{ fontStyle: "italic" }} display="inline">
              x mins ago by UserName
            </Typography>
            <Box>
              <Typography sx={{ paddingTop: 2, overflow: "auto" }}>
                {body}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogContent>
        <Grid container sx={{ py: 3 }}>
          <Grid item xs={4}>
            <Button variant="outlined">Capacity: {eventCapacity}</Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined">Location: {location}</Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="secondary">
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
