import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { ROUTES } from "../../constants/routes";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <Container maxWidth="xs" sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 4, textAlign: "center" }}
        >
          <ErrorOutlinedIcon color="error" sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Invalid reset link
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            This link is missing the reset token. Please request a new one.
          </Typography>
          <Button component={Link} to={ROUTES.FORGOT_PASSWORD} variant="contained" disableElevation fullWidth>
            Request New Link
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post("/auth/reset-password", { token, newPassword: password });
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to reset password. The link may have expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 4 }}
      >
        {success ? (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 56, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Password reset!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Your password has been updated. You can now log in with your new password.
            </Typography>
            <Button component={Link} to={ROUTES.LOGIN} variant="contained" disableElevation fullWidth>
              Log In
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Set new password
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Choose a strong password that is at least 8 characters long.
            </Typography>

            <TextField
              fullWidth
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!error}
              helperText={error ?? " "}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{ fontWeight: 700, py: 1.5, mb: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
            </Button>

            <Button
              component={Link}
              to={ROUTES.FORGOT_PASSWORD}
              fullWidth
              variant="text"
              sx={{ fontWeight: 700 }}
            >
              Request a new link
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
