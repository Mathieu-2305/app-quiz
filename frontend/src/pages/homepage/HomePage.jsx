import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import QuizCard from "../../components/QuizCard";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Header from "../../components/layout/Header";
import Button from "../../components/ui/Button";
import { getQuizzes, deleteQuiz } from "../../services/api";
import FaviconTitle from "../../components/layout/Icon.jsx";
import faviconUrl from "../../assets/images/favicon.ico?url";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getQuizzes();
        if (!alive) return;
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Open the editor
  const handleEdit = (id) => {
    navigate(`/quizzes/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const confirmText = t("quiz.confirmDelete");
    if (!window.confirm(confirmText)) return;
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      alert(e.message || "Erreur lors de la suppression");
    }
  };

  const cards = useMemo(() => {
    const fallbackImg =
      "https://img.freepik.com/free-vector/gradient-ui-ux-background-illustrated_23-2149050187.jpg?semt=ais_hybrid&w=740&q=80";
    return (quizzes || []).map((q) => ({
      id: q.id,
      title: q.title ?? "Untitled",
      modules: Array.isArray(q.modules) ? q.modules.map((m) => m.module_name).slice(0, 3) : [],
      tags: Array.isArray(q.tags) ? q.tags.map((t) => t.tag_name).slice(0, 3) : [],
      imgURL: q.cover_image_url || fallbackImg,
      date: q.created_at?.slice(0, 10) ?? "",
      modified: q.updated_at?.slice(0, 10) ?? "",
      isActive: !!q.is_active,
      onClick: () => q.is_active && navigate(`/quizzes/${q.id}`),
      onEdit: handleEdit,
      onDelete: handleDelete,
    }));
  }, [quizzes, navigate]);

	return (
   	<>
    	<FaviconTitle title={t("pages.homePage")} iconHref={faviconUrl} />
			<Main>
			<Header
				title={t("pages.home.title")}
				icon={<FlaskConical size={20} aria-hidden="true" />}
				actions={[
				<LanguageSelector key="lang" />,
				<NewQuizButton
					key="new"
					onClick={() => navigate("/quizzes/new")}
					aria-label={t("actions.newQuiz")}
					title={t("actions.newQuiz")}
				>
					<Plus size={16} aria-hidden="true" />
					{t("actions.newQuiz")}
				</NewQuizButton>,
				]}
			/>

			<Content>
				{loading && <p>{t("common.loading")}</p>}
				{err && <pre style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{err}</pre>}

				{!loading && !err && (
				<QuizGrid>
					{cards.length === 0 ? (
					<p>{t("quiz.empty")}</p>
					) : (
					cards.map((item) => <QuizCard key={item.id} {...item} />)
					)}
				</QuizGrid>
				)}
			</Content>
			</Main>
    </>
  );
}

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-background);
`;

const NewQuizButton = styled(Button)`
  background-color: #2563eb;
  transition: background 0.2s;

  &:hover {
    background-color: #1e40af;
  }
`;

const Content = styled.section`
  flex: 1;
  padding: 24px;
`;

const QuizGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing);
  width: 100%;
  padding: var(--spacing-l);
`;
