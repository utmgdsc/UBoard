import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import GenerateTags from './Tags';

import { PostUserPreview } from '../api/v1/index';
import { useNavigate } from 'react-router-dom';

/**
 * Return a string of the date relative to now in minutes, hours or days. If the date
 * is over a month, return the date stringified.
 *
 * @param date - The date converted into relative time
 * @returns String containing the date relative to now
 */
function relativeTime(date: Date) {
  const diff = Math.floor(
    Math.abs((new Date().valueOf() - date.valueOf()) / 1000)
  ); // seconds
  const mins = Math.floor(diff / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (diff < 60) {
    return diff <= 2 ? `A moment ago` : `${diff} seconds ago`;
  } else if (mins < 60) {
    // Less than 60 mins (display minutes)
    return `${mins} minute(s) ago`;
  } else if (hrs < 24) {
    // Less than 24 hrs (display hours)
    return `${hrs} hour(s) ago`;
  } else if (days < 31) {
    // Less than a month (display days)
    return `${days} day(s) ago`;
  } else {
    return `${date.toDateString()}`;
  }
}

export default function PostPreview(props: { postUser: PostUserPreview }) {
  // generate tags (if the post has any)
  const tags = (
    <GenerateTags
      tags={
        props.postUser.Tags
          ? props.postUser.Tags.map((t) =>
              t.text.length > 10 ? t.text.slice(0, 7) + '...' : t.text
            )
          : []
      }
    />
  );
  const [isHovered, setHover] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Grid data-testid='test-postpreview' item xs={12} sm={6} md={4} lg={4}>
      <Card
        raised={isHovered}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 500,
          cursor: 'pointer',
          borderRadius: '10px',
        }}
        onClick={() => {
          navigate(`/post-${props.postUser.id}`);
        }}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {!!props.postUser.thumbnail ? (
          <CardMedia
            component='img'
            src={props.postUser.thumbnail}
            alt='placeholder'
            sx={{ maxWidth: '500px', maxHeight: '145px' }}
          />
        ) : undefined}
        <CardContent sx={{ flexGrow: 1, mb: -2 }}>
          <Grid container>
            <Grid item xs={8}>
              <Typography
                variant='h5'
                component='h2'
                style={{ wordWrap: 'break-word' }}
              >
                {props.postUser.title.length > 30
                  ? props.postUser.title.substring(0, 27) + '...'
                  : props.postUser.title}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign='right' variant='subtitle2'>
                {props.postUser.type.slice(0, -1)}
              </Typography>
            </Grid>
          </Grid>

          <Typography
            sx={{ fontStyle: 'italic' }}
            style={{ wordWrap: 'break-word' }}
          >
            {relativeTime(new Date(props.postUser.createdAt))} by{' '}
            {props.postUser.User.firstName} {props.postUser.User.lastName}
          </Typography>
          <Typography sx={{ py: 1 }} style={{ wordWrap: 'break-word' }}>
            {props.postUser.body.length > 150
              ? props.postUser.body.substring(0, 147) + '...'
              : props.postUser.body}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container style={{ textAlign: 'center' }} spacing={2}>
            <Grid item xs={4}>
              <ThumbUpIcon />
              <Typography>{props.postUser.likeCount}</Typography>
            </Grid>
            {Number(props.postUser.capacity) > 0 ? (
              <Grid item xs={4}>
                <PeopleAltIcon />
                <Typography>
                  {props.postUser.usersCheckedIn
                    ? props.postUser.usersCheckedIn
                    : 0}
                  /{props.postUser.capacity}
                </Typography>
              </Grid>
            ) : (
              <> </>
            )}
            <Grid item xs={4}>
              <ChatBubbleIcon />
              <Typography>{props.postUser.totalComments}</Typography>
            </Grid>
            <Grid item md={12}>
              {tags}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
}
