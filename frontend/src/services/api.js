const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const USE_CREDENTIALS = false; 

async function getJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: USE_CREDENTIALS ? "include" : "omit",
    headers: { Accept: "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
  } catch {
    throw new Error(`Réponse non-JSON (${res.status}): ${text.slice(0,200)}...`);
  }
}


export async function getUsers() {
  return getJson(`${API_URL}/api/users`);
}

export async function getQuizzes() {
  return getJson(`${API_URL}/api/quizzes`);
}

export async function getQuiz(id) {
    const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
      credentials: "omit",
      headers: { Accept: "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
    return data;
}

export async function createQuiz({
    title,
    quiz_description,
    is_active,
    cover_image_file,
    cover_image_url,
    questions,
    module_ids = [],
    tag_ids = [],
    new_tags = [],
}) {
  const API = `${API_URL}/api/quizzes`;

  const throwApiError = async (res) => {
    let msg = "Erreur API createQuiz";
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  };

  if (cover_image_file instanceof File) {
    const fd = new FormData();
        fd.append("title", title);
        fd.append("quiz_description", quiz_description ?? "");
        fd.append("is_active", is_active ? "1" : "0");
        fd.append("cover_image", cover_image_file);
        if (cover_image_url) fd.append("cover_image_url", cover_image_url);

        module_ids.forEach((id) => fd.append("module_ids[]", String(id)));
        tag_ids.forEach((id) => fd.append("tag_ids[]", String(id)));
        new_tags.forEach((name) => fd.append("new_tags[]", name));

        fd.append("questions", JSON.stringify(questions || []));

    const res = await fetch(API, {
      method: "POST",
      credentials: USE_CREDENTIALS ? "include" : "omit",
      headers: { Accept: "application/json" },
      body: fd,
    });
    if (!res.ok) return throwApiError(res);
    return res.json();
  }

  const payload = {
      title,
      quiz_description: quiz_description ?? "",
      is_active: !!is_active,
      cover_image_url: cover_image_url || null,
      questions: questions || [],
      module_ids,
      tag_ids,
      new_tags,
  };

  const res = await fetch(API, {
      method: "POST",
      credentials: USE_CREDENTIALS ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return throwApiError(res);
    return res.json();
}

export async function updateQuiz(id, payload) {
    const hasFile = !!payload.cover_image_file;
    const body = hasFile ? new FormData() : JSON.stringify(payload);

    if (hasFile) {
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (Array.isArray(v)) body.append(k, JSON.stringify(v));
        else body.append(k, v);
      });
    }

  const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
      method: "PUT", // ou PATCH selon ton backend
      credentials: "omit",
      headers: hasFile
        ? { Accept: "application/json" }
        : { "Content-Type": "application/json", Accept: "application/json" },
      body,
    });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

export async function deleteQuiz(id) {
    const res = await fetch(`${API_URL}/api/quizzes/${id}`, {
      method: "DELETE",
      credentials: "omit",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      let data = {};
      try { data = await res.json(); } catch {}
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
    return true;
}