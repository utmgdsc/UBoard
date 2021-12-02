import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PostDashboard from './containers/PostDashboard';
import {
  AuthContainer,
  EmailConfirmContainer,
  PassResetContainer,
} from './containers';
import './App.css';

import { User } from 'models/user';

import ServerApi from './api/v1';

const api = new ServerApi();

export const UserContext: React.Context<{
  data: User;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = React.createContext({
  data: {} as User,
  setLoading: {} as React.Dispatch<React.SetStateAction<boolean>>,
});

const theme = createTheme({
  palette: {
    secondary: {
      main: '#f4003d',
    },
  },
});

function ProtectedRoute() {
  const [currentUser, setUser] = React.useState({} as User);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Only called once per login. Loading is triggered on signin/logout
    if (isLoading) {
      api
        .me()
        .then((res) => {
          if (res.status === 200 && res.data) {
            setUser(res.data);
          }
        })
        .catch((err) => {
          // not logged in
          setUser({} as User);
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoading]);

  if (isLoading) {
    // wait
    return <h1>Loading...</h1>;
  } else if (currentUser.id) {
    return (
      <UserContext.Provider
        value={{ data: currentUser, setLoading: setLoading }}
      >
        {<PostDashboard />}
      </UserContext.Provider>
    );
  }

  return <Navigate to='/' replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthContainer />} />
          <Route path='/dashboard' element={<ProtectedRoute />} />
          <Route path='/confirm-account' element={<EmailConfirmContainer />} />
          <Route path='/password-reset' element={<PassResetContainer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
