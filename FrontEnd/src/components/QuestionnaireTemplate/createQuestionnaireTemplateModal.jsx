import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createQuestionnaireTemplate } from "../../services/questionnaireTemplate";
import styles from "../../styles/Modal.module.css";
import { FaPlus, FaGripLines } from "react-icons/fa";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "QUESTION";

const QuestionItem = ({
  question,
  index,
  moveQuestion,
  handleQuestionChange,
}) => {
  const { t } = useTranslation();
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={styles.questionItem}
    >
      <div className={styles.dragHandle}>
        <FaGripLines />
      </div>
      <input
        type="text"
        placeholder={t("questionnaire_template.question_text")}
        value={question.questionText}
        className={styles.questionInput}
        onChange={(e) =>
          handleQuestionChange(index, "questionText", e.target.value)
        }
        required
      />
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={question.isRequired}
          onChange={(e) =>
            handleQuestionChange(index, "isRequired", e.target.checked)
          }
        />
        {t("questionnaire_template.is_required")}
      </label>
    </div>
  );
};

export default function CreateQuestionnaireTemplateModal({ closeModal }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", order: 0, isRequired: true },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", order: questions.length, isRequired: true },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const moveQuestion = (fromIndex, toIndex) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderedQuestions = questions.map((q, index) => ({
        ...q,
        order: index,
      }));
      await createQuestionnaireTemplate({
        title,
        description,
        questions: orderedQuestions,
      });
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Failed to create questionnaire template", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{t("questionnaire_template.create_new")}</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="title">
                {t("questionnaire_template.title_input")}
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">
                {t("questionnaire_template.description")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className={styles.questionsContainer}>
                <h3>{t("questionnaire_template.questions")}</h3>
                {questions.map((question, index) => (
                  <QuestionItem
                    key={index}
                    index={index}
                    question={question}
                    moveQuestion={moveQuestion}
                    handleQuestionChange={handleQuestionChange}
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className={styles.addButton}
                >
                  <FaPlus /> {t("questionnaire_template.add_question")}
                </button>
              </div>
            </DndProvider>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {t("common.create")}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={styles.cancelButton}
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
