import React, { useMemo, useRef, useState, useEffect } from 'react';
import { FilePenLine, Save, Plus, Trash2, GripVertical, Edit3 } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import UnsavedChangesGuard from "../../components/UnsavedChangesGuard";
import ToggleSwitch from "../../components/buttons/ToggleSwitchButton";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Header from "../../components/layout/Header";
import TextArea from "../../components/ui/TextArea";
import ToggleThemeSwitch from "../../components/ui/ToggleThemeSwitch";

export default function NewQuiz() {
	// Translation
	const { t } = useTranslation();

	// Principal states
	const [isDirty, setIsDirty] = useState(false);
	const [active, setActive] = useState(true);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [questions, setQuestions] = useState([]);
	const [isDescEditing, setIsDescEditing] = useState(false);

	// Drag and Drop State
	const [draggingId, setDraggingId] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [dragOverPosition, setDragOverPosition] = useState(null);

	const questionRefs = useRef({});

	useEffect(() => {
		document.body.classList.add('page-newquiz');
		return () => document.body.classList.remove('page-newquiz');
	}, []);

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

	// Move helper
	const move = (arr, from, to) => {
    const copy = arr.slice();
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  };
  
  const handleDragStart = (id) => (e) => {
    setDraggingId(id);
    e.stopPropagation();
    try {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    } catch {}
  };
  
  const handleDragOver = (index) => (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pos = y < rect.height / 2 ? "before" : "after";
    if (dragOverIndex !== index || dragOverPosition !== pos) {
      setDragOverIndex(index);
      setDragOverPosition(pos);
    }
  };
  
  const handleDrop = (index) => (e) => {
    e.preventDefault();
    const from = questions.findIndex((q) => q.id === draggingId);
    if (from < 0) return handleDragEnd();
    let to = dragOverPosition === "before" ? index : index + 1;
    if (from < to) to -= 1;
    if (from !== to) {
      setQuestions((prev) => move(prev, from, to));
      setIsDirty(true);
    }
    handleDragEnd();
  };
  
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

	return (
		<Main>
			<UnsavedChangesGuard when={isDirty} />
			<DesktopHeaderWrap>
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
<ToggleThemeSwitch />
					<LanguageSelector />
					<SaveButton onClick={onSave}>
						<Save size={16} />{t("actions.saveChanges")}
					</SaveButton>
					</Controls>
				]}
				showBurger
				/>
	        
			</DesktopHeaderWrap>
		
			<MobileHeader>
				<MobileTitleRow>
				<FilePenLine size={18} />
				<MobileTitle>{t("quiz.title")}</MobileTitle>
				</MobileTitleRow>
				<MobileControlsRow>
					<ToggleSwitch 
						checked={active} 
						onChange={setActive} 
						onLabel={t("common.active")} 
						offLabel={t("common.inactive")} 
						onColor="#22c55e" 
						offColor="#e5e7eb" 
					/>
					<LanguageSelector />
				</MobileControlsRow>
				<MobileSaveButton onClick={onSave}>
				<Save size={16} />{t("actions.saveChanges")}
				</MobileSaveButton>
			</MobileHeader>
			<Body>
				<LeftPanel>
					<LeftTitle>{t("quiz.sections.questions")}</LeftTitle>

					<AddQuestionButton type="button" onClick={addSingleQuestion}>
						<Plus size={16} /> {t("actions.addQuestion") || "Ajouter une question"}
					</AddQuestionButton>

					<LeftList>
						{questions.map((q, idx) => (
							<LeftRow
								key={q.id}
								onDragOver={handleDragOver(idx)}
								onDrop={handleDrop(idx)}
								data-drop-pos={dragOverIndex === idx ? dragOverPosition : undefined}
							>
								<DragDock
								draggable
								onDragStart={handleDragStart(q.id)}
								onDragEnd={handleDragEnd}
								onClick={(e) => e.stopPropagation()}
								aria-label={t("actions.reorder")}
								title={t("actions.reorder")}
								data-dragging={draggingId === q.id ? "true" : undefined}
								>
								<GripVertical size={16} />
								</DragDock>
								<LeftCard
									onClick={() => scrollToQuestion(q.id)}
									title={t("quiz.hints.goToQuestion") || "Aller à la question"}
								>
									<LeftCardIndex>{idx + 1}</LeftCardIndex>
									<LeftCardTitle>{q.title?.trim() ? q.title : untitled}</LeftCardTitle>
									<LeftCardMain>
										<LeftCardTitle>{q.title?.trim() ? q.title : untitled}</LeftCardTitle>
							            	<TypePill>
							              		{getTypeLabel(q)}
							            	</TypePill>
									</LeftCardMain>
								</LeftCard>
							</LeftRow>
						))}
					</LeftList>
				</LeftPanel>
				<CenterPanel>
					<CenterInner>
						<TitleLine>
							
						<TitleInput
							value={title}
							onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
							placeholder={t("quiz.placeholders.title")}
							aria-label={t("quiz.placeholders.title")}
						/>
						<EditHint aria-hidden="true"><FilePenLine size={16} /></EditHint>
						</TitleLine>
						<DescBlock>
						{description.trim() || isDescEditing ? (
							<DescTextarea
							value={description}
							onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
							placeholder={t("quiz.sections.descriptionAdd") || t("common.placeholders.typeHere")}
							rows={2}
							onBlur={() => {
								if (!description.trim()) setIsDescEditing(false);
							}}
							/>
						) : (
							<AddDescButton
							type="button"
							onClick={() => setIsDescEditing(true)}
							aria-label={t("quiz.sections.descriptionAdd") || "Ajouter une description"}
							>
							+ {t("quiz.sections.descriptionAdd") || "Ajouter une description"}
							</AddDescButton>
						)}
						</DescBlock>

					</CenterInner>

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
										<MyInput
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
	min-height: 100vh;
	min-height: 100dvh;
	overflow: hidden;
