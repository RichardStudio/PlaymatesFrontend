import React from "react";
import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <AuthForm isLogin={false} />
    </div>
  );
};

export default Register;