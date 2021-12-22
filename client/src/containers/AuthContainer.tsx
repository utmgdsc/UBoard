import React, { useEffect, useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert, { AlertColor } from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import PassReset from '../components/PassReset';

import './AuthContainer.css';

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...rest } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab with index: ${index}`}
      {...rest}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AuthContainer() {
  const theme = useTheme();

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

    const hideAlert = () => setAlert({ ...alert, display: false });

    return [alert, showAlert, hideAlert];
  };

  const [alert, showAlert, hideAlert] = useAlert();

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideAlert();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  });

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className='AuthContainer'>
      <Box
        display='flex'
        justifyContent='center'
        sx={{ position: 'absolute', width: '100vw' }}
      >
        <Collapse in={alert.display} sx={{ zIndex: 1 }}>
          <Alert
            severity={alert.severity as AlertColor}
            action={
              <IconButton
                aria-label='close'
                size='small'
                onClick={() => {
                  hideAlert();
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
          >
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {alert.message}
            </Typography>
          </Alert>
        </Collapse>
      </Box>
      <Grid
        container
        component='main'
        justifyContent='flex-end'
        alignItems='center'
        sx={{ height: '100vh', px: '40px' }}
      >
        <Grid item hidden={matches} xs={false} md={8}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Box className='glass' p='40px' px='80px'>
              <Typography color='white' variant='h2'>
                UBoard
              </Typography>
              <Typography color='white' variant='h4'>
                A place to connect
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          component={Paper}
          elevation={24}
          sx={{ borderRadius: '30px' }}
          overflow='hidden'
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                aria-label='SignIn and Signup tabs'
                variant='fullWidth'
              >
                <Tab label='Sign In' data-testid='SignInTabButton' />
                <Tab label='Sign Up' data-testid='SignUpTabButton' />
              </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
              <SignIn handleChange={handleChange} showAlert={showAlert} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <SignUp handleChange={handleChange} showAlert={showAlert} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <PassReset handleChange={handleChange} showAlert={showAlert} />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
export default AuthContainer;
