import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PostDashboard from './containers/PostDashboard';
import { AuthContainer } from './containers';
import './App.css';

import { User } from 'models/user';

import ServerApi from './api/v1';

const api = new ServerApi();

export const UserContext: React.Context<User> = React.createContext({} as User);

const theme = createTheme({
  palette: {
    secondary: {
      main: '#f4003d',
    },
  },
});

function ProtectedRoute(props: { isAuth: boolean }) {
  const [currentUser, setUser] = React.useState({} as User);
  const [isLoading, setLoading] = React.useState(true);
  const [authed, setAuthed] = React.useState(props.isAuth);

    React.useEffect(() => {
    if (!authed) {
      setUser({} as User);
      setLoading(true);
    }

    if (authed && isLoading) {
      // Only called once per login. Set to false on logout
      api
        .me()
        .then((res) => {
          if (res.status === 200 && res.data) {
            setUser(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authed, isLoading]);

  if (authed && isLoading) { // wait
    return <h1>Loading..</h1>;
  }

  if (!isLoading && currentUser.id && authed) {
    return (<UserContext.Provider value={currentUser}>
      { <PostDashboard setAuthed={setAuthed}/> }</UserContext.Provider>);
  }

  return <Navigate to='/' replace />;
}

function App() {
  const [authed, setAuthed] = React.useState(false); // necessary to handle logout
  
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AuthContainer setAuthed={setAuthed}/>} />
            <Route path='/dashboard' element={<ProtectedRoute isAuth={authed}/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    
  );
}

export default App;
