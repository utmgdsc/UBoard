import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { User } from 'models/user';

import Header from '../components/Header';
import PostPreview from '../components/PostPreview';
import CreatePost from '../components/CreatePost';

import ServerApi, { APIResponse, PostUser } from '../api/v1';
import { useNavigate } from 'react-router-dom';

const api = new ServerApi();

export const UserContext: React.Context<{
  isLoading?: boolean;
  data?: User | null;
}> = React.createContext({});

function RecentPosts() {
  const [recentPosts, updateRecent] = React.useState([] as PostUser[]);

  const fetchRecentPosts = (limit: number, offset: number) => {
    api
      .fetchRecentPosts(limit, offset)
      .then(
        (
          res: APIResponse<{ data: { result?: PostUser[]; count: number } }>
        ) => {
          if (res.data && res.data.data.result) {
            updateRecent(res.data.data.result);
          }
        }
      )
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
  const [currentUser, setUser] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const authBarrier = () => {
    // force a login
    navigate('/');
    setUser(null);
  };

  React.useEffect(() => {
    if (isLoading) {
      // Only called once per login. Set to false on logout
      api
        .me()
        .then((res: any) => {
          // TODO: Fix type after Daniel merge
          if (res.status === 200) {
            setUser(res.data);
            setLoading(false);
          } else {
            console.log(`Not Logged in`);
            authBarrier();
          }
        })
        .catch((err) => {
          console.error(err);
          authBarrier();
        });
    }
  });

  return (
    <UserContext.Provider value={{ isLoading, data: currentUser }}>
      <Header setAuthLoading={setLoading} />
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

            <RecentPosts />
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
    </UserContext.Provider>
  );
}
