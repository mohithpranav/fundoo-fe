import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteInput from "../components/NoteInput";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import {
  getNotes as fetchNotes,
  getTrashedNotes,
  getArchivedNotes,
  createNote,
  updateNote,
  deleteNote,
  trashNote,
  archiveNote,
  addCollaborator,
} from "../services/notesService";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [activeItem]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      let data;
      if (activeItem === "trash") {
        data = await getTrashedNotes();
      } else if (activeItem === "archive") {
        data = await getArchivedNotes();
      } else {
        data = await fetchNotes();
      }
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      const response = await createNote(noteData);
      setNotes([response.newNote, ...notes]);
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note. Please try again.");
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      await updateNote(noteId, noteData);
      setNotes(
        notes.map((note) =>
          note._id === noteId ? { ...note, ...noteData } : note
        )
      );
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleTrashNote = async (noteId) => {
    try {
      const response = await trashNote(noteId);
      if (activeItem === "trash") {
        // If viewing trash, update the note's trashed status
        setNotes(
          notes.map((note) =>
            note._id === noteId ? { ...note, isTrashed: response.note.isTrashed } : note
          )
        );
      } else {
        // If viewing notes, remove from view when trashed
        setNotes(notes.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.error("Failed to trash note:", error);
      alert("Failed to trash note. Please try again.");
    }
  };

  const handleAddCollaborator = async (noteId, email) => {
    try {
      await addCollaborator(noteId, email);
      alert(`Collaboration invitation sent to ${email}`);
    } catch (error) {
      console.error("Failed to add collaborator:", error);
      alert(error.message || "Failed to add collaborator. Please try again.");
    }
  };

  const handleArchiveNote = async (noteId) => {
    try {
      const response = await archiveNote(noteId);
      // Update the note's archived status in the list
      setNotes(
        notes.map((note) =>
          note._id === noteId ? { ...note, isArchived: response.note.isArchived } : note
        )
      );
    } catch (error) {
      console.error("Failed to archive note:", error);
      alert("Failed to archive note. Please try again.");
    }
  };

  return (
    <>
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="d-flex">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isOpen={isSidebarOpen}
        />
        <main className="flex-grow-1 p-4">
          {activeItem === "notes" && <NoteInput onAddNote={handleAddNote} />}
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <EmptyState activeItem={activeItem} />
          ) : (
            <div className="row g-3">
              {notes.map((n) => (
                <div className="col-md-3" key={n._id}>
                  <NoteCard
                    note={n}
                    onDelete={handleDeleteNote}
                    onUpdate={handleUpdateNote}
                    onTrash={handleTrashNote}
                    onArchive={handleArchiveNote}
                    onAddCollaborator={handleAddCollaborator}
                    isTrashView={activeItem === "trash"}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
