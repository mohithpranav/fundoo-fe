import { getCookie } from "../utils/cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = getCookie("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createLabel = async (name) => {
  const response = await fetch(`${API_BASE_URL}/labels`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create label");
  }

  return await response.json();
};

export const getAllLabels = async () => {
  const response = await fetch(`${API_BASE_URL}/labels`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch labels");
  }

  return await response.json();
};

export const updateLabel = async (labelId, name) => {
  const response = await fetch(`${API_BASE_URL}/labels/${labelId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update label");
  }

  return await response.json();
};

export const deleteLabel = async (labelId) => {
  const response = await fetch(`${API_BASE_URL}/labels/${labelId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete label");
  }

  return await response.json();
};

export const getNotesByLabel = async (labelId) => {
  const response = await fetch(`${API_BASE_URL}/notes/label/${labelId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch notes by label");
  }

  return await response.json();
};
