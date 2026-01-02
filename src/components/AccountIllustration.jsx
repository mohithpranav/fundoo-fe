import React from "react";

const AccountIllustration = () => (
  <div className="text-center">
    <div
      className="d-inline-block position-relative"
      style={{ width: "200px", height: "180px" }}
    >
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="position-absolute"
        style={{ top: 0, left: "20px" }}
      >
        <path
          d="M80 10 L140 40 L140 80 Q140 120 80 150 Q20 120 20 80 L20 40 Z"
          fill="#4285F4"
          opacity="0.9"
        />
      </svg>

      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="position-absolute"
        style={{ top: "30px", left: "60px" }}
      >
        <circle cx="40" cy="28" r="16" fill="white" />
        <path d="M 15 65 Q 15 48 40 48 Q 65 48 65 65 Z" fill="white" />
      </svg>

      <div className="position-absolute bottom-0 w-100">
        <div className="d-flex justify-content-center gap-2">
          <div className="icon bg-danger" />
          <div className="icon bg-success" />
          <div className="icon bg-warning" />
          <div className="icon bg-primary rounded-circle" />
        </div>
      </div>
    </div>

    <p className="mt-3 text-muted">
      One account. All of Google working for you.
    </p>
  </div>
);

export default AccountIllustration;
