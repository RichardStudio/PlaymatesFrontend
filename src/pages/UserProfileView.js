import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfile } from "../api";

const UserProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Получаем ID текущего пользователя из localStorage
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(id);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // После загрузки данных проверяем, принадлежит ли профиль текущему пользователю
  useEffect(() => {
    if (!loading && profile && currentUserId && Number(id) === currentUserId) {
      navigate("/profile");
    }
  }, [profile, currentUserId, id, loading, navigate]);

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
          User Profile
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

        {/* Кнопка "Написать" */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/chat/${id}`)}
          sx={{ marginTop: "20px" }}
        >
          Write a Message
        </Button>
      </Paper>
    </Box>
  );
};

export default UserProfileView;
