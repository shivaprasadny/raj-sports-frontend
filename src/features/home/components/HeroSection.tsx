import { Box, Container, Typography } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import { ROUTES } from "../../../constants/routes";
import type { MarketingBanner } from "../../../types/marketing";
import { resolveImageUrl } from "../../../utils/image";

interface HeroSectionProps {
  banner?: MarketingBanner;
}

const DEFAULT_TITLE = "Raj Sports Cricket Gear";
const DEFAULT_SUBTITLE =
  "Shop bats, balls, gloves, helmets, and training essentials for every level of player.";
const DEFAULT_BUTTON = "Shop Products";

const HeroSection = ({ banner }: HeroSectionProps) => {
  const title = banner?.title ?? DEFAULT_TITLE;
  const subtitle = banner?.subtitle ?? DEFAULT_SUBTITLE;
  const buttonText = banner?.buttonText ?? DEFAULT_BUTTON;
  const buttonHref = banner?.buttonLink ?? ROUTES.PRODUCTS;
  const bgImage = banner?.imageUrl ? resolveImageUrl(banner.imageUrl) : undefined;

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "primary.contrastText",
        position: "relative",
        py: { xs: 8, md: 12 },
      }}
    >
      {/* Dark overlay when there is a background image */}
      {bgImage && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Typography variant="h2" sx={{ fontWeight: 900, maxWidth: 720 }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 2, maxWidth: 560 }} variant="h6">
          {subtitle}
        </Typography>
        <PrimaryButton
          href={buttonHref}
          sx={{ bgcolor: "common.white", color: "primary.main", mt: 4 }}
        >
          {buttonText}
        </PrimaryButton>
      </Container>
    </Box>
  );
};

export default HeroSection;
