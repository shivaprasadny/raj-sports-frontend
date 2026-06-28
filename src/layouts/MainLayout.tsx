import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <Box>
      <Navbar />
      <Box component="main" sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;