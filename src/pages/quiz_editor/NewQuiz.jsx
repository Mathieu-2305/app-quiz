import React, { useMemo, useRef, useState } from 'react';
import { FilePenLine, Save, Plus, Trash2 } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import UnsavedChangesGuard from "../../components/UnsavedChangesGuard";
import ToggleSwitch from "../../components/buttons/ToggleSwitchButton";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";

export default function NewQuiz() {
	// Translation
	const { t } = useTranslation();

	// Principal states
	const [isDirty, setIsDirty] = useState(false);
	const [active, setActive] = useState(true);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [questions, setQuestions] = useState([]);

	const questionRefs = useRef({});

	// Label if there's no title
	const untitled = useMemo(
		() => t("quiz.placeholders.untitled") || t("common.untitled") || "Sans titre",
		[t]
	);

	// Create a question of "single" type (the effective type will be derived from the number of correct answers)
	const makeQuestion = () => {
		const id = `q_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		const baseLabel = t("quiz.defaults.option");
		return {
			id,
			type: "single", // kept for compatibility, display type is derived from correctIndices length
			title: "",
			description: "",
			required: false,
			options: [`${baseLabel} 1`, `${baseLabel} 2`, `${baseLabel} 3`],
			correctIndices: [] // 0 or 1 -> single; >=2 -> multi
		};
	};

	// Adds a question
	const addSingleQuestion = () => {
		const q = makeQuestion();
		setQuestions(prev => [...prev, q]);
		setIsDirty(true);

		// Scrolls to the new question
		setTimeout(() => {
			questionRefs.current[q.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 0);
	};

	// Toggle correct index (handles single/multi automatically via derived type)
	const toggleCorrect = (id, idx) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const s = new Set(q.correctIndices || []);
				s.has(idx) ? s.delete(idx) : s.add(idx);
				return { ...q, correctIndices: Array.from(s).sort((a, b) => a - b) };
			})
		);
		setIsDirty(true);
	};

	// Simulates the save
	const onSave = () => {
		console.log("tkt c'est save", { active, title, description, questions });
		setIsDirty(false);
	};

	// Partial update of a question
	const updateQuestion = (id, patch) => {
		setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
		setIsDirty(true);
	};

	// Add an option
	const addOption = (id) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const base = t("quiz.defaults.option");
				const nextLen = (q.options?.length ?? 0) + 1;
				return { ...q, options: [...(q.options ?? []), `${base} ${nextLen}`] };
			})
		);
		setIsDirty(true);
	};

	// Update an option
	const updateOption = (id, idx, value) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const next = [...(q.options ?? [])];
				next[idx] = value;
				return { ...q, options: next };
			})
		);
		setIsDirty(true);
	};

	// Delete an option (and fix correct indices accordingly)
	const removeOption = (id, idx) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const newOptions = (q.options ?? []).filter((_, i) => i !== idx);
				const nextCorrect = (q.correctIndices ?? [])
					.filter(i => i !== idx)
					.map(i => (i > idx ? i - 1 : i));
				return { ...q, options: newOptions, correctIndices: nextCorrect };
			})
		);
		setIsDirty(true);
	};

	// Delete a question
	const removeQuestion = (id) => {
		setQuestions(prev => prev.filter(q => q.id !== id));
		setIsDirty(true);
	};

	// Scroll to a question from the left card
	const scrollToQuestion = (id) => {
		questionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	// Infers the display type for the badge based on selected correct answers
	const getTypeLabel = (q) =>
		(q.correctIndices?.length ?? 0) > 1 ? t("quiz.types.multi") : t("quiz.types.single");

	return (
		<Main>
			<UnsavedChangesGuard when={isDirty} />
			<Header
				title={t("quiz.title")}
				icon={<FilePenLine size={20} />}
				actions={[
					<Controls key="controls">
						<ToggleSwitch
							checked={active}
							onChange={setActive}
							onLabel={t("common.active")}
							offLabel={t("common.inactive")}
							onColor="#22c55e"
							offColor="#e5e7eb"
						/>
						<LanguageSelector />
						<SaveButton onClick={onSave}>
							<Save size={16} />{t("actions.saveChanges")}
						</SaveButton>
					</Controls>
				]}
			/>
			<Body>
				<LeftPanel>
					<LeftTitle>{t("quiz.sections.questions")}</LeftTitle>

					<AddQuestionButton type="button" onClick={addSingleQuestion}>
						<Plus size={16} /> {t("actions.addQuestion") || "Ajouter une question"}
					</AddQuestionButton>

					<LeftList>
						{questions.map((q, idx) => (
							<LeftCard
								key={q.id}
								onClick={() => scrollToQuestion(q.id)}
								title={t("quiz.hints.goToQuestion") || "Aller à la question"}
							>
								<LeftCardIndex>{idx + 1}</LeftCardIndex>
								<LeftCardTitle>{q.title?.trim() ? q.title : untitled}</LeftCardTitle>
							</LeftCard>
						))}
					</LeftList>
				</LeftPanel>

				<CenterPanel>
					<EditorHeader>
						<EditorTitle
							value={title}
							onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
							placeholder={t("quiz.placeholders.title")}
							aria-label={t("quiz.placeholders.title")}
						/>
					</EditorHeader>

					<Field>
						<FieldLabel>{t("quiz.fields.description")}</FieldLabel>
						<TextArea
							value={description}
							onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
							placeholder={t("common.placeholders.typeHere")}
							rows={3}
						/>
					</Field>

					{questions.length === 0 ? (
						<DropPlaceholder>
							{t("quiz.hints.emptyDrop") || "Ajoutez votre première question avec le bouton à gauche."}
						</DropPlaceholder>
					) : (
						<QuestionList>
							{questions.map((q) => (
								<QuestionCard key={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
									<QuestionHeader>
										<Badge>{getTypeLabel(q)}</Badge>
										<DeleteBtn
											onClick={() => removeQuestion(q.id)}
											title={t("actions.delete")}
											aria-label={t("actions.delete")}
										>
											<Trash2 size={16} />
										</DeleteBtn>
									</QuestionHeader>

									<Field>
										<FieldLabel>{t("quiz.fields.title")}</FieldLabel>
										<Input
											value={q.title}
											onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
											placeholder={t("common.placeholders.typeHere")}
										/>
									</Field>

									<Field>
										<FieldLabel>{t("quiz.fields.description")}</FieldLabel>
										<TextArea
											value={q.description}
											onChange={(e) => updateQuestion(q.id, { description: e.target.value })}
											placeholder={t("common.placeholders.typeHere")}
											rows={3}
										/>
									</Field>

									<Divider />
									<OptionsHeader>{t("quiz.sections.options")}</OptionsHeader>

									{(q.options || []).map((opt, idx) => (
										<OptionRow key={idx}>
											<FakeCheck
												type="checkbox"
												checked={(q.correctIndices ?? []).includes(idx)}
												onChange={() => toggleCorrect(q.id, idx)}
												aria-label={`${t("quiz.sections.options")} #${idx + 1}`}
											/>

											<OptionInput
												value={opt}
												onChange={(e) => updateOption(q.id, idx, e.target.value)}
											/>

											<RemoveOpt
												onClick={() => removeOption(q.id, idx)}
												title={t("actions.delete")}
												aria-label={t("actions.delete")}
											>
												<Trash2 size={16} />
											</RemoveOpt>
										</OptionRow>
									))}

									<AddOption type="button" onClick={() => addOption(q.id)}>
										<Plus size={16} /> {t("quiz.options.new")}
									</AddOption>
								</QuestionCard>
							))}
						</QuestionList>
					)}
				</CenterPanel>
			</Body>
		</Main>
	);
}

