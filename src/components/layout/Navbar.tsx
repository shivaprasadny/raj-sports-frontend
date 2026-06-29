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
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hooks";

const adminRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

// Navbar shows customer links, auth actions, cart count, wishlist count, and admin access.
const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

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
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Typography
            component={Link}
            to={ROUTES.HOME}
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, textDecoration: "none", color: "inherit" }}
          >
            Raj Sports
          </Typography>

          {/* ── Desktop navigation ────────────────────────────────── */}
          <Box sx={{ alignItems: "center", display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {navLinks.map((link) => (
              <Button key={link.path} component={Link} to={link.path} color="inherit">
                {link.label}
              </Button>
            ))}

            {canAccessAdmin && (
              <Button component={Link} to={ROUTES.ADMIN} color="inherit">
                Admin
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <Tooltip title="Profile">
                  <IconButton
                    component={Link}
                    to={ROUTES.PROFILE}
                    color="inherit"
                    aria-label="Profile"
                  >
                    <PersonOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button component={Link} to={ROUTES.LOGIN} color="inherit">
                Login
              </Button>
            )}

            {/* Wishlist icon with badge */}
            <Tooltip title="Wishlist">
              <IconButton
                component={Link}
                to={ROUTES.WISHLIST}
                color="inherit"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Badge badgeContent={wishlistCount || undefined} color="error" max={99}>
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Cart button */}
            <Button
              component={Link}
              to={ROUTES.CART}
              color="inherit"
              startIcon={
                <Badge badgeContent={cartCount || undefined} color="error" max={99}>
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Cart
            </Button>
          </Box>

          {/* ── Mobile — hamburger ────────────────────────────────── */}
          <Box sx={{ alignItems: "center", display: { xs: "flex", md: "none" }, gap: 0.5 }}>
            {/* Show wishlist + cart icons on mobile too */}
            <IconButton
              component={Link}
              to={ROUTES.WISHLIST}
              color="inherit"
              size="small"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Badge badgeContent={wishlistCount || undefined} color="error" max={99}>
                <FavoriteBorderIcon fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={(event) => setAnchorElement(event.currentTarget)}
              aria-label="Open navigation"
            >
              <Badge badgeContent={cartCount || undefined} color="error" max={99}>
                <MenuIcon />
              </Badge>
            </IconButton>
          </Box>

          <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={closeMenu}>
            {navLinks.map((link) => (
              <MenuItem key={link.path} component={Link} to={link.path} onClick={closeMenu}>
                {link.label}
              </MenuItem>
            ))}

            {canAccessAdmin && (
              <MenuItem component={Link} to={ROUTES.ADMIN} onClick={closeMenu}>
                Admin
              </MenuItem>
            )}

            {isAuthenticated ? (
              <>
                <MenuItem component={Link} to={ROUTES.PROFILE} onClick={closeMenu}>
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem component={Link} to={ROUTES.LOGIN} onClick={closeMenu}>
                Login
              </MenuItem>
            )}

            <MenuItem component={Link} to={ROUTES.CART} onClick={closeMenu}>
              Cart ({cartCount})
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
