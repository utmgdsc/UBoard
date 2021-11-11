import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

import Header from "../components/Header";
import PostPreview from "../components/PostPreview";

import { api_v1 } from "../api/v1";
// import { PostUser } from "server/controllers/PostUser"
// import { Post } from "server/models/post";
// import { UserAttributes } from "server/models/user";

function RecentPosts() {

  // RESPONSE TYPE: {"status":200,"data":{"result":[{"id":"68a64a97-848c-49a8-a031-5eecf4efbbd0","title":"title","feedbackScore":10,"createdAt":"2021-11-11T04:46:07.281Z","User":{"firstName":"test","lastName":"test","userName":"testing"}}],"count":1}}
  const [recentPosts, updateRecent] = React.useState([]);

  const fetchRecentPosts = (limit: number, offset: number) => {
    api_v1
      .get("/posts/", {
        params: { limit, offset },
      })
      .then((res: any) => {
        console.dir(res.data.data.result);
        if (res.data.data.result) {
          updateRecent(res.data.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchRecentPosts(15, 0);
    }, 10000);

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
  return (
    <>
      <Header />
      <main>
        <Container
          sx={{ py: 5 }}
          maxWidth="xl"
          data-testid="test-post-container"
        >
          <Grid container spacing={7}>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Button variant="contained">New Post</Button>
            </Grid>
            <RecentPosts />
          </Grid>
        </Container>
      </main>

      <footer>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination count={1} color="primary" variant="outlined" />
        </Grid>

        <Box
          sx={{ bgcolor: "background.paper", p: 6, margin: "auto" }}
          component="footer"
        >
          <Typography variant="h6" align="center" gutterBottom>
            UBoard
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            You're all up to date!
          </Typography>
        </Box>
      </footer>
    </>
  );
}
