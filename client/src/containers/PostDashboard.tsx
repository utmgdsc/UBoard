import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import Header from '../components/Header';
import PostPreview from '../components/PostPreview';
import CreatePost from '../components/CreatePost';

import ServerApi from '../api/v1';
import { User } from 'models/user';

const UserContext = React.createContext({});


const fetchCurrentUser = () => {
  let currUser: User | {} = {};

  API.me().then((res: any) => {
      if (res.response.status === 200) {
        currUser = res.data;
      }
    })
    .catch((err) => console.error(err));

  return currUser;
};

const API = new ServerApi();

function RecentPosts() {
  const [recentPosts, updateRecent] = React.useState([]);

  const fetchRecentPosts = (limit: number, offset: number) => {
    API.fetchRecentPosts(limit, offset)
      .then((res: any) => {
        if (res.response.data.data.result) {
          updateRecent(res.response.data.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchRecentPosts(15, 0);
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <>
      {recentPosts.map((data) => (
        <PostPreview postUser={data} />
      ))}
    </>
  );
}

export default function PostDashboard() {
  console.dir(fetchCurrentUser());

  return (
    <>
      <Header />
      <main>
        <Container
          sx={{ py: 5 }}
          maxWidth='xl'
          data-testid='test-post-container'
        >
          <Grid container spacing={7}>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              {/*TODO: GURVIR <CreatePost /> */}
            </Grid>
              <UserContext.Provider value={{test: "test"}}>
                <RecentPosts />
              </UserContext.Provider>
              
            
          </Grid>
        </Container>
      </main>

      <footer>
        <Grid
          item
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pagination count={1} color='primary' variant='outlined' />
        </Grid>

        <Box
          sx={{ bgcolor: 'background.paper', p: 6, margin: 'auto' }}
          component='footer'
        >
          <Typography variant='h6' align='center' gutterBottom>
            UBoard
          </Typography>
          <Typography
            variant='subtitle1'
            align='center'
            color='text.secondary'
            component='p'
          >
            You're all up to date!
          </Typography>
        </Box>
      </footer>
    </>
  );
}
