import React from "react";

const Header = ({ toggleSidebar, isSidebarOpen }) => (
  <header
    className="navbar navbar-light bg-white border-bottom sticky-top"
    style={{ height: "64px" }}
  >
    <div className="container-fluid px-3 d-flex">
      <div className="d-flex align-items-center" style={{ width: "280px" }}>
        <button
          className="btn btn-link text-dark p-2 me-2"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <div className="d-flex align-items-center">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path fill="#FBC02D" d="M28 4H12L8 8v24l4 4h16l4-4V8z" />
            <path fill="#F57F17" d="M20 2h8l4 4v6h-2V8l-2-2h-8V2z" />
          </svg>
          {isSidebarOpen && (
            <span
              className="ms-2"
              style={{ fontSize: "22px", color: "#5f6368" }}
            >
              Keep
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow-1 mx-4 ">
        <input
          className="form-control border-0"
          placeholder="Search"
          style={{ backgroundColor: "#f1f3f4", borderRadius: "8px" }}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-link">⚙</button>
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32 }}
        >
          U
        </div>
      </div>
    </div>
  </header>
);

export default Header;
