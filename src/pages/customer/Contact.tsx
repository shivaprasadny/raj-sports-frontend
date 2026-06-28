import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PrimaryButton from "../../components/common/buttons/PrimaryButton";

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 32, color: "primary.main" }} />,
    label: "Email",
    value: "support@rajsports.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    label: "Phone",
    value: "+1 (212) 555-0182",
    sub: "Mon – Sat, 9 am – 6 pm EST",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 32, color: "warning.main" }} />,
    label: "Location",
    value: "42 Cricket Lane, Queens",
    sub: "New York, NY 11354, USA",
  },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 am – 7:00 pm" },
  { day: "Saturday", time: "10:00 am – 6:00 pm" },
  { day: "Sunday", time: "11:00 am – 4:00 pm" },
];

const Contact = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 900, maxWidth: 680 }}>
            Contact Raj Sports
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, maxWidth: 560, opacity: 0.9 }}>
            Questions about gear, orders, or availability? Reach out — our team of cricket
            enthusiasts is here to help.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Contact Info Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactInfo.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 1.5 }}>{item.icon}</Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.sub}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Form + Hours */}
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                p: { xs: 3, md: 4 },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Send Us a Message
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Fill in the form and we'll get back to you as soon as possible.
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="First Name" fullWidth required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Last Name" fullWidth />
                </Grid>
              </Grid>
              <TextField label="Email Address" type="email" fullWidth required />
              <TextField label="Phone Number" type="tel" fullWidth />
              <TextField
                label="Subject"
                fullWidth
                placeholder="e.g. Question about bat sizes"
              />
              <TextField
                label="Message"
                multiline
                rows={5}
                fullWidth
                required
                placeholder="Tell us what you need help with…"
              />
              <PrimaryButton type="submit" size="large">
                Send Message
              </PrimaryButton>
            </Box>
          </Grid>

          {/* Store Hours + Extra Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Hours */}
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Store Hours
                  </Typography>
                </Box>
                {hours.map((h, i) => (
                  <Box key={h.day}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1.25,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {h.day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {h.time}
                      </Typography>
                    </Box>
                    {i < hours.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>

              {/* FAQ teaser */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #EBF4FF 0%, #F0FFF4 100%)",
                  border: "1px solid",
                  borderColor: "primary.light",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Common Questions
                </Typography>
                {[
                  "Do you ship internationally?",
                  "Can I return unused gear?",
                  "Do you offer bulk discounts for clubs?",
                  "How do I pick the right bat size?",
                ].map((q) => (
                  <Typography
                    key={q}
                    variant="body2"
                    color="primary"
                    sx={{ mt: 1, fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                  >
                    {q}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
