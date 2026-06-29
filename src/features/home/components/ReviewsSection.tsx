import { Avatar, Box, Grid, Paper, Rating, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

// Placeholder reviews — replace with real API data when available.
const REVIEWS = [
  {
    name: "Arjun Mehta",
    location: "Mumbai",
    rating: 5,
    text: "The SS Ton bat I ordered arrived in perfect condition. Outstanding quality — exactly what I needed for the club season.",
    initials: "AM",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "Fast delivery and great packaging. The SG cricket ball set is excellent value. Will definitely order again.",
    initials: "PS",
  },
  {
    name: "Rohan Patel",
    location: "Ahmedabad",
    rating: 4,
    text: "Good selection of protective gear. The batting gloves fit perfectly. Customer support was very helpful.",
    initials: "RP",
  },
  {
    name: "Deepika Iyer",
    location: "Chennai",
    rating: 5,
    text: "Bought a complete kit for my son. Everything was as described and arrived ahead of schedule. Excellent service!",
    initials: "DI",
  },
];

const AVATAR_COLORS = ["#1565C0", "#2E7D32", "#E65100", "#7B1FA2"];

const ReviewsSection = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        What Our Customers Say
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Trusted by thousands of cricket players across India
      </Typography>

      <Grid container spacing={2}>
        {REVIEWS.map((review, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
                p: 3,
              }}
            >
              <FormatQuoteIcon sx={{ color: "primary.main", fontSize: 36 }} />

              <Rating value={review.rating} readOnly size="small" />

              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.7 }}>
                "{review.text}"
              </Typography>

              <Box sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, fontSize: 13 }}>
                  {review.initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {review.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.location}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewsSection;
