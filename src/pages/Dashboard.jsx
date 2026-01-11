import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteInput from "../components/NoteInput";
import NoteCard from "../components/NoteCard";
import SortableNoteCard from "../components/SortableNoteCard";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import LabelManager from "../components/LabelManager";
import { getAllLabels, getNotesByLabel } from "../services/labelService";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
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
  searchNotes,
} from "../services/notesService";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [labels, setLabels] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadNotes();
    }
  }, [activeItem, searchQuery]);

  const loadLabels = async () => {
    try {
      const response = await getAllLabels();
      setLabels(response.labels || []);
    } catch (error) {
      console.error("Failed to load labels:", error);
    }
  };

  const loadNotes = async () => {
    try {
      setLoading(true);
      let data;
      if (activeItem === "trash") {
        data = await getTrashedNotes();
      } else if (activeItem === "archive") {
        data = await getArchivedNotes();
      } else if (activeItem.startsWith("label-")) {
        const labelId = activeItem.replace("label-", "");
        data = await getNotesByLabel(labelId);
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

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setIsSearching(false);
      loadNotes();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const results = await searchNotes(query);
      setNotes(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("Failed to search notes:", error);
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
      const response = await updateNote(noteId, noteData);
      setNotes(
        notes.map((note) => (note._id === noteId ? response.note : note))
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
        // If viewing trash and restoring, remove from trash view
        setNotes(notes.filter((note) => note._id !== noteId));
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
          note._id === noteId
            ? { ...note, isArchived: response.note.isArchived }
            : note
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
        onSearch={handleSearch}
      />
      <div className="d-flex">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={(item) => {
            setActiveItem(item);
            setSearchQuery("");
            setIsSearching(false);
          }}
          isOpen={isSidebarOpen}
          labels={labels}
          onEditLabels={() => setShowLabelManager(true)}
        />
        <main className="flex-grow-1 p-4">
          {(activeItem === "notes" || activeItem.startsWith("label-")) &&
            !isSearching && (
              <NoteInput
                onAddNote={handleAddNote}
                currentLabelId={
                  activeItem.startsWith("label-")
                    ? activeItem.replace("label-", "")
                    : null
                }
                labels={labels}
              />
            )}
          {isSearching && searchQuery && (
            <div className="mb-3 text-muted">
              Search results for "{searchQuery}"
            </div>
          )}
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notes.length === 0 ? (
            isSearching ? (
              <div className="text-center p-5">
                <p className="text-muted">
                  No notes found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <EmptyState activeItem={activeItem} />
            )
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={notes.map((n) => n._id)}
                strategy={rectSortingStrategy}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px",
                    gridAutoRows: "min-content",
                  }}
                >
                  {notes.map((n) => (
                    <div key={n._id}>
                      <SortableNoteCard
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
              </SortableContext>
            </DndContext>
          )}
        </main>
      </div>
      <Footer />
      {showLabelManager && (
        <LabelManager
          onClose={() => {
            setShowLabelManager(false);
            loadLabels();
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
