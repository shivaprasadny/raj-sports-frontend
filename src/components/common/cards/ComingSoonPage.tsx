import { Box, Paper, Typography } from "@mui/material";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          minHeight: 220,
          justifyContent: "center",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          This feature is coming soon
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
          The page is ready for integration and will show live data when this admin workflow is connected.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ComingSoonPage;
