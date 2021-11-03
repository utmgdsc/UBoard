import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination'


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

// Style for the inside of search box
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  marginRight: "auto",
  width: '100%',
  [theme.breakpoints.up('sm')]: { // min width sm to active this
    marginLeft: "auto",
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(8)})`,
    // transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { // activate >= sm
      width: '100ch', // 50 chars width
      // '&:focus': {
      //   width: '100ch',
      // },
      
    },
    [theme.breakpoints.down('sm')]: {
      width: '50ch',
    },

  },
}));

export default function PostDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AppBar position="static">
          <Toolbar sx={{ alignItems: "center" }}>
            <Typography variant="h6" color="inherit" noWrap>
              UBoard
            </Typography>  
          <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase 
              placeholder="Search by a post name, tags, author, etc.."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>


          </Toolbar>

        </AppBar>

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
                    image="https://source.unsplash.com/random"
                    alt="random"
                    sx={{maxWidth: '425px', maxHeight: '250px'}}
                    
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      UBoard Placeholder..
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" size="small">View More</Button>
                    {/* <Button size="small">Edit</Button> */}
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