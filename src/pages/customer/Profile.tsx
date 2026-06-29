import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";

// Derives user initials from their full name for the avatar.
const getInitials = (name?: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You must be logged in to view your profile.
        </Typography>
        <Button component={Link} to={ROUTES.LOGIN} variant="contained" disableElevation>
          Log In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 900, mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* ── Left column — avatar + quick actions ─────────────────── */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontSize: 36,
                height: 96,
                width: 96,
              }}
            >
              {user.name ? getInitials(user.name) : <AccountCircleIcon sx={{ fontSize: 56 }} />}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {user.name ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "primary.light",
                  borderRadius: 1,
                  color: "primary.contrastText",
                  display: "inline-block",
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                }}
              >
                {user.role}
              </Typography>
            </Box>

            <Divider sx={{ width: "100%" }} />

            {/* Quick action — My Orders */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate(ROUTES.MY_ORDERS)}
              sx={{ fontWeight: 700, justifyContent: "flex-start" }}
            >
              My Orders
            </Button>

            {/* Placeholder — Edit Profile */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => toast("Edit profile coming soon.", { icon: "✏️" })}
              sx={{ fontWeight: 700, justifyContent: "flex-start" }}
            >
              Edit Profile
            </Button>

            {/* Placeholder — Change Password */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => toast("Change password coming soon.", { icon: "🔒" })}
              sx={{ fontWeight: 700, justifyContent: "flex-start" }}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>

        {/* ── Right column — account details ───────────────────────── */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              Account Details
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  FULL NAME
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {user.name ?? "—"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  EMAIL ADDRESS
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {user.email}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  PHONE NUMBER
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {/* Phone is not in the current auth response — add when backend includes it */}
                  Not provided
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  ACCOUNT ROLE
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {user.role}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Shopping Activity
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<ShoppingBagIcon />}
                disableElevation
                component={Link}
                to={ROUTES.MY_ORDERS}
                sx={{ fontWeight: 700 }}
              >
                View My Orders
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={ROUTES.WISHLIST}
                sx={{ fontWeight: 700 }}
              >
                Go to Wishlist
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={ROUTES.PRODUCTS}
                sx={{ fontWeight: 700 }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
