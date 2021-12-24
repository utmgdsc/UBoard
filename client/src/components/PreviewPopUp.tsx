import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import GenerateTags from './Tags';

export default function PreviewPopUp(props: {
  title: string;
  body: string;
  img: File | undefined;
  tags: string[];
  eventCapacity: Number;
  location: string;
  coords: { lat: number; lng: number };
  openPopup: boolean;
  handleClose: () => void;
}) {
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
    <Dialog open={openPopup} scroll='paper' data-testid='PreviewPopUpComponent'>
      <DialogContent>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {img ? (
            <CardMedia
              component='img'
              image={URL.createObjectURL(img)}
              alt='Image Not Found'
              sx={{ minWidth: '250px', maxWidth: '700px', maxHeight: '200px' }}
            />
          ) : undefined}
          <CardContent sx={{ py: 1 }} data-testid='previewCard'>
            <Typography variant='h5' component='h5' fontWeight='bold'>
              {title}
            </Typography>
            <Box>
              <Typography sx={{ paddingTop: 2, overflow: 'auto' }}>
                {body}
              </Typography>
            </Box>
          </CardContent>
          <CardContent>
            <Grid container sx={{ py: 1 }}>
              <Grid item xs={12}>
                <Typography>Capacity: {eventCapacity}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Location: {location}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Tags: </Typography>
                <GenerateTags tags={tags} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button variant='contained' onClick={handleClose} color='secondary'>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