const Main = styled.main`
	flex:1;
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: var(--color-background);
`;

const Controls = styled.div`
	display:inline-flex;
	align-items:center;
	gap:12px;
`;

const SaveButton = styled(Button)`
	background-color:var(--color-success-bg);
	&:hover{
		background-color:#134e4a;
	}
`;

const Body = styled.div`
	display:grid;
	grid-template-columns:280px 1fr;
	gap:16px;
	height:calc(100vh - 64px);
	padding:16px 16px 24px 16px;
	background-color:var(--color-background);
`;

const LeftPanel = styled.aside`
	border-right:1px solid #e5e7eb;
	padding-right:16px;
	display:flex;
	flex-direction:column;
	gap:12px;
	background-color:var(--color-background);
	color:var(--color-text);
	overflow:auto;
`;

const LeftTitle = styled.h2`
	font-size:14px;
	font-weight:700;
	margin:0;
`;

const AddQuestionButton = styled(Button)`
	display:inline-flex;
	align-items:center;
	gap:8px;
	background-color:#2563eb;
	border:1px solid #e5e7eb;
	border-radius:10px;
	padding:10px 12px;
	cursor:pointer;
	color:#fff;
	font-weight:600;
	&:hover{
		background-color:#1e40af;
	}
`;

const LeftList = styled.div`
	display:flex;
	flex-direction:column;
	gap:8px;
`;

