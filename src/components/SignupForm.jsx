import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirm
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-6 mb-3">
          <input
            className="form-control form-control-lg"
            placeholder="First Name*"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control form-control-lg"
            placeholder="Last Name*"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <input
          className="form-control form-control-lg"
          placeholder="Email*"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control form-control-lg"
          placeholder="Username*"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <small className="text-muted">
          You can use letters, numbers & periods
        </small>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg"
            placeholder="Password*"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg"
            placeholder="Confirm*"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        <label className="form-check-label">Show Password</label>
      </div>

      <div className="d-flex justify-content-between">
        <Link to="/login">Sign in instead</Link>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Next"}
        </button>
      </div>
    </>
  );
};

export default SignupForm;
