import React, { useMemo, useRef, useState } from 'react';
import { FilePenLine, Save, Plus, Trash2, Edit3 } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/buttons/LanguageSwitcher";
import UnsavedChangesGuard from "../../components/UnsavedChangesGuard";
import ToggleSwitch from "../../components/buttons/ToggleSwitchButton";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Button from "../../components/ui/Button";

export default function NewQuiz() {
  	// Translation function
	const { t } = useTranslation();

  	// Let the user know if the app detects unsaved modifications
	const [isDirty, setIsDirty] = useState(false);

  	// Quiz's status (unused for now)
	const [active, setActive] = useState(true);

  	// Quiz's title
	const [title, setTitle] = useState("");

  	// Show the description if needed
	const [showDescription, setShowDescription] = useState(false);

  	// Description content
	const [description, setDescription] = useState("");

  	// Give focus to the description field when showed
	const descRef = useRef(null);

	// Questions table
	const [questions, setQuestions] = useState([]);

  	// Questions templates list
	const QUESTION_TEMPLATES = useMemo(() => ([
		{ type: "short",  label: t("pages.newQuiz.questionTypes.short") },
		{ type: "long",   label: t("pages.newQuiz.questionTypes.long") },
		{ type: "single", label: t("pages.newQuiz.questionTypes.single") },
		{ type: "multi",  label: t("pages.newQuiz.questionTypes.multi") },
		{ type: "boolean",label: t("pages.newQuiz.questionTypes.boolean") }
	]), [t]);

  	// Create an empty question
	const makeQuestion = (type) => {
		const id = `q_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		const base = { id, type, title: "", description: "", required: false };

		if (type === "single") {
			const o = t("pages.newQuiz.defaults.option");
			return { ...base, options: [`${o} 1`, `${o} 2`, `${o} 3`], correctIndex: null };
		}
		if (type === "multi") {
			const o = t("pages.newQuiz.defaults.option");
			return { ...base, options: [`${o} 1`, `${o} 2`, `${o} 3`], correctIndices: [] };
		}
		if (type === "boolean") {
			return {
				...base,
				options: [t("pages.newQuiz.defaults.true"), t("pages.newQuiz.defaults.false")],
				correctIndex: null
			};
		}
		return base;
	};
  	// Single/boolean
	const setCorrectSingle = (id, idx) => {
		setQuestions(prev =>
			prev.map(q => (q.id === id ? { ...q, correctIndex: idx } : q))
		);
		setIsDirty(true);
	};

  	// Multiple choices
	const toggleCorrectMulti = (id, idx) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const set = new Set(q.correctIndices ?? []);
				set.has(idx) ? set.delete(idx) : set.add(idx);
				return { ...q, correctIndices: Array.from(set).sort((a, b) => a - b) };
			})
		);
		setIsDirty(true);
	};

  	//Simulate the save process
	const onSave = () => {
		console.log("tkt c'est save", { active, title, description, questions });
		setIsDirty(false);
	};

	// Visual state while the drag and drop is active and the user is above the drop zone
	const [isDragOver, setIsDragOver] = useState(false);

  	// Starts the drag and drop
	const onTemplateDragStart = (e, type) => {
		e.dataTransfer.setData("application/x-quiz-template", type);
		e.dataTransfer.effectAllowed = "copy";
	};

  	// Read the question type and generate one after the drop
	const onCanvasDrop = (e) => {
		e.preventDefault();
		const type = e.dataTransfer.getData("application/x-quiz-template");
		if (!type) return;
		setQuestions(prev => [...prev, makeQuestion(type)]);
		setIsDirty(true);
		setIsDragOver(false);
	};

	// Partially updates (merge) a question targeted by id with patch
	const updateQuestion = (id, patch) => {
		setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
		setIsDirty(true);
	};

  	// Add an option to the single/multi question template
	const addOption = (id) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;
				const base = t("pages.newQuiz.defaults.option");
				const nextLen = (q.options?.length ?? 0) + 1;
				return { ...q, options: [...(q.options ?? []), `${base} ${nextLen}`] };
			})
		);
		setIsDirty(true);
	};

  	// Update an option's text (idx)
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

  	// Supress an option and adjust things like correctIndex or correctIndices
	const removeOption = (id, idx) => {
		setQuestions(prev =>
			prev.map(q => {
				if (q.id !== id) return q;

				const newOptions = (q.options ?? []).filter((_, i) => i !== idx);

				// Corrects the correct index for single/boolean
				if (q.type === "single" || q.type === "boolean") {
					let nextCorrect = q.correctIndex;
					if (nextCorrect === idx) nextCorrect = null;
					else if (typeof nextCorrect === "number" && nextCorrect > idx) nextCorrect = nextCorrect - 1;
					return { ...q, options: newOptions, correctIndex: nextCorrect };
				}

				// Corrects the multi indexes
				if (q.type === "multi") {
					const next = (q.correctIndices ?? [])
						.filter(i => i !== idx)
						.map(i => (i > idx ? i - 1 : i));
					return { ...q, options: newOptions, correctIndices: next };
				}

				return { ...q, options: newOptions };
			})
		);
		setIsDirty(true);
	};

  	// Remove a whole question
	const removeQuestion = (id) => {
		setQuestions(prev => prev.filter(q => q.id !== id));
		setIsDirty(true);
	};

	// Show or not the description and marks the page as modified then give the focus to descRef
	const toggleDesc = () => {
		setShowDescription(s => !s);
		setIsDirty(true);
		setTimeout(() => descRef.current?.focus(), 0);
	};

	return (
		<Main>
			<UnsavedChangesGuard when={isDirty} />

			<Header>
				<Title>
					<FilePenLine size={24} /> {t("pages.newQuiz.title")}
				</Title>
				<Controls>
					<ToggleSwitch
						checked={active}
						onChange={setActive}
						onLabel={t("buttons.toggleswitchon")}
						offLabel={t("buttons.toggleswitchoff")}
						onColor="#22c55e"
						offColor="#e5e7eb"
					/>
					<LanguageSwitcher />
					<LanguageSelector />
					<SaveButton onClick={onSave}>
						<Save size={16} />{t("buttons.saveQuiz")}
					</SaveButton>
				</Controls>
			</Header>

			<Body>
				<LeftPanel>
					<LeftTitle>{t("pages.newQuiz.categoriesTitle")}</LeftTitle>
					<TemplateList>
						{QUESTION_TEMPLATES.map((tpl) => (
							<TemplateCard
								key={tpl.type}
								draggable
								onDragStart={(e) => onTemplateDragStart(e, tpl.type)}
								title={t("pages.newQuiz.dragHint")}
							>
								<TemplateBadge>{t(`pages.newQuiz.questionTypes.${tpl.type}`)}</TemplateBadge>
								<TemplateLabel>{tpl.label}</TemplateLabel>
							</TemplateCard>
						))}
					</TemplateList>
				</LeftPanel>

				<CenterPanel
					onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
					onDragLeave={() => setIsDragOver(false)}
					onDrop={onCanvasDrop}
					$over={isDragOver}
				>
					<EditorHeader>
						<EditorTitle
							value={title}
							onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
							placeholder={t("pages.newQuiz.titleplaceholder")}
						/>
						<SmallAction type="button" onClick={toggleDesc}>
							<Edit3 size={16} /> <span>{t("pages.newQuiz.addDescription")}</span>
						</SmallAction>
					</EditorHeader>

					{showDescription && (
						<Field>
							<FieldLabel>{t("pages.newQuiz.field.labelDescription")}</FieldLabel>
							<TextArea
								ref={descRef}
								value={description}
								onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
								placeholder={t("pages.newQuiz.placeholders.typeHere")}
								rows={3}
							/>
						</Field>
					)}

					{questions.length === 0 ? (
						<DropPlaceholder>
							{t("pages.newQuiz.emptyDropHint")}
						</DropPlaceholder>
					) : (
						<QuestionList>
							{questions.map((q) => (
								<QuestionCard key={q.id}>
									<QuestionHeader>
										<Badge>{t(`pages.newQuiz.questionTypes.${q.type}`)}</Badge>
										<DeleteBtn
											onClick={() => removeQuestion(q.id)}
											title={t("pages.newQuiz.delete")}
											aria-label={t("pages.newQuiz.delete")}
										>
											<Trash2 size={16} />
										</DeleteBtn>
									</QuestionHeader>

									<Field>
										<FieldLabel>{t("pages.newQuiz.field.labelTitle")}</FieldLabel>
										<Input
											value={q.title}
											onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
											placeholder={t("pages.newQuiz.placeholders.typeHere")}
										/>
									</Field>

									<Field>
										<FieldLabel>{t("pages.newQuiz.field.labelDescription")}</FieldLabel>
										<TextArea
											value={q.description}
											onChange={(e) => updateQuestion(q.id, { description: e.target.value })}
											placeholder={t("pages.newQuiz.placeholders.typeHere")}
											rows={3}
										/>
									</Field>

									{(q.type === "single" || q.type === "multi" || q.type === "boolean") && (
										<>
											<Divider />
											<OptionsHeader>{t("pages.newQuiz.options.title")}</OptionsHeader>

											{(q.options || []).map((opt, idx) => (
												<OptionRow key={idx}>
													{q.type === "multi" ? (
														<FakeCheck
															type="checkbox"
															checked={(q.correctIndices ?? []).includes(idx)}
															onChange={() => toggleCorrectMulti(q.id, idx)}
															aria-label={`${t("pages.newQuiz.options.title")} #${idx + 1}`}
														/>
													) : (
														
														<FakeRadio
															type="radio"
															name={`q-${q.id}`}
															checked={q.correctIndex === idx}
															onChange={() => setCorrectSingle(q.id, idx)}
															aria-label={`${t("pages.newQuiz.options.title")} #${idx + 1}`}
														/>
													)}

													<OptionInput
														value={opt}
														onChange={(e) => updateOption(q.id, idx, e.target.value)}
													/>

													{(q.type === "single" || q.type === "multi") && (
														<RemoveOpt
															onClick={() => removeOption(q.id, idx)}
															title={t("pages.newQuiz.delete")}
															aria-label={t("pages.newQuiz.delete")}
														>
															<Trash2 size={16} />
														</RemoveOpt>
													)}
												</OptionRow>
											))}

											{(q.type === "single" || q.type === "multi") && (
												<AddOption type="button" onClick={() => addOption(q.id)}>
													<Plus size={16} /> {t("pages.newQuiz.options.newOption")}
												</AddOption>
											)}
										</>
									)}
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
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--color-background);
`;

const Header = styled.header`
    height: 64px;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 24px;
    background-color: var(--color-background);
