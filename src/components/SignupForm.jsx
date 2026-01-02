import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
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

      <div className="mb-3">
        <input
          className="form-control form-control-lg"
          placeholder="username*"
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
        <button className="btn btn-primary" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </>
  );
};

export default SignupForm;
