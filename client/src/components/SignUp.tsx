import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircleOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import ServerApi from '../api/v1/index';

function SignUp(props: { handleChange: Function; showAlert: Function }) {
  const api = new ServerApi();

  // create hooks for inputs and errors associated
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
  });

  const [signupFormErrors, setSignupFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
  });

  const isFormMissingFields = () => {
    for (const key in signupForm) {
      if (signupForm[key as keyof typeof signupForm] === '') {
        return true;
      }
    }
    return false;
  };

  const getErrorMessages = () => {
    let msg = '';
    for (const key in signupFormErrors) {
      const err = signupFormErrors[key as keyof typeof signupFormErrors];
      msg += err === '' ? err : `${err}.\n`;
    }
    if (!validateConfirmPass()) {
      msg += `Passwords must be matching.\n`;
    }
    msg = msg.slice(0, -1);
    return msg;
  };

  const [confirmPass, setConfirmPass] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  // handle function
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
      const { status, data } = await api.signUp(signupForm);
      if (status !== 204) {
        if (!data) {
          throw new Error('Missing error response.');
        }
        const msg = data.message;
        console.error(msg);
        props.showAlert('error', msg);
      } else {
        props.showAlert('success', 'Email confirmation sent!');
      }
    } catch (error) {
      console.error(error);
      props.showAlert(
        'error',
        'An error occurred creating your account. Please try again later.'
      );
    }
  };

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setSignupFormErrors({ ...signupFormErrors, [e.target.name]: '' });
  };

  const handleError =
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (msg: string) => {
      return setSignupFormErrors({
        ...signupFormErrors,
        [e.target.name]: msg,
      });
    };

  const validateConfirmPass = (): boolean => {
    if (signupForm.password !== confirmPass) {
      const errMsg = 'Passwords must be matching';
      setConfirmPassError(errMsg);
      return false;
    } else {
      setConfirmPassError('');
      return true;
    }
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

  return (
    <Box
      data-testid='SignUpTab'
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
        <CircleOutlined />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Sign up
      </Typography>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
        data-testid='form'
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name='firstName'
              label='First Name'
              size='small'
              variant='standard'
              onChange={handleFormInput}
              fullWidth
              required
              data-testid='firstNameForm'
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  signupForm.firstName,
                  handleError(e),
                  'Please enter a valid first name'
                )
              }
              error={signupFormErrors.firstName !== ''}
              helperText={signupFormErrors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name='lastName'
              label='Last Name'
              size='small'
              variant='standard'
              onChange={handleFormInput}
              fullWidth
              required
              data-testid='lastNameForm'
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  signupForm.lastName,
                  handleError(e),
                  'Please enter a valid last name'
                )
              }
              error={signupFormErrors.lastName !== ''}
              helperText={signupFormErrors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='email'
              label='Email Address'
              placeholder='john@mail.utoronto.ca'
              onChange={handleFormInput}
              fullWidth
              required
              data-testid='emailForm'
              type='email'
              size='small'
              variant='standard'
              onBlur={(e) =>
                validateBlur(
                  /..*@(mail\.|alum\.){0,}utoronto.ca$/,
                  signupForm.email,
                  handleError(e),
                  'Invalid email, only utoronto emails allowed'
                )
              }
              error={signupFormErrors.email !== ''}
              helperText={signupFormErrors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='userName'
              label='Username'
              onChange={handleFormInput}
              fullWidth
              required
              data-testid='userNameForm'
              size='small'
              variant='standard'
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z0-9]+$/,
                  signupForm.userName,
                  handleError(e),
                  'Please enter a valid username'
                )
              }
              error={signupFormErrors.userName !== ''}
              helperText={signupFormErrors.userName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='password'
              label='Password'
              onChange={handleFormInput}
              fullWidth
              required
              type='password'
              size='small'
              variant='standard'
              data-testid='passwordForm'
              onBlur={(e) => {
                validateBlur(
                  /.{8,}/,
                  signupForm.password,
                  handleError(e),
                  'Ensure password is 8 characters or longer'
                );
              }}
              error={signupFormErrors.password !== ''}
              helperText={signupFormErrors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Confirm Password'
              size='small'
              variant='standard'
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setConfirmPassError('');
              }}
              fullWidth
              required
              data-testid='confirmPassForm'
              type='password'
              onBlur={(e) => validateConfirmPass()}
              error={confirmPassError !== ''}
              helperText={confirmPassError}
            />
          </Grid>
        </Grid>
        <Button
          type='submit'
          variant='contained'
          fullWidth
          data-testid='submitButton'
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link
              href='#'
              variant='body2'
              onClick={(e) => props.handleChange(e, 0)}
              data-testid='GoToSignIn'
            >
              Already have an account? Log In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignUp;
