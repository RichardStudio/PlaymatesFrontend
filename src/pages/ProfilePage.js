import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { getProfile, updateProfile } from "../api";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    age: 0,
    gender: "",
    games: [],
    about_me: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age"){
        setProfile((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
        setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGamesChange = (e) => {
    const games = e.target.value.split(",").map((game) => game.trim());
    setProfile((prev) => ({ ...prev, games }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(profile);
      alert("Profile updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <TextField
        fullWidth
        name="age"
        label="Age"
        type="number"
        value={profile.age}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        name="gender"
        label="Gender"
        value={profile.gender}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        name="games"
        label="Games (comma-separated)"
        value={profile.games.join(", ")}
        onChange={handleGamesChange}
        margin="normal"
      />
      <TextField
        fullWidth
        name="about_me"
        label="About Me"
        multiline
        rows={4}
        value={profile.about_me}
        onChange={handleChange}
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    </div>
  );
};

export default ProfilePage;