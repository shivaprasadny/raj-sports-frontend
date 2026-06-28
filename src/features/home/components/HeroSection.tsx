import { Box, Container, Typography } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import { ROUTES } from "../../../constants/routes";

// HeroSection gives the storefront a strong first viewport entry point.
const HeroSection = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontWeight: 900, maxWidth: 720 }}>
          Raj Sports Cricket Gear
        </Typography>
        <Typography sx={{ mt: 2, maxWidth: 560 }} variant="h6">
          Shop bats, balls, gloves, helmets, and training essentials for every level of player.
        </Typography>
        <PrimaryButton href={ROUTES.PRODUCTS} sx={{ bgcolor: "common.white", color: "primary.main", mt: 4 }}>
          Shop Products
        </PrimaryButton>
      </Container>
    </Box>
  );
};

export default HeroSection;
