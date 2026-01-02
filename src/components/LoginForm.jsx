import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "./GoogleLogo";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Login submitted:", formData);
  };

  return (
    <div
      className="card border rounded"
      style={{ maxWidth: "450px", padding: "48px 40px" }}
    >
      <div className="d-flex justify-content-center mb-4">
        <GoogleLogo width={1600} height={100} />
      </div>
      <h2
        className="text-center mb-1"
        style={{ fontSize: "24px", fontWeight: 400 }}
      >
        <h1>Login</h1>
      </h2>

      <p className="text-center text-muted mb-4">Use your Google Account</p>

      <input
        className="form-control form-control-lg mb-3"
        placeholder="Email or phone*"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        className="form-control form-control-lg mb-2"
        placeholder="Password*"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="mb-4">
        <a href="#" className="text-primary text-decoration-none">
          Forgot password?
        </a>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <Link
          to="/signup"
          className="text-primary text-decoration-none fw-medium"
        >
          Create account
        </Link>
        <button className="btn btn-primary px-4 py-2" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
