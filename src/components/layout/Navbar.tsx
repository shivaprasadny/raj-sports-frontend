import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROUTES } from "../../constants/routes";

const Navbar = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 3 }}>
          <Typography
            component={Link}
            to={ROUTES.HOME}
            variant="h6"
            sx={{ fontWeight: 700, flexGrow: 1 }}
          >
            Raj Sports
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to={ROUTES.PRODUCTS} color="inherit">
              Products
            </Button>
            <Button component={Link} to={ROUTES.ABOUT} color="inherit">
              About
            </Button>
            <Button component={Link} to={ROUTES.CONTACT} color="inherit">
              Contact
            </Button>
            <Button component={Link} to={ROUTES.LOGIN} color="inherit">
              Login
            </Button>
            <Button
              component={Link}
              to={ROUTES.CART}
              color="inherit"
              startIcon={<ShoppingCartIcon />}
            >
              Cart
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;