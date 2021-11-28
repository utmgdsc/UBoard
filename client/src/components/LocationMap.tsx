import React from 'react';
import LocationOn from '@mui/icons-material/LocationOn';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import GoogleMapReact, { Maps } from 'google-map-react';

function ClickMarker(props: { lat: number; lng: number }) {
  return (
    <>
      <IconButton
        onClick={() => {
          window.open(`https://www.google.com/maps/search/?api=1&query=${props.lat}%2C${props.lng}`, `_blank`);
        }}
      >
        <LocationOn fontSize='large' />
      </IconButton>

    </>
  );
}

export function LocationMap(props: {
  visible: boolean;
  lat: number;
  lng: number;
}) {
  const center = {
    lat: props.lat,
    lng: props.lng,
  };

  const getOptions = (maps: Maps) => {
    return {
      mapTypeControl: true,
      streetViewControl: true,
      fullScreenControl: true,
      fullSCreenControlOptions: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
    };
  };

  return props.visible ? (
    <>
      <Paper
        elevation={5}
        style={{ height: '50vh', width: '75vh' }}
        sx={{ mt: 2 }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.MAPS_API as string }}
          defaultCenter={center}
          defaultZoom={15}
          options={getOptions}
          yesIWantToUseGoogleMapApiInternals
        >
          <ClickMarker
            lat={center.lat}
            lng={center.lng}
          />
        </GoogleMapReact>
      </Paper>
    </>
  ) : (
    <></>
  );
}
