import React, { useState, useEffect } from "react";

const NoteInput = ({ onAddNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleClose = () => {
    if (title.trim() || content.trim()) {
      onAddNote({ title, content });
    }
    setTitle("");
    setContent("");
    setIsExpanded(false);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".note-input-card") === null && isExpanded) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isExpanded, title, content]);

  return (
    <div className="mx-auto mb-4" style={{ maxWidth: "600px" }}>
      <div
        className="card shadow-sm note-input-card"
        style={{ borderRadius: "8px" }}
      >
        <div className="card-body p-3">
          {!isExpanded ? (
            <div
              className="d-flex align-items-center justify-content-between"
              onClick={() => setIsExpanded(true)}
              style={{ cursor: "text" }}
            >
              <span style={{ color: "#5f6368" }}>Take a note...</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-link text-dark p-1"
                  style={{ fontSize: "18px" }}
                >
                  ☑
                </button>
                <button
                  className="btn btn-link text-dark p-1"
                  style={{ fontSize: "18px" }}
                >
                  🖊
                </button>
                <button
                  className="btn btn-link text-dark p-1"
                  style={{ fontSize: "18px" }}
                >
                  🖼
                </button>
              </div>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                className="form-control border-0 mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  boxShadow: "none",
                  padding: "0",
                }}
                autoFocus
              />
              <textarea
                className="form-control border-0 mb-3"
                placeholder="Take a note..."
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  fontSize: "14px",
                  boxShadow: "none",
                  resize: "none",
                  padding: "0",
                }}
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    🔔
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    👤
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    🎨
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    🖼
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    ⋮
                  </button>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={handleClose}
                  style={{ color: "#202124", fontWeight: "500" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteInput;
