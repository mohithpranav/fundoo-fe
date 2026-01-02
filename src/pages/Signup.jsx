import React from "react";
import GoogleLogo from "../components/GoogleLogo";
import SignupForm from "../components/SignupForm";
import AccountIllustration from "../components/AccountIllustration";

const Signup = () => (
  <div className="container-fluid min-vh-100">
    <div className="row min-vh-100">
      <div className="col-md-7 d-flex align-items-center justify-content-center">
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <GoogleLogo />
          <h2>Create your Google Account</h2>
          <SignupForm />
        </div>
      </div>

      <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center bg-light">
        <AccountIllustration />
      </div>
    </div>
  </div>
);

export default Signup;
