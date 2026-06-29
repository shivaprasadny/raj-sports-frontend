import { useState } from "react";
import { Box, Button, InputBase, Paper, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import toast from "react-hot-toast";
import type { MarketingBanner } from "../../../types/marketing";

interface NewsletterSectionProps {
  banner?: MarketingBanner;
}

const NewsletterSection = ({ banner }: NewsletterSectionProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const title = banner?.title ?? "Stay in the Game";
  const subtitle =
    banner?.subtitle ?? "Subscribe for exclusive offers, new arrivals, and cricket tips";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    toast.success("You're subscribed! Watch your inbox for deals.");
    setEmail("");
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
        borderRadius: 4,
        color: "white",
        my: 6,
        py: 8,
        px: { xs: 3, md: 8 },
        textAlign: "center",
      }}
    >
      <EmailIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ mb: 4, opacity: 0.85 }}>{subtitle}</Typography>

      {submitted ? (
        <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.9 }}>
          Thanks for subscribing!
        </Typography>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            alignItems: "center",
            display: "flex",
            gap: 0,
            justifyContent: "center",
            maxWidth: 480,
            mx: "auto",
          }}
        >
          <Paper
            sx={{
              alignItems: "center",
              borderRadius: "12px 0 0 12px",
              display: "flex",
              flexGrow: 1,
              px: 2,
              py: 0.5,
            }}
            elevation={0}
          >
            <InputBase
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flexGrow: 1, fontSize: 15 }}
              inputProps={{ "aria-label": "Email address for newsletter" }}
            />
          </Paper>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#E65100",
              borderRadius: "0 12px 12px 0",
              fontWeight: 800,
              px: 3,
              py: 1.25,
              textTransform: "none",
              "&:hover": { bgcolor: "#BF360C" },
            }}
          >
            Subscribe
          </Button>
        </Box>
      )}

      <Typography variant="caption" sx={{ display: "block", mt: 2, opacity: 0.6 }}>
        No spam. Unsubscribe anytime.
      </Typography>
    </Box>
  );
};

export default NewsletterSection;
