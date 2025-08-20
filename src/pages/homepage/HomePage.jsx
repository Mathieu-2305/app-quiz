import React from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import QuizCard from "../../components/QuizCard";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/buttons/LanguageSwitcher";
import QuizCard2 from "../../components/QuizCard2";

export default function HomePage() {
	const navigate = useNavigate();
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
			tags: ["react", "frontend", "hooks"],
			imgURL: "https://wallpapercave.com/wp/wp4923981.jpg",
			date: "2025-02-01",
			modified: "2025-02-05",
		},
	];


	return (
		// Header
		<Main>
			<Header>
				<Title>
					<FlaskConical size={24} /> {t("pages.home.title")}
				</Title>
				<Controls>
					<LanguageSwitcher />
					<NewQuizButton onClick={() => navigate("/quiz/new")}>
						<Plus size={16} /> {t("buttons.newQuiz")}
					</NewQuizButton>
				</Controls>
			</Header>
			<Content>
				<QuizCard title={"Card"} tags={["tag1", "tag2"]} date={"2025-08-18 14:26:50"} modified={false} imgURL={"https://avatars.githubusercontent.com/u/190352311?v=4"}/>
			</Content>
			<QuizGrid>
				{quizItems.map((item, index) => (
					<QuizCard2 key={index} {...item} />
				))}
			</QuizGrid>
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

const Header = styled.header`
    height: 64px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background-color: var(--color-background);
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Controls = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 12px;
`;

const NewQuizButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #2563eb;
    color: white;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
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
