import React from "react";
import { Typography, Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h5" sx={{ ml: 2 }}>
        Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;