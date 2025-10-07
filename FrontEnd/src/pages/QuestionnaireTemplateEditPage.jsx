import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchQuestionnaireTemplateById,
  updateQuestionnaireTemplate,
} from "../services/questionnaireTemplate";
import styles from "../styles/QuestionnaireTemplate.module.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaGripLines } from "react-icons/fa";
import { toast } from "react-toastify";

const ItemType = "QUESTION";

const QuestionItem = ({
  question,
  index,
  moveQuestion,
  handleQuestionChange,
  removeQuestion,
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
      className={styles.questionEditItem}
    >
      <div className={styles.dragHandle}>
        <FaGripLines />
      </div>
      <input
        type="text"
        value={question.questionText}
        onChange={(e) =>
          handleQuestionChange(index, "questionText", e.target.value)
        }
        className={styles.questionInput}
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
      <button
        type="button"
        onClick={() => removeQuestion(index)}
        className={styles.removeQuestionButton}
      >
        {t("questionnaire_template.remove")}
      </button>
    </div>
  );
};

export default function QuestionnaireTemplateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchTemplate() {
      const data = await fetchQuestionnaireTemplateById(id);
      setTitle(data.title);
      setDescription(data.description);
      // Sort questions by order
      const sortedQuestions = (data.questions || []).sort(
        (a, b) => a.order - b.order
      );
      setQuestions(sortedQuestions);
    }
    fetchTemplate();
  }, [id]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", order: questions.length, isRequired: true },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
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
      await updateQuestionnaireTemplate(id, {
        title,
        description,
        questions: orderedQuestions,
      });
      toast.success(t("questionnaire_template.update_success"));
      setTimeout(() => {
        navigate("/questionnaire-templates");
      }, 1000);
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error(t("questionnaire_template.update_error"));
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate("/questionnaire-templates")}
        className={styles.backButton}
      >
        {t("questionnaire_template.back")}
      </button>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">
            {t("questionnaire_template.title_input")}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
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
            className={styles.textarea}
          />
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className={styles.questionsContainer}>
            <label className={styles.questionsLabel}>
              {t("questionnaire_template.questions")}
            </label>
            {questions.map((question, index) => (
              <QuestionItem
                key={index}
                index={index}
                question={question}
                moveQuestion={moveQuestion}
                handleQuestionChange={handleQuestionChange}
                removeQuestion={removeQuestion}
              />
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className={styles.addQuestionButton}
            >
              {t("questionnaire_template.add_question")}
            </button>
          </div>
        </DndProvider>

        <button type="submit" className={styles.submitButton}>
          {t("questionnaire_template.save_changes")}
        </button>
      </form>
    </div>
  );
}
