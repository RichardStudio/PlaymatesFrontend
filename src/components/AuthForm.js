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
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // Состояние для ошибок с бэкенда
  
  const navigate = useNavigate();

  // Функция валидации формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Для регистрации также проверяем username
    if (!isLogin && !formData.username) {
      newErrors.username = "Username is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Если есть ошибка для данного поля, очищаем её
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    // Если была ошибка с бэкенда, очищаем и её
    if (apiError) {
      setApiError("");
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        const { token, user } = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setUserEmail(formData.email);
        navigate("/profile");
      } else {
        await registerUser(formData);
        navigate("/login");
      }
    } catch (error) {
      console.error("API Error:", error);
      // Устанавливаем сообщение об ошибке, полученное с бэкенда
      setApiError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
      )}
      <TextField
        fullWidth
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password}
      />
      {apiError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {apiError}
        </Typography>
      )}
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
