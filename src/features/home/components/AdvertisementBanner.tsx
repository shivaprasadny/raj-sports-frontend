import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface AdvertisementBannerProps {
  /** Top label line (e.g. "SUMMER SALE"). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  /** CSS background — gradient, solid colour, or url(). */
  background?: string;
  /** Text colour. */
  color?: string;
  /** Height of the banner — defaults to 200px. */
  height?: number | string;
}

// AdvertisementBanner is a full-width promotional strip.
// Used twice on the home page — once between product sections, once near the bottom.
const AdvertisementBanner = ({
  eyebrow,
  title,
  subtitle,
  buttonText = "Shop Now",
  buttonHref = "/products",
  background = "linear-gradient(90deg, #2E7D32 0%, #1B5E20 100%)",
  color = "white",
  height = 200,
}: AdvertisementBannerProps) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        background,
        borderRadius: 3,
        color,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        justifyContent: "space-between",
        minHeight: height,
        my: 6,
        overflow: "hidden",
        p: { xs: 4, md: 6 },
        position: "relative",
      }}
    >
      {/* Decorative blob — purely visual */}
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.07)",
          borderRadius: "50%",
          height: 300,
          pointerEvents: "none",
          position: "absolute",
          right: -80,
          top: -80,
          width: 300,
        }}
      />

      {/* Text block */}
      <Box sx={{ maxWidth: 540 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: 2, opacity: 0.85 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, lineHeight: 1.2, my: 0.5 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* CTA */}
      {buttonText && (
        <Button
          component={Link}
          to={buttonHref}
          variant="contained"
          size="large"
          disableElevation
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color,
            flexShrink: 0,
            fontWeight: 700,
            px: 4,
            textTransform: "none",
            "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default AdvertisementBanner;
