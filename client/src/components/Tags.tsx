import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Cancel from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/* Generate pre-formatted TagItems based on an array of provided tags */
export default function GenerateTags(tags: string[]) {
  return (
    <Stack direction='row' spacing={3} style={{ alignItems: 'center' }}>
      {tags.map((tag: string) => (
        <Tag tag={tag} />
      ))}
    </Stack>
  );
}

export function Tag(props: { tag: string }) {
  return (
    <>
      <TagItem key={props.tag}>{props.tag}</TagItem>
    </>
  );
}

export function TagCreator(props: {
  tag: string;
  del: (value: string) => void;
}) {
  return (
    <Box
      sx={{
        background: 'purple',
        padding: '5px',
        margin: '5px',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff',
        borderRadius: '15px',
      }}
    >
      <Stack direction='row' gap={1}>
        <Typography variant='caption' sx={{pl: 1}}>{props.tag}</Typography>
        <Cancel
          sx={{ cursor: 'pointer' }}
          fontSize='small'
          onClick={() => {
            props.del(props.tag);
          }}
        />
      </Stack>
    </Box>
  );
}

/* Structure for each tag item -- colored "bubble" */
const TagItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.caption,
  padding: '4px 8px 4px 8px',
  textAlign: 'center',
  color: theme.palette.text.primary,
  background: '#ef9a9a',
  borderRadius: '15px',
}));