const LeftCard = styled(Button)`
	display:grid;
	grid-template-columns:28px 1fr;
	align-items:center;
	gap:8px;
	border:1px solid #e5e7eb;
	border-radius:10px;
	background-color:var(--color-background-elevated);
	color:var(--color-text);
	padding:8px 10px;
	cursor:pointer;
	text-align:left;
	&:hover{
		filter:brightness(0.98);
	}
`;

const LeftCardIndex = styled.span`
	display:inline-grid;
	place-items:center;
	width:24px;
	height:24px;
	font-size:12px;
	border-radius:999px;
	border:1px solid #c7d2fe;
	background:var(--color-background);
`;

const LeftCardTitle = styled.span`
	font-size:14px;
	overflow:hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
`;

const CenterPanel = styled.section`
	padding-left:8px;
	overflow:auto;
	min-height:100%;
	border-radius:12px;
	background-color:var(--color-background);
`;

const EditorHeader = styled.div`
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:10px;
	margin-bottom:12px;
`;

const EditorTitle = styled.input`
	flex:1;
	height:40px;
	border:1px solid #e5e7eb;
	border-radius:8px;
	padding:0 12px;
	font-size:16px;
	background-color:var(--color-background-elevated);
	color:var(--color-text);
`;

const Field = styled.div`
	display:grid;
	gap:6px;
	margin-bottom:10px;
`;

const FieldLabel = styled.label`
	font-size:12px;
	color:var(--color-text);
`;

const Input = styled.input`
	height:38px;
	border:1px solid #e5e7eb;
	border-radius:8px;
	padding:0 10px;
	background-color:var(--color-background-elevated);
	color:var(--color-text);
`;

const TextArea = styled.textarea`
	border:1px solid #e5e7eb;
	border-radius:8px;
	padding:8px 10px;
	resize:vertical;
	background-color:var(--color-background-elevated);
	color:var(--color-text);
`;

const DropPlaceholder = styled.div`
	height:160px;
	border:2px dashed #cbd5e1;
	border-radius:12px;
	display:grid;
	place-items:center;
	color:#64748b;
	background-color:var(--color-background-elevated);
`;

const QuestionList = styled.div`
	display:flex;
	flex-direction:column;
	gap:12px;
`;

const QuestionCard = styled.div`
	border:1px solid #e5e7eb;
	border-radius:12px;
	background-color:var(--color-background-elevated);
	padding:12px;
`;

const QuestionHeader = styled.div`
	display:flex;
	align-items:center;
	justify-content:space-between;
	margin-bottom:10px;
`;

const Badge = styled.span`
	font-size:12px;
	border:1px solid #c7d2fe;
	border-radius:999px;
	padding:3px 8px;
	font-weight:600;
	background-color:var(--color-background);
	color:var(--color-text);
`;

const DeleteBtn = styled.button`
	border:none;
	background:transparent;
	color:#6b7280;
	cursor:pointer;
	&:hover{
		color:#ef4444;
	}
`;

const OptionsHeader = styled.div`
	font-size:14px;
	font-weight:600;
	margin-bottom:8px;
	color:var(--color-text);
`;

const OptionRow = styled.div`
	display:grid;
	grid-template-columns:auto 1fr auto;
	align-items:center;
	gap:8px;
	padding:6px 8px;
	border:1px solid #e5e7eb;
	border-radius:8px;
	background-color:var(--color-background-elevated);
	margin-bottom:8px;
`;

const FakeCheck = styled.input``;

const OptionInput = styled.input`
	height:34px;
	border:none;
	background:transparent;
	outline:none;
	color:var(--color-text);
`;

const RemoveOpt = styled.button`
	border:none;
	background:transparent;
	color:#6b7280;
	cursor:pointer;
	&:hover{
		color:#ef4444;
	}
`;

const AddOption = styled.button`
	display:inline-flex;
	align-items:center;
	gap:6px;
	background-color:#2563eb;
	border:1px solid #e5e7eb;
	border-radius:8px;
	padding:8px 10px;
	cursor:pointer;
	font-weight:500;
	color:#fff;
	&:hover{
		background-color:#1e40af;
	}
`;

const Divider = styled.hr`
	margin:10px 0;
	border:none;
	border-top:1px solid #e5e7eb;
`;
