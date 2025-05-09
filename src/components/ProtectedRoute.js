import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { getProtectedData } from "../api";

const ProtectedRoute = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      try {
        const response = await getProtectedData(token);
        setData(response.message);
      } catch (error) {
        alert(`Error: ${error.response?.data?.error || "Access denied"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: "1px dashed #ddd", borderRadius: "8px", mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Protected Content:
      </Typography>
      <Typography variant="body1">{data}</Typography>
    </Box>
  );
};

export default ProtectedRoute;