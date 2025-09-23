// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function toJsonResponse(res) {
  return res.text().then((t) => {
    let data = {};
    try { data = t ? JSON.parse(t) : {}; } catch {}
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  });
}

function hasFileInPayload(obj) {
  if (!obj || typeof obj !== "object") return false;
  return Object.values(obj).some((v) => v instanceof File || v instanceof Blob);
}

function buildBodyAndHeaders(payload) {
  const useMultipart = hasFileInPayload(payload) || payload?.cover_image instanceof File;
  if (!useMultipart) {
    return {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    };
  }

  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined || v === null) continue;

    if (k === "module_ids" || k === "tag_ids" || k === "new_tags") {
      if (Array.isArray(v)) {
        v.forEach((item) => fd.append(`${k}[]`, item));
      }
      continue;
    }

    if (k === "questions") {
      fd.append(k, JSON.stringify(v));
      continue;
    }

    if (k === "is_active") {
      fd.append(k, v ? "1" : "0");
      continue;
    }

    fd.append(k, v);
  }
  return { body: fd, headers: { Accept: "application/json" } };
}

export async function getQuizzes() {
  const res = await fetch(`${API_URL}/api/quizzes`, { headers: { Accept: "application/json" } });
  return toJsonResponse(res);
}

export async function getQuiz(id) {
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, { headers: { Accept: "application/json" } });
  return toJsonResponse(res);
}

export async function createQuiz(payload) {
  const { body, headers } = buildBodyAndHeaders(payload);
  const res = await fetch(`${API_URL}/api/quizzes`, { method: "POST", headers, body });
  return toJsonResponse(res);
}

export async function updateQuiz(id, payload) {
  const { body, headers } = buildBodyAndHeaders(payload);
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, { method: "PUT", headers, body });
  return toJsonResponse(res);
}

export async function deleteQuiz(id) {
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}

export async function getModules() {
  const res = await fetch(`${API_URL}/api/modules`, { headers: { Accept: "application/json" } });
  return toJsonResponse(res);
}
export async function getTags() {
  const res = await fetch(`${API_URL}/api/tags`, { headers: { Accept: "application/json" } });
  return toJsonResponse(res);
}
