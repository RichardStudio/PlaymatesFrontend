import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem, Select, FormHelperText } from "@mui/material";
import { getProfile, updateProfile } from "../api";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    games: "",
    about_me: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          age: data.age.toString(),
          gender: data.gender,
          games: data.games.join(", "),
          about_me: data.about_me,
        });
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "age") {
      if (/^\d*$/.test(value)) {
        setProfile((prev) => ({ ...prev, age: value }));
      }
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleGamesChange = (e) => {
  const value = e.target.value;
  setProfile((prev) => ({ ...prev, games: value }));

  // Разрешаем любые символы, но запятая должна быть с пробелом после неё
  if (!/^([^,]+)(, [^,]+)*$/.test(value)) {
    setErrors((prev) => ({ ...prev, games: "Games must be separated by commas followed by a space." }));
  } else {
    setErrors((prev) => ({ ...prev, games: "" }));
  }
};

  const handleSubmit = async () => {
  const newErrors = {};

  if (!profile.age || isNaN(Number(profile.age))) {
    newErrors.age = "Age must be a valid number.";
  }
  if (!profile.gender) {
    newErrors.gender = "Please select a gender.";
  }
  if (!profile.games.match(/^([^,]+)(, [^,]+)*$/)) {  
    newErrors.games = "Games must be separated by commas followed by a space.";
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    await updateProfile({
      age: Number(profile.age),
      gender: profile.gender,
      games: profile.games.split(", "),
      about_me: profile.about_me,
    });
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error.message);
  }
};

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Age */}
      <TextField
        fullWidth
        name="age"
        label="Age"
        type="text"
        value={profile.age}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.age)}
        helperText={errors.age}
      />

      {/* Gender */}
      <Select
        fullWidth
        name="gender"
        value={profile.gender}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="">Select Gender</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Not specified">Not specified</MenuItem>
      </Select>
      {errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}

      {/* Games */}
      <TextField
        fullWidth
        name="games"
        label="Games (comma-separated)"
        value={profile.games}
        onChange={handleGamesChange}
        margin="normal"
        error={Boolean(errors.games)}
        helperText={errors.games}
      />

      {/* About Me */}
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

      {/* Save Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </div>
  );
};

export default ProfilePage;
