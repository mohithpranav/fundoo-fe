import { getCookie } from "../utils/cookieUtils";

const API_BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = getCookie("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createNote = async (noteData) => {
  const response = await fetch(`${API_BASE_URL}/addNotes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create note");
  }

  return await response.json();
};

export const getNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/getNotes`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch notes");
  }

  return await response.json();
};

export const updateNote = async (noteId, noteData) => {
  const response = await fetch(`${API_BASE_URL}/updateNotes/${noteId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update note");
  }

  return await response.json();
};

export const deleteNote = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete note");
  }

  return await response.json();
};

export const archiveNote = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}/archive`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to archive note");
  }

  return await response.json();
};

export const trashNote = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}/trash`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to trash note");
  }

  return await response.json();
};

export const addCollaborator = async (noteId, email) => {
  const response = await fetch(
    `${API_BASE_URL}/notes/${noteId}/collaborators`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add collaborator");
  }

  return await response.json();
};

export const getTrashedNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes/trashed`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch trashed notes");
  }

  return await response.json();
};

export const getArchivedNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes/archived`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch archived notes");
  }

  return await response.json();
};
