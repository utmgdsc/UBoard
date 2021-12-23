import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import ServerApi from '../api/v1/index';

function PassReset(props: { handleChange: Function; showAlert: Function }) {
  const api = new ServerApi();

  const [passResetForm, setPassResetForm] = useState({
    email: '',
  });

  const [passResetFormErrors, setPassResetFormErrors] = useState({
    email: '',
  });

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
    if (!regexPattern.test(checkString)) {
      setHook(errorMessage);
    } else {
      setHook('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no refresh; default

    const msg = getErrorMessages();
    if (msg !== '') {
      console.warn(msg);
      props.showAlert('warning', msg);
      return;
    }

    if (isFormMissingFields()) {
      const msg = 'Please fill in all the fields.';
      console.warn(msg);
      props.showAlert('warning', msg);
      return;
    }

    try {
      const { status, data } = await api.requestPasswordReset(passResetForm);
      if (status !== 204) {
        if (!data) {
          throw new Error('Missing error response.');
        }
        const msg = data.message;
        console.error(msg);
        props.showAlert('error', msg);
      } else {
        props.showAlert('success', 'Password reset email sent!');
      }
    } catch (error) {
      console.error(error);
      props.showAlert(
        'error',
        'An error occurred logging you in. Please try again later.'
      );
    }
  };

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassResetForm({ ...passResetForm, [e.target.name]: e.target.value });
    setPassResetFormErrors({
      ...passResetFormErrors,
      [e.target.name]: '',
    });
  };

  const handleError =
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (msg: string) => {
      return setPassResetFormErrors({
        ...passResetFormErrors,
        [e.target.name]: msg,
      });
    };

  return (
    <Box
      data-testid='ResetPassTab'
      sx={{
        mx: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      overflow='auto'
      maxHeight='70vh'
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Reset Password
      </Typography>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
        data-testid='form'
        sx={{ mt: 1 }}
      >
        <TextField
          name='email'
          label='Email Address'
          onChange={handleFormInput}
          fullWidth
          required
          data-testid='resetField'
          type='email'
          onBlur={(e) =>
            validateBlur(
              /..*@(mail\.|alum\.){0,}utoronto.ca$/,
              passResetForm.email,
              handleError(e),
              'Invalid email, only utoronto emails allowed'
            )
          }
          error={passResetFormErrors.email !== ''}
          helperText={passResetFormErrors.email}
        />
        <Button
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Reset my password
        </Button>
        <Grid container>
          <Grid item>
            <Link
              href='#'
              variant='body2'
              onClick={(e) => props.handleChange(e, 0)}
              data-testid='resetPassButton'
            >
              Back to Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PassReset;
