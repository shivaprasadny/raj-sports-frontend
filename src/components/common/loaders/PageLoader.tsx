import { Box, CircularProgress } from "@mui/material";

// PageLoader is ready for future async screens without repeating spinner layout.
const PageLoader = () => {
  return (
    <Box sx={{ display: "grid", minHeight: 320, placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