`;

const Controls = styled.div`
	display:inline-flex;
	align-items:center;
	gap:12px;
	display:inline-flex;
	align-items:center;
	gap:12px;
	flex-wrap:wrap;
`;

const SaveButton = styled(Button)`
	background-color:var(--color-success-bg);
	&:hover{
		background-color: #134e4a;
	}
`;

const Body = styled.div`
	display:grid;
	grid-template-columns:280px 1fr;
	grid-template-areas:"sidebar main";
	gap:16px;
	height:calc(100vh - 64px);
	flex: 1;
	min-height: 0;
	padding:16px 16px 24px 16px;
	background-color:var(--color-background);
	overflow:hidden;

	@media (max-width: 1024px){
    	grid-template-columns:240px 1fr;
    	gap:12px;
  	}	
	@media (max-width: 768px){
		grid-template-columns:1fr;
		grid-template-areas:
		"sidebar"
		"main";
		height:auto;
		min-height:calc(100vh - 64px);
		overflow:visible;
		gap:12px;
		padding:12px;
	}
`;

const LeftPanel = styled.aside`
	grid-area: sidebar;
	border-right:1px solid var(--quiz-border);
	padding-right:16px;
	display:flex;
	flex-direction:column;
	gap:12px;
	background-color:var(--color-background);
	color:var(--color-text);
	overflow:auto;
	min-height: 0;

	@media (max-width: 768px){
    	border-right:none;
	    border-bottom:1px solid var(--quiz-border);
    	padding-right:0;
	    padding-bottom:12px;
		max-height:40vh;   
 	    overflow:auto;
	}
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
	background-color: #2563eb;
	border:1px solid #e5e7eb;
	border-radius:10px;
	padding:10px 12px;
	cursor:pointer;
	color: #fff;
	font-weight:600;
	&:hover{
		background-color: #1e40af;
	}

	@media (max-width: 768px){
		width:100%;
		justify-content:center;
	}
`;

const LeftList = styled.div`
	display:flex;
	flex-direction:column;
	gap:8px;
	user-select:none;

	@media (max-width: 768px){
		gap:6px;
	}
