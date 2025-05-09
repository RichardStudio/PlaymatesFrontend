import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, userEmail, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Левая часть: Логотип или название приложения */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PlayMates
        </Typography>

        {/* Центральная часть: Кнопка поиска (для авторизованных пользователей) */}
        {isLoggedIn && (
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Button
              color="inherit"
              onClick={() => navigate("/search")}
              variant="outlined"
              sx={{
                borderColor: "white", // Белая рамка для кнопки
                "&:hover": {
                  borderColor: "white", // Оставляем белую рамку при наведении
                },
              }}
            >
              Search
            </Button>
          </Box>
        )}

        {/* Правая часть: Элементы для авторизованных/неавторизованных пользователей */}
        {isLoggedIn ? (
          <>
            {/* Email пользователя */}
            <Button
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={{ mr: 2 }}
            >
              My Account
            </Button>

            {/* Кнопка "Messages" */}
            <Button
              color="inherit"
              onClick={() => navigate("/messages")}
              sx={{ mr: 2 }}
            >
              Messages
            </Button>

            {/* Кнопка выхода */}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Кнопка регистрации */}
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
            {/* Кнопка входа */}
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;