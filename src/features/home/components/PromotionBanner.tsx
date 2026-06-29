import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface PromotionBannerProps {
  /** Bold headline text. */
  title: string;
  /** Supporting line shown below the title. */
  subtitle?: string;
  /** CTA button label. */
  buttonText?: string;
  /** React-router path the CTA navigates to. */
  buttonHref?: string;
  /** CSS background value — gradient, colour, or image URL.
   *  Defaults to a blue gradient that matches the store primary colour. */
  background?: string;
  /** Text colour — defaults to white, change to dark for light backgrounds. */
  color?: string;
}

// PromotionBanner is a reusable marketing card used in the Special Offers section
// and wherever the admin wants to highlight a deal or campaign.
// TODO: When a backend promotions API exists, replace the props with CMS data.
const PromotionBanner = ({
  title,
  subtitle,
  buttonText = "Shop Now",
  buttonHref = "/products",
  background = "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
  color = "white",
}: PromotionBannerProps) => {
  return (
    <Box
      sx={{
        background,
        borderRadius: 3,
        color,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: "100%",
        justifyContent: "space-between",
        minHeight: 180,
        overflow: "hidden",
        p: 3,
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
      }}
    >
      {/* Decorative circle — visual depth */}
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          height: 160,
          position: "absolute",
          right: -40,
          top: -40,
          width: 160,
        }}
      />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2, position: "relative" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.85, position: "relative" }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {buttonText && (
        <Button
          component={Link}
          to={buttonHref}
          variant="contained"
          disableElevation
          sx={{
            alignSelf: "flex-start",
            bgcolor: "rgba(255,255,255,0.2)",
            color,
            fontWeight: 700,
            mt: 1,
            position: "relative",
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

export default PromotionBanner;
