const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

// Save the user's answer
export async function submitAnswer({ id_user, id_quiz, id_questions, id_answers }) {
  const res = await fetch(`${API_URL}/api/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_user, id_quiz, id_questions, id_answers }),
  });
  if (!res.ok) throw new Error("Erreur API submitAnswer");
  return await res.json();
}

// Fetch the user's score for a quiz
export async function getUserResults(quizId, userId) {
  const res = await fetch(`${API_URL}/api/results/${quizId}?user_id=${userId}`);
  if (!res.ok) throw new Error("Erreur API getUserResults");
  return await res.json();
}
