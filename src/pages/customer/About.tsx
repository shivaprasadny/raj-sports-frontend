import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import VerifiedIcon from "@mui/icons-material/Verified";

const stats = [
  { value: "10+", label: "Years in Business" },
  { value: "500+", label: "Products" },
  { value: "12,000+", label: "Happy Customers" },
  { value: "30+", label: "Brands" },
];

const values = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 36, color: "primary.main" }} />,
    title: "Quality First",
    desc: "Every product we carry is tested and trusted. We only stock gear that we'd use ourselves on the pitch.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
    title: "Built for the Community",
    desc: "From school cricket clubs to state-level players, we serve cricketers of every age, level, and budget.",
  },
  {
    icon: <HandshakeIcon sx={{ fontSize: 36, color: "warning.main" }} />,
    title: "Fair Pricing",
    desc: "No hidden markups. We partner directly with manufacturers and pass the savings straight to you.",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 36, color: "primary.main" }} />,
    title: "Champion Support",
    desc: "Our team is made up of cricket enthusiasts who give honest advice — not just a sales pitch.",
  },
];

const equipment = ["Bats", "Balls", "Gloves", "Pads", "Helmets", "Shoes", "Accessories", "Bags"];

const team = [
  { name: "Raj Patel", role: "Founder & Head Buyer", initials: "RP" },
  { name: "Anita Sharma", role: "Customer Experience Lead", initials: "AS" },
  { name: "Dev Kumar", role: "Gear & Equipment Specialist", initials: "DK" },
];

const About = () => {
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
            About Raj Sports
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, maxWidth: 560, opacity: 0.9 }}>
            We are a family-run cricket equipment store dedicated to helping every player find the
            right gear — from first-timers to seasoned pros.
          </Typography>
        </Container>
      </Box>

      {/* Stats Strip */}
      <Box sx={{ bgcolor: "#1E3A5F", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container>
            {stats.map((stat, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 900 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.75 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Our Story */}
        <Grid container spacing={4} sx={{ mb: 8, alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              Our Story
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, mb: 2 }}>
              From a Small Shop to a Trusted Cricket Store
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              Raj Sports was founded in 2014 in New York by cricket lover Raj Patel, who struggled to
              find quality cricket gear in the US at reasonable prices. What started as a small corner
              shop stocking a handful of bats and balls has grown into a full-service cricket equipment
              destination serving players across the country.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Today, we carry over 500 products across every major category — from entry-level kit for
              beginners to professional-grade equipment for club and tournament players. Cricket is a
              passion, and this store is our way of giving back to the sport.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                background: "linear-gradient(135deg, #EBF4FF 0%, #F0FFF4 100%)",
                borderColor: "primary.light",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                What We Stock
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {equipment.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                ))}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" color="text.secondary">
                We source from top-tier brands including Gray-Nicolls, Kookaburra, Gunn & Moore,
                SS, SG, and more — all in one place, shipped directly to your door.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Values */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            Our Values
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, mb: 4 }}>
            What We Stand For
          </Typography>
          <Grid container spacing={3}>
            {values.map((v) => (
              <Grid key={v.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{v.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                      {v.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {v.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            Our Team
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, mb: 4 }}>
            The People Behind Raj Sports
          </Typography>
          <Grid container spacing={3}>
            {team.map((member) => (
              <Grid key={member.name} size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: "center",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 700,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {member.initials}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {member.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