`;

const LeftRow = styled.div`
    display:grid;
    grid-template-columns:24px 1fr; 
    align-items:center;
    gap:6px;
    position:relative; 
    &::before{
      content:"";
      position:absolute;
      left:0; right:0;
      height:2px;
      background:#3b82f6;
      border-radius:1px;
      opacity:0;
      transition:opacity .1s ease;
    }
    &[data-drop-pos="before"]::before{ top:-3px; opacity:1; }
    &[data-drop-pos="after"]::before{ bottom:-3px; opacity:1; }

	@media (max-width: 768px){
		grid-template-columns:28px 1fr;
	}
  `;

const LeftCard = styled(Button)`
	display:grid;
	grid-template-columns:28px 1fr;
	align-items:center;
	gap:8px;
	border:1px solid var(--quiz-border);
	border-radius:10px;
	background-color:var(--quiz-surface-muted);
	color:var(--color-text);
	padding:8px 10px;
	cursor:pointer;
	text-align:left;
	   position:relative;
	   cursor:grab;
	   &[data-dragging="true"] {
	     opacity:0.6;
	     cursor:grabbing;
	   }
	   &::before {
	     content:"";
	     position:absolute;
	     left:8px; right:8px;
	     height:2px;
	     background:#3b82f6;
	     border-radius:1px;
	     opacity:0;
	     transition:opacity .1s ease;
	     top:auto; bottom:auto;
	   }
	   &[data-drop-pos="before"]::before {
	     top:-1px; bottom:auto; opacity:1;
	   }
	   &[data-drop-pos="after"]::before {
	     bottom:-1px; top:auto; opacity:1;
	   }
	&:hover{
		filter:brightness(0.98);
	}

	@media (max-width: 768px){
		padding:10px;
	}
`;

const LeftCardMain = styled.div`
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:8px;
	min-width:0;
`;

const DragDock = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    width:24px;
    height:32px;
    color: #94a3b8;
    cursor:grab;
    &:hover{ color: #64748b; }
    &[data-dragging="true"]{
      opacity:.7;
      cursor:grabbing;
    }

	@media (max-width: 768px){
		width:28px;
		height:36px;
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
	flex:1;
	font-size:14px;
	overflow:hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
`;

const TypePill = styled.span`
	font-size:11px;
	line-height:1;
	border:1px solid #c7d2fe;
	border-radius:999px;
	padding:3px 6px;
	font-weight:600;
	background-color:var(--color-background);
	color:var(--color-text);
	white-space:nowrap;
`;

const CenterPanel = styled.section`
	grid-area: main;
	padding-left:8px;
	display:flex;
	flex-direction:column;
	overflow:hidden;
	min-height:0;
	border-radius:12px;
	background-color:var(--color-background);
	--content-width: clamp(900px, 48vw, 560px);

	@media (max-width: 768px){
		padding-left:0;
	}
`;

const CenterInner = styled.div `
	width:100%;
	max-width:var(--content-width);
	margin:0 auto 12px auto;

	@media (max-width: 768px){
		margin:0 auto 10px auto;
	}
`;

const TitleLine = styled.div`
	display:flex;
	align-items:center;
	gap:8px;
	margin: 6px 0 2px 0;
	&:hover ${''} svg {
		opacity: 0.6;
	}
`;

const TitleInput = styled.input`
	border:none;
	background:transparent;
	outline:none;
	padding:0;
	margin:0;
	width:100%;
	font-weight:700;
	line-height:1.2;
	color:var(--color-text);
	font-size: clamp(18px, 2.8vw, 28px);
	&::placeholder{
		color: #64748b;
  	}
`;

const EditHint = styled.span`
	display:inline-grid;
	place-items:center;
	width:20px;
	height:20px;
	color:#94a3b8;
	opacity:0;
	transition: opacity .12s ease;
`;

const DescBlock = styled.div`
  	margin-top: 2px;
`;

const DescTextarea = styled(TextArea)`
	width:100%;
	border:none;
	outline:none;
	resize:vertical;
	background:transparent;
	color:var(--color-text);
	line-height:1.4;
	font-size: 14px;
	padding: 2px 0;
	&::placeholder{
		color: #94a3b8;
	}
`;

