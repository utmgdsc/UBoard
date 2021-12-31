import React from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ReplayIcon from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';

import GoogleMapReact from 'google-map-react';
import { PostUserPreview } from '../api/v1';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/system/useTheme';

import redmarker from '../assets/red-marker.png';
import bluemarker from '../assets/blue-marker.png';
import greenmarker from '../assets/green-marker.png';

export function LocationPickerMap(props: {
  setLocation: (location: string, lat?: number, lng?: number) => void;
  defaultCenter?: { lat: number; lng: number };
  defaultInput?: string;
}) {
  const [locationInput, setInput] = React.useState(
    props.defaultInput ? props.defaultInput : ''
  );
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
      position: props.defaultCenter ? props.defaultCenter : { lat: 0, lng: 0 }, // changed on autofill
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
      marker.setVisible(false); // only show this when user autofills a place

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location || !place.name) {
        return;
      }
      setInput(place.name!);
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
          defaultCenter={
            props.defaultCenter
              ? props.defaultCenter
              : { lat: 43.59, lng: -79.65 }
          } // GTA if default not provided
          defaultZoom={props.defaultCenter ? 15 : 8}
          options={getOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
        />
      </Paper>
    </Stack>
  );
}

export function EventsMapView(props: { posts: PostUserPreview[] }) {
  const [googleMap, setMap] = React.useState(
    {} as {
      map: google.maps.Map;
      maps: typeof google.maps;
      markers: google.maps.Marker[];
    }
  );

  // kinda hacky, but we need to explicitly define height/width for google maps in sx
  const theme = useTheme();
  const smQuery = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const bgQuery = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const xbgQuery = useMediaQuery(theme.breakpoints.up('lg'));
  const mapHeight = smQuery
    ? '65vh'
    : bgQuery
    ? '90vh'
    : xbgQuery
    ? '90vh'
    : '30vh';

    const mapWidth = smQuery
    ? '95vh'
    : bgQuery
    ? '100vh'
    : xbgQuery
    ? '159vh'
    : '40vh';

  // We want to do manual refresh so that the user is not interrupted when interacting the map if the data is changed/new posts are fetched
  const refreshMap = () => {
    if (googleMap.map) {
      setupMarkers(googleMap.map, googleMap.maps);
    }
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

  const clearMarkers = () => {
    if (!googleMap.map) {
      return;
    }

    for (let i = 0; i < googleMap.markers.length; i++) {
      googleMap.markers[i].setMap(null);
    }

    setMap({ ...googleMap, markers: [] as google.maps.Marker[] });
  };

  const setupMarkers = (map: google.maps.Map, maps: typeof google.maps) => {
    clearMarkers();
    let markers = [] as google.maps.Marker[];

    for (let i = 0; i < props.posts.length; i++) {
      const curr = props.posts[i];
      const { lat, lng } = curr.coords;
      if (lat !== -1 && lng !== -1) {
        // show markers for in-person events

        const hasAttendance =
          curr.capacity > 0
            ? `<p> Capacity: ${curr.usersCheckedIn}/${curr.capacity}</p>`
            : `<div></div>`;

        const tmpInfo = new google.maps.InfoWindow({
          content: `<div><h2 style='word-break: break-all'>${curr.title.slice(0, 100)}...</h2> 
          <p style='word-break: break-all'> ${curr.body.slice(0, 120) + '...'} </p>
          <p> Located @ ${curr.location} </p> 
          ${hasAttendance}
          <a href="/${curr.id}"> Read More </a>
          </div>`,
        });

        const percentFilled =
          (curr.capacity > 0 ? (curr.usersCheckedIn / curr.capacity) : 1) * 100;
          
        // red marker indicates event is full, blue is almost filled, green is almost empty event (less than 50%)
        const tmpMarker = new maps.Marker({
          position: { lat, lng },
          map,
          icon:
            percentFilled >= 100
              ? redmarker
              : percentFilled >= 50
              ? bluemarker
              : greenmarker,
        });

        tmpMarker.addListener('click', () => {
          tmpInfo.open({
            anchor: tmpMarker,
            map,
            shouldFocus: false,
          });
        });

        markers.push(tmpMarker);
      }
    }

    setMap({ map, maps, markers });
  };

  const loadMap = (map: google.maps.Map, maps: typeof google.maps) => {
    setupMarkers(map, maps);
  };

  return (
    <>
      <Button variant='contained' onClick={refreshMap} startIcon={<ReplayIcon/>} sx={{ mt: 1 }}>
      Refresh Map
      </Button>
      <Paper
        elevation={5}
        style={{
          height: mapHeight,
          width: mapWidth,
          justifyContent: 'center',
        }}
        sx={{ mt: 4, mb: 4 }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAPS_API as string,
            libraries: ['places'],
          }}
          defaultCenter={{ lat: 43.59, lng: -79.65 }}
          defaultZoom={9}
          options={getOptions}
          onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
          yesIWantToUseGoogleMapApiInternals
        />
      </Paper>
    </>
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

  const [googleMap, setMap] = React.useState(
    {} as {
      map: google.maps.Map;
      maps: typeof google.maps;
      marker: google.maps.Marker;
      info: google.maps.InfoWindow;
    }
  );

  React.useEffect(() => {
    if (googleMap.map) {
      // if map has loaded before, update markers on position change (occurs on post edit)
      googleMap.info.setContent(`<p>${props.location}</p>`);
      googleMap.marker.setPosition(googleMap.map.getCenter());

      googleMap.marker.addListener('click', () => {
        googleMap.info.open({
          anchor: googleMap.marker,
          map: googleMap.map,
          shouldFocus: false,
        });
      });
    }
  }, [googleMap, props.location]);

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

    setMap({ map, maps, marker, info });
  };

  return props.visible ? (
    <>
      <Paper
        elevation={5}
        style={{ height: '40vh', width: '75vh' }}
        sx={{ mt: 2 }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAPS_API as string,
            libraries: ['places'],
          }}
          defaultCenter={center}
          center={center}
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
