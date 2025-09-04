import React from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import QuizCard from "../../components/QuizCard";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Header from "../../components/layout/Header";
import Button from "../../components/ui/Button";

export default function HomePage() {
    // Gives the navigate() function to change pages with the React Router
	const navigate = useNavigate();

    // Translation function
	const { t } = useTranslation();

	// Example array of items
	const quizItems = [
		{
			title: "Mastering UI/UX Design for Impactful Solutions",
			tags: ["UI/UX", "Not Urgent"],
			imgURL: "https://img.freepik.com/free-vector/gradient-ui-ux-background-illustrated_23-2149050187.jpg?semt=ais_hybrid&w=740&q=80",
			date: "2025-01-10",
			modified: "2025-01-15",
		},
		{
			title: "React Fundamentals",
			tags: ["react", "frontend", "hooks"],
			imgURL: "https://wallpapercave.com/wp/wp4923981.jpg",
			date: "2025-02-01",
			modified: "2025-02-05",
		},
		{
			title: "CSS Flexbox & Grid",
			tags: ["css", "layout", "frontend"],
			imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr9ng-EVLqsUcnSdm1mJXB4KeO7ViN8XwyIA&s",
			date: "2025-03-12",
			modified: "2025-03-20",
		},
		{
			title: "React Fundamentals",
			tags: ["react", "frontend", "hooks"],
			imgURL: "https://wallpapercave.com/wp/wp4923981.jpg",
			date: "2025-02-01",
			modified: "2025-02-05",
		},
		{
			title: "CSS Flexbox & Grid",
			tags: ["css", "layout", "frontend"],
			imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr9ng-EVLqsUcnSdm1mJXB4KeO7ViN8XwyIA&s",
			date: "2025-03-12",
			modified: "2025-03-20",
		},
		{
			title: "React Fundamentals",
			tags: ["react", "frontend", "hooks","react", "frontend", "hooks"],
			imgURL: "https://wallpapercave.com/wp/wp4923981.jpg",
			date: "2025-02-01",
			modified: "2025-02-05",
		},
	];


	return (
		// Header
		<Main>
			<Header
				title={t("pages.home.title")}
				icon={<FlaskConical size={20} aria-hidden="true" />}
				actions={[
					<LanguageSelector key="lang" />,
					<NewQuizButton
						key="new"
						onClick={() => navigate("/quiz/new")}
						aria-label={t("actions.newQuiz")}
						title={t("actions.newQuiz")}
					>
						<Plus size={16} aria-hidden="true" /> {t("actions.newQuiz")}
					</NewQuizButton>,
				]}
			/>
			<Content>
				<QuizGrid>
					{quizItems.map((item, index) => (
						<QuizCard key={index} {...item} />
					))}
				</QuizGrid>
			</Content>
		</Main>
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
	gap:  var(--spacing);
	width: 100%;
    padding: var(--spacing-l);
`;
