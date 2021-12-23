import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import Header from '../components/Header';
import PostPreview from '../components/PostPreview';
import CreatePost from '../components/CreatePost';

import ServerApi, { PostUserPreview } from '../api/v1';

export const POSTS_PER_PAGE = 30; // Maximum (previewable) posts per page.

const api = new ServerApi();

function RecentPosts(props: {
  query: string;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  pageNum: number;
  userId: string;
}) {
  const [recentPosts, updateRecent] = React.useState([] as PostUserPreview[]);
  const [openedPost, setOpenedPost] = React.useState(false);

  const checkForPosts = React.useCallback(() => {
    if (!openedPost) {
      let result;
      if (props.userId !== '') {
        result = api.fetchUserPosts(
          props.userId,
          POSTS_PER_PAGE,
          POSTS_PER_PAGE * (props.pageNum - 1)
        );
      } else if (!props.query) {
        result = api.fetchRecentPosts(
          POSTS_PER_PAGE,
          POSTS_PER_PAGE * (props.pageNum - 1)
        );
      } else {
        result = api.searchForPosts(
          props.query,
          POSTS_PER_PAGE,
          POSTS_PER_PAGE * (props.pageNum - 1)
        );
      }
      result
        .then((res) => {
          if (res.data && res.data.data.result) {
            updateRecent(res.data.data.result);
            props.setPageCount(Math.ceil(res.data.data.total / POSTS_PER_PAGE));
          } else {
            updateRecent([]);
            props.setPageCount(1);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [props, openedPost]);

  /* Fetch new posts by polling */
  React.useEffect(() => {
    const interval = setInterval(() => {
      checkForPosts();
    }, 5000);

    return () => clearInterval(interval);
  });

  /* Fetch posts triggered by page-change or post dialog close */
  React.useEffect(() => {
    checkForPosts();
  }, [checkForPosts]);

  return (
    <>
      {recentPosts.map((data) => (
        <PostPreview
          key={data.id}
          postUser={data}
          setOpenedPost={setOpenedPost}
        />
      ))}
    </>
  );
}

export default function PostDashboard() {
  const [pageCount, setPageCount] = React.useState(1);
  const [page, setPage] = React.useState(1);

  const [userId, setUserId] = React.useState('');

  const useQuery = (): [string, (q: string) => void] => {
    const [query, setQuery] = React.useState('');

    const setEscapedQuery = (q: string) => {
      let escaped = q.replace(/\W+/g, '&');
      escaped = escaped.replace(/^&+|&+$/g, '');
      setQuery(escaped);
    };

    return [query, setEscapedQuery];
  };

  const [query, setEscapedQuery] = useQuery();

  return (
    <>
      <Header setUserId={setUserId} setEscapedQuery={setEscapedQuery} />
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
              <CreatePost />
            </Grid>

            <RecentPosts
              userId={userId}
              query={query}
              setPageCount={setPageCount}
              pageNum={page}
            />
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
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event: React.ChangeEvent<unknown>, pg: number) => {
              setPage(pg);
            }}
            data-testid='test-paginate'
            color='primary'
            variant='outlined'
          />
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
