import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./pages/Protected";
import ProfilePage from "./pages/ProfilePage";
import ProfileView from "./pages/ProfileView";
import SearchUsers from "./pages/SearchUsers";
import NotFound from "./pages/NotFound";
import UserProfileView from "./pages/UserProfileView";
import MessagesPage from "./pages/MessagePage";
import ChatPage from "./pages/ChatPage";
import { CssBaseline, Container, Button } from "@mui/material";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token"));
  const [userEmail, setUserEmail] = React.useState(localStorage.getItem("userEmail") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return (
    <Router>
      <CssBaseline />
      <Navbar isLoggedIn={isLoggedIn} userEmail={userEmail} handleLogout={handleLogout} />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? (
                <Login setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />
              ) : (
                <Navigate to="/profile" />
              )
            } 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <Register /> : <Navigate to="/profile" />} 
          />

          {/* Защищенный маршрут */}
          <Route
            path="/protected"
            element={isLoggedIn ? <ProtectedPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={isLoggedIn ? <ProfileView /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/edit"
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={isLoggedIn ? <SearchUsers /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={isLoggedIn ? <UserProfileView /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={isLoggedIn ? <MessagesPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />}
          />

          {/* Перенаправление на /login по умолчанию */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;