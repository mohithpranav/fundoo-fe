import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <LoginForm />
    </div>
  );
};

export default Login;
