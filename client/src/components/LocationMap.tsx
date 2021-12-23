import React from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import GoogleMapReact from 'google-map-react';

export function LocationPickerMap(props: {
  setLocation: (location: string, lat?: number, lng?: number) => void;
}) {
  const [locationInput, setInput] = React.useState('');
  const [showMap, toggleMap] = React.useState(true);

  const getOptions = (maps: GoogleMapReact.Maps) => {
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

  const loadMap = (map: google.maps.Map, maps: typeof google.maps) => {
    // initial API load

    const geocoder = new google.maps.Geocoder();

    const marker = new maps.Marker({
      position: { lat: 0, lng: 0 }, // changed on autofill
      map,
      draggable: true,
    });

    marker.addListener('dragend', () => {
      // update position when marker released
      const pos = marker.getPosition() as google.maps.LatLng;

      geocoder
        .geocode({ location: { lat: pos.lat(), lng: pos.lng() } })
        .then((res) => {
          const addr = res.results[0].formatted_address;
          setInput(addr); // change input box to where marker was dropped
          props.setLocation(addr, pos.lat(), pos.lng());
        });
    });

    marker.setVisible(false); // only show this when user autofills a place

    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('pac-input') as HTMLInputElement,
      {
        fields: ['formatted_address', 'geometry', 'name'],
        strictBounds: false,
        componentRestrictions: { country: 'ca' },
      }
    );

    // Prioritize the current map area in the autofill suggestions
    autocomplete.setBounds(
      new google.maps.LatLngBounds().extend(map.getCenter()!)
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location || !place.name) {
        return;
      }
      setInput(place.formatted_address!);
      const location = place.geometry.location;
      props.setLocation(place.name, location.lat(), location.lng());
      map.setCenter(location);
      map.setZoom(15);
      marker.setPosition(location);
      marker.setVisible(true);
    });
  };

  return (
    <Stack>
      <TextField
        fullWidth
        value={locationInput}
        onChange={(e) => setInput(e.target.value)}
        size='small'
        id='pac-input'
        data-testid='pac-input-test'
      />
      <FormGroup sx={{ pt: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showMap}
              data-testid='map-toggle'
              onChange={() => toggleMap((prev) => !prev)}
            />
          }
          label='View on Map'
        />
      </FormGroup>
      <Paper
        elevation={5}
        style={{ height: showMap ? '35vh' : '0', width: '100%' }} // don't unload the map, 0 height will hide it
        sx={{ mt: 1 }}
        data-testid='picker-map'
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAPS_API as string,
            libraries: ['places'],
          }}
          defaultCenter={{ lat: 43.59, lng: -79.65 }} // default to GTA
          defaultZoom={8}
          options={getOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
        />
      </Paper>
    </Stack>
  );
}

export function LocationMap(props: {
  visible: boolean;
  location: string;
  lat: number;
  lng: number;
}) {
  const center = {
    lat: props.lat,
    lng: props.lng,
  };

  // enable additional options (i.e streetview)
  const getOptions = (maps: GoogleMapReact.Maps) => {
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

  const loadMap = (map: google.maps.Map, maps: typeof google.maps) => {
    const pos = map.getCenter();

    const info = new google.maps.InfoWindow({
      content: `<p>${props.location}</p>`,
    });

    const marker = new maps.Marker({
      position: { lat: pos!.lat(), lng: pos!.lng() },
      map,
    });

    marker.addListener('click', () => {
      info.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  };

  return props.visible ? (
    <>
      <Paper
        elevation={5}
        style={{ height: '40vh', width: '75vh' }}
        sx={{ mt: 2 }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API as string }}
          defaultCenter={center}
          defaultZoom={15}
          options={getOptions}
          onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
          yesIWantToUseGoogleMapApiInternals
        />
      </Paper>
    </>
  ) : (
    <></>
  );
}
