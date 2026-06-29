import { Box, Grid, Typography } from "@mui/material";
import PromotionBanner from "./PromotionBanner";
import type { MarketingBanner } from "../../../types/marketing";

interface SpecialOffersSectionProps {
  banners?: MarketingBanner[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_BANNERS = [
  {
    title: "End of Season Sale",
    subtitle: "Up to 40% off on premium cricket bats",
    buttonText: "Shop Bats",
    buttonLink: "/products",
    background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh protective gear just landed",
    buttonText: "See What's New",
    buttonLink: "/products",
    background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
  },
  {
    title: "Bundle & Save",
    subtitle: "Complete kit sets starting from $199",
    buttonText: "View Bundles",
    buttonLink: "/products",
    background: "linear-gradient(135deg, #E65100 0%, #BF360C 100%)",
  },
];

const SpecialOffersSection = ({
  banners,
  title = "Special Offers",
  subtitle = "Handpicked deals for cricket enthusiasts",
}: SpecialOffersSectionProps) => {
  const items =
    banners && banners.length > 0
      ? banners.map((b) => ({
          title: b.title,
          subtitle: b.subtitle,
          buttonText: b.buttonText ?? "Shop Now",
          buttonLink: b.buttonLink ?? "/products",
          background: undefined,
        }))
      : DEFAULT_BANNERS;

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {subtitle}
      </Typography>

      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <PromotionBanner
              title={item.title}
              subtitle={item.subtitle}
              buttonText={item.buttonText}
              buttonHref={item.buttonLink}
              background={item.background}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SpecialOffersSection;
