import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ViewPostDialog from "./ViewPostDialog";
import GenerateTags from "./Tags";

export default function PostPreview() {
  // TODO: Integrate with post API, each grid ID should be unique as well.
  return (
        <Grid data-testid="test-postpreview" item xs={12} sm={6} md={4} lg={4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 500,
            }}
          >
            <CardMedia
              component="img"
              src="https://i.imgur.com/8EYKtwP.png"
              alt="placeholder"
              sx={{ maxWidth: "500px", maxHeight: "145px" }}
            />
            <CardContent sx={{ flexGrow: 1, mb: -2 }}>
              <Typography variant="h5" component="h2">
                Upcoming Event
              </Typography>
              <Typography sx={{ fontStyle: "italic" }}>
                x minutes ago by First Last (username)
              </Typography>
              <Typography sx={{ py: 1 }}>
                {/* TODO: Post body goes here. Preview text truncates body to ~100 chars */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua...
              </Typography>
            </CardContent>
            <CardActions>
              <Stack sx={{ pl: 1 }}>
                <ViewPostDialog />
                {GenerateTags(["CS", "Academics", "2020"])}
              </Stack>
            </CardActions>
          </Card>
        </Grid>
  );
}
