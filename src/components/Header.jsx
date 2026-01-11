import React, { useState } from "react";

const Header = ({ toggleSidebar, isSidebarOpen, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
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

        <div style={{ width: "50%", maxWidth: "720px", marginLeft: "8px" }}>
          <form onSubmit={handleSearchSubmit}>
            <input
              className="form-control border-0"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              style={{ backgroundColor: "#f1f3f4", borderRadius: "8px" }}
            />
          </form>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* <button className="btn btn-link">⚙</button> */}
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
};

export default Header;
