import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Header from "./Header";
import ViewPostDialog, { GenerateTags } from "./ViewPostDialog";
import Stack from "@mui/material/Stack";

const cards = [1, 2, 3, 4, 5, 6, 7]; // TODO: We can make this a list of post objects later

const theme = createTheme();

export default function PostDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>
        <Container sx={{ py: 5 }} maxWidth="xl">
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
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4} lg={4}>
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
                    <Typography sx={{ fontStyle: "italic" }}  >
                      x minutes ago by First Last (username)
                    </Typography>
                    <Typography sx={{ py: 1 }}>
                      {" "}
                      {/* TODO: Post body goes here. Preview text truncates body to ~100 chars */}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Stack sx={{pl: 1}}>
                      <ViewPostDialog />
                      {GenerateTags(["CS", "Academics", "2020"])}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Grid
        item
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pagination count={2} color="primary" variant="outlined" />
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
          You've reached the end :(
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
