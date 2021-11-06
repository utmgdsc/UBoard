import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Header from "./Header";
import PostPreview from "./PostPreview";

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
            <PostPreview />
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
      {/* End footer */}
    </ThemeProvider>
  );
}