`;

const Controls = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 12px;
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SaveButton = styled(Button)`
    background-color: var(--color-success-bg);
`;

const Body = styled.div`
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 16px;
    height: calc(100vh - 64px);
    padding: 16px 16px 24px 16px;
    background-color: var(--color-background);
`;

const LeftPanel = styled.aside`
    border-right: 1px solid #e5e7eb;
    padding-right: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: var(--color-background);
    color: var(--color-text);
`;

const LeftTitle = styled.h2`
    font-size: 14px;
    font-weight: 700;
    margin: 0;
`;

const TemplateList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TemplateCard = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background-color: var(--color-background-elevated);
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: grab;
    &:active {
        cursor: grabbing;
    }
    &:hover {
        filter: brightness(0.98);
    }
`;

const TemplateBadge = styled.span`
    font-size: 10px;
    text-transform: uppercase;
    background-color: var(--color-background);
    border: 1px solid #c7d2fe;
    padding: 2px 6px;
    border-radius: 999px;
`;

const TemplateLabel = styled.span`
    font-size: 14px;
`;

const CenterPanel = styled.section`
    padding-left: 8px;
    overflow: auto;
    min-height: 100%;
    border-radius: 12px;
    transition: box-shadow 0.2s, background 0.2s;
    background-color: var(--color-background);
    ${(p) =>
            p.$over &&
            `
    background-color: var(--color-background-elevated);
    box-shadow: inset 0 0 0 2px #c7d2fe;
  `}
`;

const EditorHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
`;

const EditorTitle = styled.input`
    flex: 1;
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    background-color: var(--color-background-elevated);
    color: var(--color-text);
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
`;

const SmallAction = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e5e7eb;
    background-color: #2563eb;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    &:hover {
        background-color: #1e40af;
    }
`;

const Field = styled.div`
    display: grid;
    gap: 6px;
    margin-bottom: 10px;
`;

const FieldLabel = styled.label`
    font-size: 12px;
    color: var(--color-text);
`;

const Input = styled.input`
    height: 38px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0 10px;
    background-color: var(--color-background-elevated);
    color: var(--color-text);
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
`;

const TextArea = styled.textarea`
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
    resize: vertical;
    background-color: var(--color-background-elevated);
    color: var(--color-text);
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
`;

const DropPlaceholder = styled.div`
    height: 160px;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #64748b;
    background-color: var(--color-background-elevated);
`;

const QuestionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const QuestionCard = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: var(--color-background-elevated);
    padding: 12px;
`;

const QuestionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Badge = styled.span`
    font-size: 12px;
    border: 1px solid #c7d2fe;
    border-radius: 999px;
    padding: 3px 8px;
    font-weight: 600;
    background-color: var(--color-background);
    color: var(--color-text);
`;

const DeleteBtn = styled.button`
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    &:hover {
        color: #ef4444;
    }
`;

const OptionsHeader = styled.div`
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text);
`;

const OptionRow = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: var(--color-background-elevated);
    margin-bottom: 8px;
`;

const FakeRadio = styled.input``;
const FakeCheck = styled.input``;

const OptionInput = styled.input`
    height: 34px;
    border: none;
    background: transparent;
    outline: none;
    color: var(--color-text);
`;

const RemoveOpt = styled.button`
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    &:hover {
        color: #ef4444;
    }
`;

const AddOption = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #2563eb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-weight: 500;
    color: #fff;
    &:hover {
        background-color: #1e40af;
    }
`;

const Divider = styled.hr`
    margin: 10px 0;
    border: none;
    border-top: 1px solid #e5e7eb;
`;