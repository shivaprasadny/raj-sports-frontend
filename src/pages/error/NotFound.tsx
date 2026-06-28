import { Box, Container, Typography } from "@mui/material";
import PrimaryButton from "../../components/common/buttons/PrimaryButton";
import { ROUTES } from "../../constants/routes";

// NotFound gives users a clear recovery path when a route does not exist.
const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontWeight: 900 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          The page you are looking for does not exist or has moved.
        </Typography>
        <PrimaryButton href={ROUTES.HOME}>
          Back to Home
        </PrimaryButton>
      </Box>
    </Container>
  );
};

export default NotFound;
