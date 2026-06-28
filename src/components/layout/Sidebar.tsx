import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const links = [
  { label: "Dashboard", path: ROUTES.ADMIN },
  { label: "Brands", path: ROUTES.ADMIN_BRANDS },
  { label: "Categories", path: ROUTES.ADMIN_CATEGORIES },
  { label: "Products", path: ROUTES.ADMIN_PRODUCTS },
  { label: "Orders", path: ROUTES.ADMIN_ORDERS },
  { label: "Customers", path: ROUTES.ADMIN_CUSTOMERS },
  { label: "Inventory", path: ROUTES.ADMIN_INVENTORY },
  { label: "Settings", path: ROUTES.ADMIN_SETTINGS },
];

const Sidebar = () => {
  return (
    <Box sx={{ width: 240, bgcolor: "#111827", color: "white", p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Raj Sports
      </Typography>

      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.path}
            component={NavLink}
            to={link.path}
            end={link.path === ROUTES.ADMIN}
            sx={{
              borderRadius: 2,
              color: "white",
              mb: 1,
              "&.active": {
                bgcolor: "primary.main",
              },
            }}
          >
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
