import React from "react";
import AuthForm from "../components/AuthForm";

const Login = ({ setIsLoggedIn, setUserEmail }) => {
    return (
      <div>
        <h2>Login</h2>
        <AuthForm isLogin={true} setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />
      </div>
    );
  };

export default Login;