import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Admin Portal
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;