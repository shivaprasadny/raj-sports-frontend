import { Card, CardContent } from "@mui/material";
import type { CardProps } from "@mui/material";
import type { ReactNode } from "react";

interface AppCardProps extends CardProps {
  children: ReactNode;
}

// AppCard gives dashboards, product cards, and sections one shared surface style.
const AppCard = ({ children, sx, ...props }: AppCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        ...sx,
      }}
      {...props}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AppCard;
