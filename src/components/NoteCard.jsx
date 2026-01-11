import React, { useState, useEffect } from "react";
import {
  getAllLabels,
  createLabel as createLabelAPI,
} from "../services/labelService";

const NoteCard = ({
  note,
  onDelete,
  onUpdate,
  onTrash,
  onArchive,
  onAddCollaborator,
  isTrashView,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedContent, setEditedContent] = useState(note.content || "");
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [labelSearchTerm, setLabelSearchTerm] = useState("");

  const loadLabels = async () => {
    try {
      const response = await getAllLabels();
      setAvailableLabels(response.labels || []);
      return response.labels || [];
    } catch (error) {
      console.error("Failed to load labels:", error);
      return [];
    }
  };

  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    const initializeLabels = () => {
      if (!note.labels || note.labels.length === 0) {
        setSelectedLabels([]);
        return;
      }

      // Check if labels are populated (have name property) or just IDs
      const firstLabel = note.labels[0];
      const areLabelsPopulated =
        typeof firstLabel === "object" && firstLabel.name;

      if (areLabelsPopulated) {
        // Labels are already populated with name - use them directly
        setSelectedLabels(note.labels);
      } else {
        // Labels are just IDs - try to populate from availableLabels
        if (availableLabels.length > 0) {
          const populatedLabels = note.labels
            .map((labelId) => {
              const id = typeof labelId === "string" ? labelId : labelId._id;
              return availableLabels.find((l) => l._id === id);
            })
            .filter(Boolean);
          setSelectedLabels(populatedLabels);
        }
      }
    };

    initializeLabels();
  }, [note.labels, availableLabels]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".card") && showLabelMenu) {
        setShowLabelMenu(false);
        setLabelSearchTerm("");
      }
    };

    if (showLabelMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLabelMenu]);

  const handleSave = () => {
    if (editedTitle.trim() || editedContent.trim()) {
      const labels = selectedLabels.map((label) => label.name || label._id);
      onUpdate(note._id, {
        title: editedTitle,
        content: editedContent,
        labels,
      });
      setIsEditing(false);
    }
  };

  const toggleLabel = (label) => {
    // Check if label already exists to prevent duplicates
    const isAlreadySelected = selectedLabels.some((l) => l._id === label._id);

    const newSelectedLabels = isAlreadySelected
      ? selectedLabels.filter((l) => l._id !== label._id)
      : [...selectedLabels, label];

    setSelectedLabels(newSelectedLabels);

    // Auto-save label changes when not editing
    if (!isEditing) {
      const labels = newSelectedLabels.map((l) => l.name || l._id);
      onUpdate(note._id, { labels });
    }
  };

  const removeLabel = (labelId) => {
    const newSelectedLabels = selectedLabels.filter((l) => l._id !== labelId);
    setSelectedLabels(newSelectedLabels);

    // Auto-save label changes when not editing
    if (!isEditing) {
      const labels = newSelectedLabels.map((l) => l.name || l._id);
      onUpdate(note._id, { labels });
    }
  };

  const handleCancel = () => {
    setEditedTitle(note.title || "");
    setEditedContent(note.content || "");
    // Reset to note's labels (they should already be in selectedLabels from useEffect)
    if (note.labels && note.labels.length > 0) {
      const firstLabel = note.labels[0];
      if (typeof firstLabel === "object" && firstLabel.name) {
        setSelectedLabels(note.labels);
      }
    } else {
      setSelectedLabels([]);
    }
    setIsEditing(false);
  };

  const handleAddCollaborator = () => {
    if (collaboratorEmail.trim()) {
      onAddCollaborator(note._id, collaboratorEmail);
      setCollaboratorEmail("");
      setShowCollaboratorModal(false);
    }
  };

  const handleCreateNewLabel = async () => {
    if (!labelSearchTerm.trim()) return;

    try {
      await createLabelAPI(labelSearchTerm);
      await loadLabels();
      setLabelSearchTerm("");
      // Find and toggle the newly created label
      const response = await getAllLabels();
      const newLabel = response.labels.find(
        (l) => l.name.toLowerCase() === labelSearchTerm.trim().toLowerCase()
      );
      if (newLabel) {
        toggleLabel(newLabel);
      }
    } catch (error) {
      console.error("Failed to create label:", error);
    }
  };

  const filteredLabels = availableLabels.filter((label) =>
    label.name.toLowerCase().includes(labelSearchTerm.toLowerCase())
  );

  const showCreateOption =
    labelSearchTerm.trim() &&
    !filteredLabels.some(
      (label) =>
        label.name.toLowerCase() === labelSearchTerm.trim().toLowerCase()
    );

  if (isEditing) {
    return (
      <div
        className="card shadow-sm h-100"
        style={{ borderRadius: "8px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body p-3">
          <input
            type="text"
            className="form-control border-0 mb-2"
            placeholder="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "none",
              padding: "0",
            }}
            autoFocus
          />
          <textarea
            className="form-control border-0"
            placeholder="Take a note..."
            rows="4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              fontSize: "14px",
              boxShadow: "none",
              resize: "none",
              padding: "0",
            }}
          />
          {/* Display selected labels in edit mode */}
          {selectedLabels.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {selectedLabels.map((label) => (
                <span
                  key={label._id}
                  className="badge d-flex align-items-center gap-1"
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    color: "#202124",
                    fontWeight: "400",
                    borderRadius: "12px",
                  }}
                >
                  {label.name}
                  <i
                    className="bi bi-x"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLabel(label._id);
                    }}
                  ></i>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer bg-transparent border-0 p-2 d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm"
            onClick={handleCancel}
            style={{ color: "#202124", fontWeight: "500" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            style={{ fontWeight: "500" }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card shadow-sm h-100"
      style={{
        borderRadius: "8px",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
      }}
      onClick={() => setIsEditing(true)}
    >
      {/* Drag handle in the top-right corner */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="position-absolute"
          style={{
            top: "8px",
            right: "8px",
            cursor: "grab",
            padding: "4px",
            borderRadius: "4px",
            opacity: 0.3,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3h2v2H9zm0 4h2v2H9zm0 4h2v2H9zm0 4h2v2H9zm0 4h2v2H9zm4-16h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z" />
          </svg>
        </div>
      )}
      <div
        className="card-body p-3"
        style={{
          paddingRight: dragHandleProps ? "32px" : "12px",
          overflow: "hidden",
        }}
      >
        {note.title && (
          <h6
            className="mb-2"
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#202124",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {note.title}
          </h6>
        )}
        <p
          className="mb-0"
          style={{
            fontSize: "14px",
            color: "#202124",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {note.content}
        </p>
      </div>
      {/* Display labels */}
      {selectedLabels.length > 0 && (
        <div className="px-3 pb-2 d-flex flex-wrap gap-2">
          {selectedLabels.map((label) => (
            <span
              key={label._id}
              className="badge"
              style={{
                fontSize: "12px",
                padding: "4px 12px",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                color: "#202124",
                fontWeight: "400",
                borderRadius: "12px",
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="card-footer bg-transparent border-0 p-2 d-flex justify-content-between opacity-0 hover-show position-relative">
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "18px" }}
            onClick={(e) => e.stopPropagation()}
            title="Remind me"
          >
            <i className="bi bi-bell"></i>
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "18px" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowCollaboratorModal(true);
            }}
            title="Collaborator"
          >
            <i className="bi bi-person-plus"></i>
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "18px" }}
            onClick={(e) => e.stopPropagation()}
            title="Background options"
          >
            <i className="bi bi-palette"></i>
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "18px" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowLabelMenu(!showLabelMenu);
            }}
            title="Label note"
          >
            <i className="bi bi-tag"></i>
          </button>
          {showLabelMenu && (
            <div
              className="card position-absolute shadow-lg border"
              style={{
                top: "100%",
                left: "0",
                zIndex: 1000,
                width: "240px",
                maxHeight: "320px",
                borderRadius: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-0">
                <div
                  className="px-3 py-2 border-bottom"
                  style={{
                    fontSize: "12px",
                    color: "#5f6368",
                    fontWeight: "500",
                  }}
                >
                  Label note
                </div>
                <div className="px-2 py-2">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm border-0"
                      placeholder="Enter label name"
                      value={labelSearchTerm}
                      onChange={(e) => setLabelSearchTerm(e.target.value)}
                      style={{
                        fontSize: "14px",
                        paddingLeft: "8px",
                        paddingRight: "32px",
                        backgroundColor: "transparent",
                      }}
                    />
                    <i
                      className="bi bi-search position-absolute"
                      style={{
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "16px",
                        color: "#5f6368",
                      }}
                    ></i>
                  </div>
                </div>
                <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                  {showCreateOption && (
                    <div
                      className="px-3 py-2 d-flex align-items-center label-item"
                      onClick={handleCreateNewLabel}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className="bi bi-plus me-3"
                        style={{ fontSize: "16px" }}
                      ></i>
                      <span style={{ fontSize: "14px" }}>
                        Create "<strong>{labelSearchTerm}</strong>"
                      </span>
                    </div>
                  )}
                  {filteredLabels.length === 0 && !showCreateOption ? (
                    <div
                      className="text-muted text-center py-3"
                      style={{ fontSize: "13px" }}
                    >
                      No labels found
                    </div>
                  ) : (
                    filteredLabels.map((label) => (
                      <div
                        key={label._id}
                        className="px-3 py-2 d-flex align-items-center label-item"
                        onClick={() => toggleLabel(label)}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          className="form-check-input me-3"
                          type="checkbox"
                          checked={selectedLabels.some(
                            (l) => l._id === label._id
                          )}
                          onChange={() => {}}
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label m-0"
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                            flex: 1,
                          }}
                        >
                          {label.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "18px" }}
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note._id);
            }}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <i
              className={`bi ${
                note.isArchived ? "bi-box-arrow-up" : "bi-archive"
              }`}
            ></i>
          </button>
          {!isTrashView ? (
            <button
              className="btn btn-sm btn-link text-dark p-1"
              style={{ fontSize: "18px" }}
              onClick={(e) => {
                e.stopPropagation();
                onTrash(note._id);
              }}
              title="Delete"
            >
              <i className="bi bi-trash3"></i>
            </button>
          ) : (
            <>
              <button
                className="btn btn-sm btn-link text-dark p-1"
                style={{ fontSize: "18px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTrash(note._id);
                }}
                title="Restore"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
              <button
                className="btn btn-sm btn-link text-dark p-1"
                style={{ fontSize: "18px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Permanently delete this note?")) {
                    onDelete(note._id);
                  }
                }}
                title="Delete forever"
              >
                <i className="bi bi-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {showCollaboratorModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowCollaboratorModal(false);
          }}
        >
          <div
            className="card p-4"
            style={{ maxWidth: "400px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Add Collaborator</h5>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter email address"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              autoFocus
            />
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCollaboratorModal(false);
                  setCollaboratorEmail("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCollaborator();
                }}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .hover-bg:hover {
            background-color: rgba(95, 99, 104, 0.04);
          }
          .label-item:hover {
            background-color: rgba(95, 99, 104, 0.08);
          }
        `}
      </style>
    </div>
  );
};

export default NoteCard;
