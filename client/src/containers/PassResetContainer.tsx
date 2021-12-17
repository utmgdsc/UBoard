import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import ServerApi from '../api/v1';

export default function PassResetContainer() {
  const api = new ServerApi();

  const navigate = useNavigate();

  const [passResetForm, setPassResetForm] = useState({ password: '' });
  const [passResetFormErrors, setPassResetFormErrors] = useState({
    password: '',
  });

  const [confirmPass, setConfirmPass] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

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
    const r = urlParams.get('r');

    return r;
  };

  const isFormMissingFields = () => {
    for (const key in passResetForm) {
      if (passResetForm[key as keyof typeof passResetForm] === '') {
        return true;
      }
    }
    return false;
  };

  const getErrorMessages = () => {
    let msg = '';
    for (const key in passResetFormErrors) {
      const err = passResetFormErrors[key as keyof typeof passResetFormErrors];
      msg += err === '' ? err : `${err}.\n`;
    }
    msg = msg.slice(0, -1);
    return msg;
  };

  /**
   * Validates all input forms except for `confirmPass` input
   * @param regexPattern  pattern to match
   * @param checkString   string to verify
   * @param setHook       set function for the input's hook
   * @param errorMessage  error message to display for that input field
   */
  const validateBlur = (
    regexPattern: RegExp,
    checkString: string,
    setHook: Function,
    errorMessage: string
  ) => {
    // only check for the confirm password field

    if (!regexPattern.test(checkString)) {
      setHook(errorMessage);
    } else {
      setHook('');
    }
  };

  const validateConfirmPass = (): boolean => {
    if (passResetForm.password !== confirmPass) {
      const errMsg = 'Passwords must be matching';
      setConfirmPassError(errMsg);
      return false;
    } else {
      setConfirmPassError('');
      return true;
    }
  };

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassResetForm({ ...passResetForm, [e.target.name]: e.target.value });
  };

  const handleError =
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (msg: string) => {
      return setPassResetFormErrors({
        ...passResetFormErrors,
        [e.target.name]: msg,
      });
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      console.error('Missing token.');
      navigate('/');
      return;
    }

    const msg = getErrorMessages();
    if (msg !== '') {
      console.warn(msg);
      showAlert('warning', msg);
      return;
    }

    if (isFormMissingFields()) {
      const msg = 'Please fill in all the fields.';
      console.warn(msg);
      showAlert('warning', msg);
      return;
    }

    try {
      const { status, data } = await api.resetPass({
        token: token,
        ...passResetForm,
        confirmPassword: confirmPass,
      });
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
          'Password has been reset! You may now close this tab.'
        );
        // navigate to a new page that displays this message instead of using alert
      }
    } catch (error) {
      console.error(error);
      showAlert(
        'error',
        'An error occurred while resetting your password. Please try again later.'
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
          Create new password
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          data-testid='form'
        >
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='New Password'
            type='password'
            data-testid='password'
            onChange={handleFormInput}
            onBlur={(e) =>
              validateBlur(
                /.{8,}/,
                passResetForm.password,
                handleError(e),
                'Ensure password is 8 characters or longer'
              )
            }
            error={passResetFormErrors.password !== ''}
            helperText={passResetFormErrors.password}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='confirmPassword'
            label='Confirm New Password'
            type='password'
            data-testid='confirmPassword'
            onChange={(e) => setConfirmPass(e.target.value)}
            onBlur={(e) => validateConfirmPass()}
            error={confirmPassError !== ''}
            helperText={confirmPassError}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Create new password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
