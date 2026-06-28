import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#111827", color: "white", py: 4, mt: 6 }}>
      <Container maxWidth="lg">
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
  Raj Sports
</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#D1D5DB" }}>
          Cricket equipment, accessories, and sports gear.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: "#9CA3AF" }}>
          © {new Date().getFullYear()} Raj Sports. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;