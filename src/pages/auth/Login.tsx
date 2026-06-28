import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoAdminLogin = () => {
    login("demo-admin-token", {
      id: 1,
      name: "Raj Sports Admin",
      email: "admin@rajsports.com",
      role: "SUPER_ADMIN",
    });

    navigate(ROUTES.ADMIN);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Admin Login
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Temporary login for frontend testing.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" fullWidth />
          <TextField label="Password" type="password" fullWidth />

          <Button variant="contained" size="large" onClick={handleDemoAdminLogin}>
            Demo Admin Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;