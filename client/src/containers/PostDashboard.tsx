import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Header from '../components/Header';
import PostPreview from '../components/PostPreview';
import CreatePost from '../components/CreatePost';
import { EventsMapView } from '../components/LocationMap';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ServerApi, { PostUserPreview } from '../api/v1';

import { postTypes } from '../components/constants/postTypes';

export const POSTS_PER_PAGE = 6; // Maximum (previewable) posts per page.

const api = new ServerApi();

function RecentPosts(props: {
  type: string;
  openedCreate: boolean;
  query: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  changedType: boolean;
  setChangedType: React.Dispatch<React.SetStateAction<boolean>>;
  prevState: string;
  setPrevState: React.Dispatch<React.SetStateAction<string>>;
  pageNum: number;
  mapView: boolean;
  userId: string;
}) {
  const [recentPosts, updateRecent] = React.useState([] as PostUserPreview[]);

  const checkForPosts = React.useCallback(() => {
    if (!props.openedCreate) {
      let result;
      let newState = '';
      if (props.userId !== '') {
        if (props.prevState !== 'user') {
          newState = 'user';
        }
        result = api.fetchUserPosts(
          props.userId,
          props.type,
          POSTS_PER_PAGE,
          POSTS_PER_PAGE * (props.pageNum - 1)
        );
      } else if (!props.query) {
        if (props.prevState !== 'search') {
          newState = 'search';
        }
        result = api.fetchRecentPosts(
          props.type,
          POSTS_PER_PAGE,
          POSTS_PER_PAGE * (props.pageNum - 1)
        );
      } else {
        if (props.prevState !== 'recent') {
          newState = 'recent';
        }
        result = api.searchForPosts(
          props.type,
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
      if (newState !== '' || props.changedType) {
        props.setPage(1);
        props.setChangedType(false);
        props.setPrevState(newState);
      }
    }
  }, [props]);

  /* Fetch new posts by polling */
  React.useEffect(() => {
    const interval = setInterval(() => {
      checkForPosts();
    }, 3000);

    return () => clearInterval(interval);
  });

  /* Fetch posts triggered by page-change or post dialog close */
  React.useEffect(() => {
    checkForPosts();
  }, [checkForPosts]);

  return (
    <>
      {props.type === 'Events' && props.mapView ? (
        <Box sx={{ mt: 2, ml: 7, width: '100%' }}>
          <EventsMapView posts={recentPosts} />
        </Box>
      ) : (
        recentPosts.map((data) => <PostPreview key={data.id} postUser={data} />)
      )}
    </>
  );
}

export default function PostDashboard() {
  const [postType, setPostType] = React.useState('All');

  const [pageCount, setPageCount] = React.useState(1);
  const [page, setPage] = React.useState(1);
  const [isMapView, toggleMapView] = React.useState(false);

  const [userId, setUserId] = React.useState('');

  const [changedType, setChangedType] = React.useState(false);
  const [prevState, setPrevState] = React.useState('recent');

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

  const [openedCreate, toggleDialog] = React.useState(false);

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
            <Grid item container>
              <Grid>
                <Select
                  variant='standard'
                  labelId='post-type-select-label'
                  id='post-type-select'
                  value={postType}
                  onChange={(e) => {
                    setChangedType(true);
                    setPostType(e.target.value);
                  }}
                  label='Type'
                >
                  {postTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              {postType === 'Events' && (
                <Grid>
                  <FormControl>
                    <FormControlLabel
                      value='mapview'
                      control={
                        <Switch
                          color='primary'
                          checked={isMapView}
                          onChange={(e) => {
                            toggleMapView(e.target.checked);
                          }}
                        />
                      }
                      label='Toggle Map View'
                      labelPlacement='start'
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid marginLeft='auto'>
                <CreatePost isOpen={openedCreate} toggleDialog={toggleDialog} />
              </Grid>
            </Grid>

            <RecentPosts
              mapView={isMapView}
              openedCreate={openedCreate}
              userId={userId}
              type={postType}
              query={query}
              setPage={setPage}
              setPageCount={setPageCount}
              changedType={changedType}
              setChangedType={setChangedType}
              prevState={prevState}
              setPrevState={setPrevState}
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
