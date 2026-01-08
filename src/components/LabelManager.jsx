import React, { useState, useEffect } from "react";
import {
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
} from "../services/labelService";

const LabelManager = ({ onClose }) => {
  const [labels, setLabels] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelName, setEditingLabelName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const response = await getAllLabels();
      setLabels(response.labels || []);
    } catch (error) {
      console.error("Failed to load labels:", error);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      setError("Label name cannot be empty");
      return;
    }

    try {
      setError("");
      await createLabel(newLabelName);
      setNewLabelName("");
      await loadLabels();
    } catch (error) {
      setError(error.message || "Failed to create label");
    }
  };

  const handleUpdateLabel = async (labelId) => {
    if (!editingLabelName.trim()) {
      setError("Label name cannot be empty");
      return;
    }

    try {
      setError("");
      await updateLabel(labelId, editingLabelName);
      setEditingLabelId(null);
      setEditingLabelName("");
      await loadLabels();
    } catch (error) {
      setError(error.message || "Failed to update label");
    }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      setError("");
      await deleteLabel(labelId);
      await loadLabels();
    } catch (error) {
      setError(error.message || "Failed to delete label");
    }
  };

  const startEditing = (label) => {
    setEditingLabelId(label._id);
    setEditingLabelName(label.name);
    setError("");
  };

  const cancelEditing = () => {
    setEditingLabelId(null);
    setEditingLabelName("");
    setError("");
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "90%", maxWidth: "400px", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Edit labels</h5>
            <button
              className="btn btn-link text-dark p-0"
              onClick={onClose}
              style={{ fontSize: "24px" }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {/* Create new label */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-plus-lg"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Create new label"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateLabel();
                  }
                }}
              />
              {newLabelName && (
                <button
                  className="btn btn-link text-dark"
                  onClick={handleCreateLabel}
                >
                  <i className="bi bi-check2"></i>
                </button>
              )}
            </div>
          </div>

          {/* List of labels */}
          <div>
            {labels.map((label) => (
              <div key={label._id} className="mb-2">
                {editingLabelId === label._id ? (
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-tag"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      value={editingLabelName}
                      onChange={(e) => setEditingLabelName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateLabel(label._id);
                        } else if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="btn btn-link text-dark"
                      onClick={() => handleUpdateLabel(label._id)}
                    >
                      <i className="bi bi-check2"></i>
                    </button>
                    <button
                      className="btn btn-link text-dark"
                      onClick={cancelEditing}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <div className="d-flex align-items-center">
                      <i
                        className="bi bi-tag me-3"
                        style={{ fontSize: "18px" }}
                      ></i>
                      <span>{label.name}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-link text-dark p-1"
                        onClick={() => startEditing(label)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-link text-dark p-1"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete label "${label.name}"? This will remove it from all notes.`
                            )
                          ) {
                            handleDeleteLabel(label._id);
                          }
                        }}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          .hover-bg:hover {
            background-color: rgba(95, 99, 104, 0.04);
          }
        `}
      </style>
    </div>
  );
};

export default LabelManager;
