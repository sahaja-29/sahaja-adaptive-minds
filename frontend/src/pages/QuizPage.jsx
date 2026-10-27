
import { useEffect, useState } from "react";
import Quiz from "../components/Quiz";
import "../components/Quiz.css";

function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the saved learning selection
  useEffect(() => {
    const subjectId = localStorage.getItem("currentSubjectId");
    const topicId = localStorage.getItem("currentTopicId");
    const difficulty = localStorage.getItem("currentDifficulty");

    const subjectName = localStorage.getItem("currentSubject");
    const topicName = localStorage.getItem("currentTopic");

    console.log("Saved Learning Selection:", {
      subjectName,
      subjectId,
      topicName,
      topicId,
      difficulty,
    });

    // Validate the saved selection
    if (!subjectId || !topicId || !difficulty) {
      setError(
        "Learning selection is incomplete. Please return to Start New Learning and select a subject, topic and difficulty."
      );
      setLoading(false);
      return;
    }

    setSelectedSubject(subjectId);
    setSelectedTopic(topicId);
    setSelectedDifficulty(difficulty);

    setLoading(false);
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="quiz-loading-icon">🧠</div>
          <h2>Preparing Your Assessment...</h2>
          <p>Loading your selected topic and difficulty.</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <div className="quiz-error-icon">⚠️</div>
          <h2>Unable to Start Assessment</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render the quiz with the saved selection
  return (
    <Quiz
      selectedSubject={selectedSubject}
      selectedTopic={selectedTopic}
      selectedDifficulty={selectedDifficulty}
    />
  );
}

export default QuizPage;
