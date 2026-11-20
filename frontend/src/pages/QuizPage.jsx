import { useEffect, useState } from "react";
import Quiz from "../components/Quiz";
import "../components/Quiz.css";

function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD SAVED LEARNING SELECTION
  // =========================================

  useEffect(() => {
    const subjectId = localStorage.getItem("currentSubjectId");
    const topicId = localStorage.getItem("currentTopicId");
    const difficulty = localStorage.getItem("currentDifficulty");

    const subjectName = localStorage.getItem("currentSubject");
    const topicName = localStorage.getItem("currentTopic");

    console.log("Saved Learning Selection:");
    console.log("Subject:", subjectName);
    console.log("Subject ID:", subjectId);
    console.log("Topic:", topicName);
    console.log("Topic ID:", topicId);
    console.log("Difficulty:", difficulty);

    // =========================================
    // VALIDATE SAVED DATA
    // =========================================

    if (!subjectId || !topicId || !difficulty) {
      setError(
        "Learning selection is incomplete. Please return to Start New Learning and select a subject, topic and difficulty."
      );

      setLoading(false);
      return;
    }

    // =========================================
    // SET QUIZ DATA
    // =========================================

    setSelectedSubject(subjectId);
    setSelectedTopic(topicId);
    setSelectedDifficulty(difficulty);

    setLoading(false);
  }, []);

  // =========================================
  // START QUIZ
  // =========================================

  if (
    !loading &&
    !error &&
    selectedSubject &&
    selectedTopic &&
    selectedDifficulty
  ) {
    return (
      <Quiz
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
        selectedDifficulty={selectedDifficulty}
      />
    );
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">

          <div className="quiz-loading-icon">
            🧠
          </div>

          <h2>
            Preparing Your Assessment...
          </h2>

          <p>
            Loading your selected topic and difficulty.
          </p>

        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">

          <div className="quiz-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Start Assessment
          </h2>

          <p>
            {error}
          </p>

        </div>
      </div>
    );
  }

  return null;
}

export default QuizPage;