const AddDescButton = styled(Button)`
	border:none;
	background:transparent;
	color: #94a3b8;
	padding:0;
	margin: 2px 0 0;
	font-size:14px;
	cursor:text;
	&:hover{
		color: #64748b;
	}
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

const MyInput = styled(Input)`
	height:38px;
	border:1px solid var(--quiz-border);
	border-radius:8px;
	padding:0 10px;
	background-color:var(--quiz-surface);
	color:var(--color-text);
`;

const DropPlaceholder = styled.div`
	height:160px;
	border:2px dashed var(--quiz-border);
	border-radius:12px;
	display:grid;
	place-items:center;
	color: var(--quiz-placeholder);
	background-color:var(--quiz-surface-muted);
	width:100%;
	max-width:var(--content-width);
	margin:0 auto;

	@media (max-width: 768px){
		height:140px;
	}
`;

const QuestionList = styled.div`
	display:flex;
	flex-direction:column;
	gap:12px;
	flex:1;
	min-height:0;
	overflow-y:auto;
	padding:0 12px;
	align-items:center;

	@media (max-width: 768px){
	    padding:0 8px;
	}
`;

const QuestionCard = styled.div`
	border:1px solid var(--quiz-border);
	border-radius:12px;
	background-color:var(--quiz-surface-muted);
	padding:12px;
	width:100%;
	max-width:var(--content-width);
	margin: 0 auto;

	@media (max-width: 768px){
		padding:10px;
	}
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
	border: none;
	background-color: var(--brand-error-500);
	color: #000;
	cursor: pointer;
	transition: background-color .15s ease;

	&:hover {
		background-color: var(--brand-error-600);
		color: #000;
	}

	&:active {
		background-color: var(--brand-error-700);
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
	border:1px solid var(--quiz-border);
	border-radius:8px;
	background-color:var(--quiz-surface);
	margin-bottom:8px;
`;

const FakeCheck = styled(Input)`

`;

const OptionInput = styled(Input)`
	height:34px;
	border:none;
	background:transparent;
	outline:none;
	color:var(--color-text);
`;

const RemoveOpt = styled.button`
	border: none;
	background-color: var(--brand-error-500);
	color: #000;
	cursor: pointer;
	transition: background-color .15s ease;

	&:hover {
		background-color: var(--brand-error-600);
		color: #000;
	}

	&:active {
		background-color: var(--brand-error-700);
	}
`;

const AddOption = styled(Button)`
	display:inline-flex;
	align-items:center;
	gap:6px;
	background-color: #2563eb;
	border:1px solid #e5e7eb;
	border-radius:8px;
	padding:8px 10px;
	cursor:pointer;
	font-weight:500;
	color:#fff;
	&:hover{
		background-color: #1e40af;
	}
`;

const Divider = styled.hr`
	margin:10px 0;
	border:none;
	border-top:1px solid var(--quiz-border);
`;

const DesktopHeaderWrap = styled.div`
  @media (max-width: 768px){
    display:none;
  }
`;

const MobileHeader = styled.div`
	display:none;

	@media (max-width: 768px){
		display:grid;
		grid-template-rows:auto auto auto;
		gap:8px;
		padding:12px 12px 0;
		background:var(--color-background);
	}
`;

const MobileTitleRow = styled.div`
	display:flex;
	align-items:center;
	gap:8px;
	color:var(--color-text);
`;

const MobileTitle = styled.h1`
	margin:0;
	flex:1;
	white-space:nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
	font-weight:700;
	font-size:clamp(16px, 5.5vw, 20px);
	line-height:1.2;
`;

const MobileControlsRow = styled.div`
	display:flex;
	align-items:center;
	gap:10px;

	@media (max-width: 420px){
		flex-wrap:wrap;
		gap:8px;
	}
`;

const MobileSaveButton = styled(SaveButton)`
	width:100%;
	justify-content:center;

	@media (max-width: 420px){
		padding:10px 12px;
	}
`;
