import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Admin Portal
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              {user.name} • {user.role}
            </Typography>
          )}
        </Box>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;