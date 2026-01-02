import React, { useState } from "react";

const NoteCard = ({ note, onDelete, onUpdate, onTrash, onArchive, onAddCollaborator, isTrashView }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedContent, setEditedContent] = useState(note.content || "");
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");

  const handleSave = () => {
    if (editedTitle.trim() || editedContent.trim()) {
      onUpdate(note._id, { title: editedTitle, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(note.title || "");
    setEditedContent(note.content || "");
    setIsEditing(false);
  };

  const handleAddCollaborator = () => {
    if (collaboratorEmail.trim()) {
      onAddCollaborator(note._id, collaboratorEmail);
      setCollaboratorEmail("");
      setShowCollaboratorModal(false);
    }
  };

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
      style={{ borderRadius: "8px", cursor: "pointer" }}
      onClick={() => setIsEditing(true)}
    >
      <div className="card-body p-3">
        {note.title && (
          <h6
            className="mb-2"
            style={{ fontSize: "16px", fontWeight: "500", color: "#202124" }}
          >
            {note.title}
          </h6>
        )}
        <p
          className="mb-0"
          style={{ fontSize: "14px", color: "#202124", whiteSpace: "pre-wrap" }}
        >
          {note.content}
        </p>
      </div>
      <div className="card-footer bg-transparent border-0 p-2 d-flex justify-content-between opacity-0 hover-show">
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "16px" }}
            onClick={(e) => e.stopPropagation()}
            title="Reminders"
          >
            🔔
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "16px" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowCollaboratorModal(true);
            }}
            title="Add Collaborator"
          >
            👤
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "16px" }}
            onClick={(e) => e.stopPropagation()}
            title="Change Color"
          >
            🎨
          </button>
          <button
            className="btn btn-sm btn-link text-dark p-1"
            style={{ fontSize: "16px" }}
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note._id);
            }}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            {note.isArchived ? "📂" : "📦"}
          </button>
          {!isTrashView ? (
            <button
              className="btn btn-sm btn-link text-dark p-1"
              style={{ fontSize: "16px" }}
              onClick={(e) => {
                e.stopPropagation();
                onTrash(note._id);
              }}
              title="Move to Trash"
            >
              🗑️
            </button>
          ) : (
            <>
              <button
                className="btn btn-sm btn-link text-dark p-1"
                style={{ fontSize: "16px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTrash(note._id);
                }}
                title="Restore"
              >
                ↩️
              </button>
              <button
                className="btn btn-sm btn-link text-dark p-1"
                style={{ fontSize: "16px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Permanently delete this note?")) {
                    onDelete(note._id);
                  }
                }}
                title="Delete Forever"
              >
                ❌
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
    </div>
  );
};

export default NoteCard;
