import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: "600px", margin: "auto" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Username:</strong> {profile.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {profile.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Age:</strong> {profile.age || "Not specified"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Gender:</strong> {profile.gender || "Not specified"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Games:</strong>{" "}
          {profile.games && profile.games.length > 0
            ? profile.games.join(", ")
            : "No games added"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>About Me:</strong>{" "}
          {profile.about_me || "No information provided"}
        </Typography>

        {/* Кнопка редактирования */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/profile/edit")}
          sx={{ mt: 2 }}
        >
          Edit Profile
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileView;