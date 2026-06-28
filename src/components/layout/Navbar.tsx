import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hooks";

const adminRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

// Navbar shows customer links, auth actions, cart count, and role-based admin access.
const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const cartCount = useAppSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const canAccessAdmin = Boolean(user && adminRoles.includes(user.role));

  const navLinks = [
    { label: "Home", path: ROUTES.HOME },
    { label: "Products", path: ROUTES.PRODUCTS },
    { label: "About", path: ROUTES.ABOUT },
    { label: "Contact", path: ROUTES.CONTACT },
  ];

  const closeMenu = () => setAnchorElement(null);

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

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.path} component={Link} to={link.path} color="inherit">
                {link.label}
              </Button>
            ))}
            {canAccessAdmin ? (
              <Button component={Link} to={ROUTES.ADMIN} color="inherit">
                Admin
              </Button>
            ) : null}
            {isAuthenticated ? (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button component={Link} to={ROUTES.LOGIN} color="inherit">
                Login
              </Button>
            )}
            <Button component={Link} to={ROUTES.CART} color="inherit" startIcon={<ShoppingCartIcon />}>
              Cart ({cartCount})
            </Button>
          </Box>

          <IconButton
            color="inherit"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={(event) => setAnchorElement(event.currentTarget)}
            aria-label="Open navigation"
          >
            <Badge badgeContent={cartCount} color="error">
              <MenuIcon />
            </Badge>
          </IconButton>
          <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={closeMenu}>
            {navLinks.map((link) => (
              <MenuItem key={link.path} component={Link} to={link.path} onClick={closeMenu}>
                {link.label}
              </MenuItem>
            ))}
            {canAccessAdmin ? (
              <MenuItem component={Link} to={ROUTES.ADMIN} onClick={closeMenu}>
                Admin
              </MenuItem>
            ) : null}
            <MenuItem component={Link} to={ROUTES.CART} onClick={closeMenu}>
              Cart ({cartCount})
            </MenuItem>
            {isAuthenticated ? (
              <MenuItem
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Logout
              </MenuItem>
            ) : (
              <MenuItem component={Link} to={ROUTES.LOGIN} onClick={closeMenu}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
