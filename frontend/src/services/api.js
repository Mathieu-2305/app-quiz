const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const resolvedImg = imgURL?.startsWith('/')
  ? `${API_URL}${imgURL}`
  : imgURL;

async function getJson(url, options = {}) {
    const res = await fetch(url, { headers: { Accept: "application/json" }, ...options });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { throw new Error(`Réponse non-JSON (${res.status}): ${text.slice(0,200)}...`); }
}

// Fetch the users
export async function getUsers() {
	const res = await fetch(`${API_URL}/api/users`);
	if (!res.ok) throw new Error("Erreur API getUsers");
	return await res.json();
}

// Fetch all quizzes
export async function getQuizzes() {
	const res = await fetch(`${API_URL}/api/quizzes`);
	if (!res.ok) throw new Error("Erreur API getQuizzes");
	return await res.json();
}

// Fetch a quiz with questions/answers
export async function getQuiz(id) {
	const res = await fetch(`${API_URL}/api/quizzes/${id}`);
	if (!res.ok) throw new Error("Erreur API getQuiz");
	return await res.json();
}


export async function createQuiz({
	title,
	quiz_description,
	is_active,
	cover_image_file,
	cover_image_url,
	questions,
	}) {
	if (cover_image_file instanceof File) {
		const fd = new FormData();
		fd.append("title", title);
		fd.append("quiz_description", quiz_description ?? "");
		fd.append("is_active", is_active ? "1" : "0");
		fd.append("cover_image", cover_image_file);
		fd.append("questions", JSON.stringify(questions || []));

		const res = await fetch(`${API_URL}/api/quizzes`, {
		method: "POST",
		body: fd,
		});
		if (!res.ok) throw new Error("Erreur API createQuiz");
		return res.json();
	}

	const res = await fetch(`${API_URL}/api/quizzes`, {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		},
		body: JSON.stringify({
		title,
		quiz_description: description ?? "",
		is_active: !!is_active,
		cover_image_url: cover_image_url || null,
		questions, 
		}),
	});
	if (!res.ok) throw new Error("Erreur API createQuiz");
	return res.json();
}