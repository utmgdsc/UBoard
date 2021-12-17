import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import ServerApi from '../api/v1';

export default function EmailConfirmContainer() {
  const api = new ServerApi();

  const navigate = useNavigate();

  const useAlert = (): [
    { severity: string; message: string; display: boolean },
    (type: string, message: string) => void,
    () => void
  ] => {
    const [alert, setAlert] = useState({
      severity: 'success',
      message: '',
      display: false,
    });

    const showAlert = (type: string, message: string) => {
      setAlert({ severity: type, message: message, display: true });
    };

    const hideAlert = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setAlert({ ...alert, display: false });
    };

    return [alert, showAlert, hideAlert];
  };

  const [alert, showAlert, hideAlert] = useAlert();

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideAlert();
    }, 6000);

    return () => {
      clearTimeout(timeout);
    };
  });

  const getToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const c = urlParams.get('c');

    return c;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      console.error('Missing token.');
      navigate('/');
      return;
    }

    try {
      const { status, data } = await api.confirmEmail({ token: token });
      if (status !== 204) {
        if (!data) {
          throw new Error('Missing error response.');
        }
        const msg = data.message;
        console.error(msg);
        showAlert('error', msg);
      } else {
        showAlert(
          'success',
          'Email has been confirmed! You may now close this tab.'
        );
        // navigate to a new page that displays this message instead of using alert
      }
    } catch (error) {
      console.error(error);
      showAlert(
        'error',
        'An error occurred while confirming your email. Please try again later.'
      );
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Snackbar open={alert.display} onClose={hideAlert}>
          <Alert onClose={hideAlert} severity={alert.severity as AlertColor}>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {alert.message}
            </Typography>
          </Alert>
        </Snackbar>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Confirm email address
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          data-testid='form'
        >
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Confirm email address
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
