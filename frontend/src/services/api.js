// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function stringifyErrors(errs) {
  if (!errs || typeof errs !== "object") return "";
  try {
    return Object.entries(errs)
      .map(([k, v]) => `${k}: ${(Array.isArray(v) ? v.join(", ") : v)}`)
      .join(" | ");
  } catch { return ""; }
}

async function toJsonResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const extra = stringifyErrors(data?.errors);
    const msg = data?.message || data?.error || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(extra ? `${msg} — ${extra}` : msg);
  }
  return data;
}

function buildQuizFormData(payload = {}) {
  const fd = new FormData();

  // Scalar
  if (payload.title != null) fd.append("title", String(payload.title));
  if (payload.quiz_description != null) fd.append("quiz_description", String(payload.quiz_description));
  if (payload.is_active != null) fd.append("is_active", payload.is_active ? "1" : "0");
  if (payload.cover_image_url) fd.append("cover_image_url", payload.cover_image_url);

  // File
  if (payload.cover_image instanceof File || payload.cover_image instanceof Blob) {
    fd.append("cover_image", payload.cover_image);
  }

  // Table
  (payload.module_ids ?? []).forEach(v => fd.append("module_ids[]", String(v)));
  (payload.tag_ids ?? []).forEach(v => fd.append("tag_ids[]", String(v)));
  (payload.new_tags ?? []).forEach(v => fd.append("new_tags[]", String(v)));

  // Questions in JSON string (expected by QuizController@store)
  if (Array.isArray(payload.questions)) {
    fd.append("questions", JSON.stringify(payload.questions));
  }

  return fd;
}

// QUIZZES

export async function getQuizzes() {
  const res = await fetch(`${API_URL}/api/quizzes`, {
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  return toJsonResponse(res);
}

export async function getQuiz(id) {
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  return toJsonResponse(res);
}

export async function createQuiz(payload) {
  const body = buildQuizFormData(payload);
  const res = await fetch(`${API_URL}/api/quizzes`, {
    method: "POST",
    credentials: "omit",
    body,
  });
  return toJsonResponse(res);
}

export async function updateQuiz(id, payload) {
  const body = buildQuizFormData(payload);
  // Important: Method override for Laravel when multipart
  body.append("_method", "PUT");
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
    method: "POST",
    credentials: "omit",
    body,
  });
  return toJsonResponse(res);
}

export async function deleteQuiz(id) {
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
    method: "DELETE",
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  return toJsonResponse(res);
}

// MODULES / TAGS

export async function getModules() {
  const res = await fetch(`${API_URL}/api/modules`, {
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  return toJsonResponse(res);
}

export async function getTags() {
  const res = await fetch(`${API_URL}/api/tags`, {
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  return toJsonResponse(res);
}
