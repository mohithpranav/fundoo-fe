import React, { useState, useEffect } from "react";
import { getAllLabels } from "../services/labelService";

const NoteInput = ({ onAddNote, currentLabelId = null, labels = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);

  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    // Auto-select the current label when viewing a label
    if (currentLabelId && labels.length > 0 && !isExpanded) {
      const currentLabel = labels.find((l) => l._id === currentLabelId);
      if (
        currentLabel &&
        !selectedLabels.some((l) => l._id === currentLabelId)
      ) {
        setSelectedLabels([currentLabel]);
      }
    }
  }, [currentLabelId, labels, isExpanded]);

  const loadLabels = async () => {
    try {
      const response = await getAllLabels();
      setAvailableLabels(response.labels || []);
    } catch (error) {
      console.error("Failed to load labels:", error);
    }
  };

  const handleClose = () => {
    if (title.trim() || content.trim()) {
      const labels = selectedLabels.map((label) => label.name);
      onAddNote({ title, content, labels });
    }
    setTitle("");
    setContent("");
    // Don't clear selected labels if on a label view - will be reset by useEffect
    if (!currentLabelId) {
      setSelectedLabels([]);
    }
    setIsExpanded(false);
  };

  const toggleLabel = (label) => {
    setSelectedLabels((prev) => {
      const isSelected = prev.some((l) => l._id === label._id);
      if (isSelected) {
        return prev.filter((l) => l._id !== label._id);
      } else {
        return [...prev, label];
      }
    });
  };

  const removeLabel = (labelId) => {
    setSelectedLabels((prev) => prev.filter((l) => l._id !== labelId));
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".note-input-card") === null && isExpanded) {
      handleClose();
    }
    if (e.target.closest(".label-menu") === null && showLabelMenu) {
      setShowLabelMenu(false);
    }
  };

  useEffect(() => {
    if (isExpanded || showLabelMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isExpanded, showLabelMenu, title, content]);

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
                  <i className="bi bi-check2-square"></i>
                </button>
                <button
                  className="btn btn-link text-dark p-1"
                  style={{ fontSize: "18px" }}
                >
                  <i className="bi bi-brush"></i>
                </button>
                <button
                  className="btn btn-link text-dark p-1"
                  style={{ fontSize: "18px" }}
                >
                  <i className="bi bi-image"></i>
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
              {/* Display selected labels */}
              {selectedLabels.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedLabels.map((label) => (
                    <span
                      key={label._id}
                      className="badge bg-light text-dark d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                    >
                      <i className="bi bi-tag-fill"></i>
                      {label.name}
                      <i
                        className="bi bi-x"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLabel(label._id);
                        }}
                      ></i>
                    </span>
                  ))}
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center position-relative">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    <i className="bi bi-bell"></i>
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    <i className="bi bi-person-plus"></i>
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    <i className="bi bi-palette"></i>
                  </button>
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    <i className="bi bi-image"></i>
                  </button>
                  <button
                    className="btn btn-link text-dark p-1 position-relative"
                    style={{ fontSize: "18px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLabelMenu(!showLabelMenu);
                    }}
                  >
                    <i className="bi bi-tag"></i>
                  </button>
                  {showLabelMenu && (
                    <div
                      className="label-menu card position-absolute shadow-lg"
                      style={{
                        top: "100%",
                        left: "0",
                        zIndex: 1000,
                        width: "200px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="card-body p-2">
                        <div
                          className="fw-bold mb-2"
                          style={{ fontSize: "12px" }}
                        >
                          Label note
                        </div>
                        {availableLabels.length === 0 ? (
                          <div
                            className="text-muted text-center p-2"
                            style={{ fontSize: "12px" }}
                          >
                            No labels yet
                          </div>
                        ) : (
                          availableLabels.map((label) => (
                            <div
                              key={label._id}
                              className="form-check"
                              onClick={() => toggleLabel(label)}
                              style={{ cursor: "pointer" }}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedLabels.some(
                                  (l) => l._id === label._id
                                )}
                                onChange={() => {}}
                              />
                              <label
                                className="form-check-label"
                                style={{ fontSize: "14px", cursor: "pointer" }}
                              >
                                {label.name}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-link text-dark p-1"
                    style={{ fontSize: "18px" }}
                  >
                    <i className="bi bi-three-dots-vertical"></i>
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
