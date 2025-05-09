import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const ProtectedPage = () => {
  return (
    <div>
      <h2>Protected Content</h2>
      <ProtectedRoute />
    </div>
  );
};

export default ProtectedPage;