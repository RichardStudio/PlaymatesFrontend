import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin, setIsLoggedIn, setUserEmail }) => {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    });

  const navigate = useNavigate(); // Для перенаправления

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { token, user } = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", token); // Сохраняем токен
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true); // Обновляем состояние
        setUserEmail(formData.email); // Обновляем email
        alert("Logged in successfully!");
        navigate("/profile"); // Перенаправляем на защищенную страницу
      } else {
        await registerUser(formData);
        alert("User registered successfully!");
        navigate("/login"); // Перенаправляем на страницу входа
      }
    } catch (error) {
      console.error("API Error:", error);
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />
      )}
      <TextField
        fullWidth
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {isLogin ? "Login" : "Register"}
      </Button>
    </form>
  );
};

export default AuthForm;