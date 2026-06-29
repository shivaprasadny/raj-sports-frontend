import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { ROUTES } from "../../constants/routes";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.post<{ data?: { devResetUrl?: string } }>(
        "/auth/forgot-password",
        { email: email.trim().toLowerCase() }
      );
      if (res.data?.data?.devResetUrl) {
        setDevResetUrl(res.data.data.devResetUrl);
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
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
        {sent ? (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 56, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Check your inbox
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              If <strong>{email}</strong> is registered, we&apos;ve sent a password reset link.
              Check your email and follow the instructions.
            </Typography>

            {devResetUrl && (
              <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Dev mode — no email configured
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Click the link below to reset your password:
                </Typography>
                <Typography
                  component="a"
                  href={devResetUrl}
                  variant="body2"
                  sx={{ wordBreak: "break-all", color: "primary.main", fontWeight: 600 }}
                >
                  {devResetUrl}
                </Typography>
              </Alert>
            )}

            <Button component={Link} to={ROUTES.LOGIN} variant="contained" disableElevation fullWidth>
              Back to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Forgot password?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Enter your email and we&apos;ll send a reset link if the account exists.
            </Typography>

            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
            </Button>

            <Button
              component={Link}
              to={ROUTES.LOGIN}
              fullWidth
              variant="text"
              sx={{ fontWeight: 700 }}
            >
              Back to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
