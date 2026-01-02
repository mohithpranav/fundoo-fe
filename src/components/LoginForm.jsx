import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "./GoogleLogo";
import { signin } from "../services/authService";
import { setCookie } from "../utils/cookieUtils";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await signin(formData);
      setCookie("authToken", response.token, 5);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
        <button
          className="btn btn-primary px-4 py-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
