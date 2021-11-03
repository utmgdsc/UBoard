import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination'
import Header from './Header';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function PostDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header/>
      <main>
        <Container sx={{ py: 8 }} maxWidth="xl">
          <Grid container spacing={4}>
            {cards.map((card) => ( // TODO: Pull from DB
              <Grid item key={card} xs={12} sm={6} md={4} lg={4}>
                <Card
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    src=" "
                    alt="placeholder"
                    sx={{maxWidth: '500px', maxHeight: '250px'}}
                    
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2">
                      Cool upcoming event
                    </Typography>
                    <Typography sx={{fontStyle: "italic"}} display="inline">
                      x minutes ago by UserName
                    </Typography>  
                    <Typography sx={{py: 1}}> {/* TODO: Post body goes here. Need to check lengths and sanitize input */}
              
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                      Ut enim ad minim veniam, 
                      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" size="small">Read More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6, margin: 'auto'}} component="footer" >
        <Typography variant="h6" align="center" gutterBottom>
        <Pagination count={2} color="primary" variant="outlined"   />
        UBoard
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          You've reached the end :-(
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}