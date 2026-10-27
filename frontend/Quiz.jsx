import "./Quiz.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quiz({ selectedSubject, selectedTopic, selectedDifficulty }) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");
  const [progressSaveError, setProgressSaveError] = useState("");
  const [progressSaved, setProgressSaved] = useState(false);

  const subjectName =
    localStorage.getItem("currentSubject") || "Data Structures";

  const topicName = localStorage.getItem("currentTopic") || "Arrays";

  // Load quiz questions
  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setQuestions([]);
      setErrorMessage("");

      try {
        const params = new URLSearchParams({
          subject: selectedSubject,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
        });

        const response = await fetch(
          `http://localhost:5000/csvquestions?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to load questions.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error(
            "No questions were found for this selection."
          );
        }

        if (!cancelled) {
          setQuestions(data);
          setAnswers([]);
          setCurrentIndex(0);
          setSelectedOption("");
        }
      } catch (error) {
        console.error("Error loading questions:", error);

        if (!cancelled) {
          setErrorMessage(
            error.message || "Unable to load quiz questions."
          );
        }
      }
    }

    if (selectedSubject && selectedTopic && selectedDifficulty) {
      loadQuestions();
    } else {
      setErrorMessage(
        "Your subject, topic, or difficulty is missing. Please select them again."
      );
    }

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, selectedTopic, selectedDifficulty]);

  // Quiz timer
  useEffect(() => {
    if (questions.length === 0 || quizCompleted) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeSpent((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, quizCompleted]);

  function calculateScore() {
    return questions.reduce((score, question, index) => {
      return score +
        (answers[index] === question.CorrectAnswer ? 1 : 0);
    }, 0);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  function handleOptionChange(option) {
    setSelectedOption(option);
    setErrorMessage("");

    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentIndex] = option;
      return updated;
    });
  }

  // Save this attempt to the progress-tracking API
  async function saveProgressAttempt(score, accuracy) {
    const storedStudentId = localStorage.getItem("studentId");
    const studentId = Number(storedStudentId);

    if (
      !storedStudentId ||
      !Number.isInteger(studentId) ||
      studentId <= 0
    ) {
      throw new Error(
        "Your student ID was not found. Please log in again."
      );
    }

    const semester =
      localStorage.getItem("semester") ||
      localStorage.getItem("currentSemester") ||
      null;

    const response = await fetch(
      "http://localhost:5000/api/progress/attempts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          semester,
          subject_name: subjectName,
          topic_name: topicName,
          score: accuracy,
          total_questions: questions.length,
          correct_answers: score,
          time_spent_seconds: timeSpent,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to save your progress."
      );
    }

    return data;
  }

  // Load personalized learning videos
  async function fetchRecommendations(recommendedLevel) {
    setRecommendationLoading(true);
    setRecommendationError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: subjectName,
            topic: topicName,
            difficulty: recommendedLevel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Recommendation request failed.");
      }

      const data = await response.json();

      setRecommendations(
        Array.isArray(data.recommendations)
          ? data.recommendations
          : []
      );
    } catch (error) {
      console.error("Recommendation error:", error);
      setRecommendations([]);
      setRecommendationError(
        "Unable to load recommended videos right now."
      );
    } finally {
      setRecommendationLoading(false);
    }
  }

  function saveLearningSelection(score, accuracy, level) {
    localStorage.setItem("recommendedLevel", level);
    localStorage.setItem("currentTopicId", String(selectedTopic));
    localStorage.setItem("currentSubjectId", String(selectedSubject));
    localStorage.setItem("currentDifficulty", selectedDifficulty);
    localStorage.setItem("initialQuizScore", String(score));
    localStorage.setItem("initialQuizAccuracy", String(accuracy));
    localStorage.setItem("initialQuizTime", String(timeSpent));
  }

  // Submit the quiz and record the attempt
  async function submitQuiz() {
    if (isSubmitting || quizCompleted) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setProgressSaveError("");
    setProgressSaved(false);

    const score = calculateScore();
    const accuracy =
      questions.length > 0
        ? Math.round((score / questions.length) * 100)
        : 0;

    // Progress saving is independent of the AI prediction service.
    try {
      console.log("Starting progress save", { score, accuracy });
      await saveProgressAttempt(score, accuracy);
      setProgressSaved(true);
    } catch (error) {
      console.error("Progress tracking error:", error);
      setProgressSaveError(
        error.message || "Your progress could not be saved."
      );
    }

    let recommendedLevel = "Medium";

    try {
      const response = await fetch(
        "http://localhost:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizScore: accuracy,
            accuracy,
            timeSpent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      recommendedLevel =
        data.recommendation || data.prediction || "Medium";
    } catch (error) {
      console.error("Prediction error:", error);

      if (accuracy >= 80) {
        recommendedLevel = "Hard";
      } else if (accuracy < 50) {
        recommendedLevel = "Easy";
      }
    }

    saveLearningSelection(score, accuracy, recommendedLevel);

    setPrediction(recommendedLevel);
    setQuizCompleted(true);
    setIsSubmitting(false);

    await fetchRecommendations(recommendedLevel);
  }

  function handleNext() {
    if (!selectedOption) {
      setErrorMessage(
        "Please select an answer before continuing."
      );
      return;
    }

    setErrorMessage("");

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOption(answers[nextIndex] || "");
    } else {
      submitQuiz();
    }
  }

  function handlePrevious() {
    if (currentIndex === 0) {
      return;
    }

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    setSelectedOption(answers[previousIndex] || "");
    setErrorMessage("");
  }

  function goToQuestion(index) {
    setCurrentIndex(index);
    setSelectedOption(answers[index] || "");
    setErrorMessage("");
  }

  // Loading and error screen
  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="quiz-loading-icon">🧠</div>
          <h2>
            {errorMessage
              ? "Unable to Load Assessment"
              : "Loading Questions..."}
          </h2>
          <p>
            {errorMessage ||
              "Preparing your personalized assessment"}
          </p>
          {errorMessage && (
            <button
              className="secondary-result-btn"
              onClick={() => navigate("/semester")}
            >
              Return to Selection
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Results screen
  if (quizCompleted && !showReview) {
    const finalScore = calculateScore();
    const accuracy = Math.round(
      (finalScore / questions.length) * 100
    );

    return (
      <div className="quiz-page">
        <div className="result-card">
          <div className="result-header">
            <div className="result-icon">🎉</div>
            <h1>Assessment Completed</h1>
            <p>Your quiz results are ready</p>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <div className="stat-icon purple">🏆</div>
              <div>
                <span className="stat-label">Score</span>
                <strong>
                  {finalScore} / {questions.length}
                </strong>
                <small>Correct Answers</small>
              </div>
            </div>

            <div className="result-stat">
              <div className="stat-icon green">🎯</div>
              <div>
                <span className="stat-label">Accuracy</span>
                <strong>{accuracy}%</strong>
                <small>Overall Performance</small>
              </div>
            </div>

            <div className="result-stat">
              <div className="stat-icon violet">🕐</div>
              <div>
                <span className="stat-label">Time Spent</span>
                <strong>{formatTime(timeSpent)}</strong>
                <small>Total Quiz Time</small>
              </div>
            </div>
          </div>

          {progressSaved && (
            <div className="quiz-validation">
              ✓ Your quiz attempt was saved to progress tracking.
            </div>
          )}

          {progressSaveError && (
            <div className="quiz-validation">
              ⚠️ Progress was not saved: {progressSaveError}
            </div>
          )}

          <div className="recommendation-card">
            <div className="recommendation-top">
              <div className="recommendation-icon">🤖</div>
              <div>
                <h2>AI Recommendation</h2>
                <p>Based on your performance</p>
              </div>
            </div>

            <div className="recommendation-body">
              <div className="recommendation-level-icon">
                📈
              </div>
              <div className="recommendation-level">
                <span>Recommended Level</span>
                <strong>{prediction}</strong>
              </div>
              <div className="recommendation-message">
                {prediction === "Hard" ? (
                  <>
                    <h3>You're ready for a challenge!</h3>
                    <p>
                      Try practicing hard-level questions to
                      strengthen your understanding and confidence.
                    </p>
                  </>
                ) : prediction === "Easy" ? (
                  <>
                    <h3>Let's strengthen the basics.</h3>
                    <p>
                      Practice easy-level questions to build a
                      stronger foundation before moving ahead.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Keep building your skills.</h3>
                    <p>
                      Continue practicing medium-level questions
                      to improve your understanding and confidence.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="recommended-learning-section">
            <div className="recommended-learning-header">
              <div className="recommended-learning-title">
                <div className="recommended-learning-icon">
                  🎥
                </div>
                <div>
                  <h2>Recommended Learning</h2>
                  <p>
                    Personalized videos for{" "}
                    <strong>{topicName}</strong>
                  </p>
                </div>
              </div>
            </div>

            {recommendationLoading && (
              <div className="recommendation-status-card">
                <div className="status-icon">🔎</div>
                <p>Finding the best learning videos...</p>
                <span>
                  Matching content to your {prediction} level.
                </span>
              </div>
            )}

            {!recommendationLoading && recommendationError && (
              <div className="recommendation-error-card">
                <p>⚠️ Recommendations unavailable</p>
                <span>{recommendationError}</span>
              </div>
            )}

            {!recommendationLoading &&
              !recommendationError &&
              recommendations.length === 0 && (
                <div className="recommendation-status-card">
                  <div className="status-icon">📚</div>
                  <p>No matching videos found</p>
                  <span>
                    You can continue learning with other resources.
                  </span>
                </div>
              )}

            {!recommendationLoading &&
              recommendations.length > 0 && (
                <div className="video-grid">
                  {recommendations.slice(0, 6).map((video, index) => (
                    <div
                      key={video.videoId || video.url || index}
                      className="result-video-card"
                    >
                      <div className="video-thumbnail">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title || "Learning video"}
                          />
                        ) : (
                          <div className="video-placeholder">
                            ▶️
                          </div>
                        )}
                        <div className="video-number">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="video-content">
                        <h3>{video.title || "Learning video"}</h3>
                        <p className="video-channel">
                          {video.channel || ""}
                        </p>

                        {video.classifiedDifficulty && (
                          <span className="video-level">
                            {video.classifiedDifficulty}
                          </span>
                        )}

                        {video.url && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="watch-video-btn"
                          >
                            ▶ Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="result-actions">
            <button
              className="secondary-result-btn"
              onClick={() => setShowReview(true)}
            >
              📋 Review Answers
            </button>

            <button
              className="primary-result-btn"
              onClick={() => navigate("/learning-page")}
            >
              Start Learning <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Answer review screen
  if (quizCompleted && showReview) {
    return (
      <div className="quiz-page">
        <div className="review-card">
          <div className="review-header">
            <div>
              <span className="review-badge">Quiz Review</span>
              <h1>Review Your Answers</h1>
              <p>Check your answers and explanations.</p>
            </div>

            <button
              className="back-review-btn"
              onClick={() => setShowReview(false)}
            >
              ← Results
            </button>
          </div>

          <div className="review-summary">
            <div>
              <span>Score</span>
              <strong>
                {calculateScore()} / {questions.length}
              </strong>
            </div>
            <div>
              <span>Accuracy</span>
              <strong>
                {Math.round(
                  (calculateScore() / questions.length) * 100
                )}
                %
              </strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{formatTime(timeSpent)}</strong>
            </div>
          </div>

          <div className="review-list">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect =
                userAnswer === question.CorrectAnswer;

              return (
                <div
                  key={question.id || index}
                  className={`review-item ${
                    isCorrect ? "review-correct" : "review-wrong"
                  }`}
                >
                  <div className="review-item-top">
                    <span className="review-number">
                      Question {index + 1}
                    </span>
                    <span
                      className={`review-status ${
                        isCorrect ? "correct" : "wrong"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✕ Incorrect"}
                    </span>
                  </div>

                  <h3>{question.Question}</h3>

                  <div className="review-answer">
                    <span>Your Answer</span>
                    <p>{userAnswer || "Not Answered"}</p>
                  </div>

                  {!isCorrect && (
                    <div className="review-answer correct-answer">
                      <span>Correct Answer</span>
                      <p>{question.CorrectAnswer}</p>
                    </div>
                  )}

                  {question.Explanation && (
                    <div className="review-explanation">
                      <span>💡 Explanation</span>
                      <p>{question.Explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="review-bottom">
            <button
              className="secondary-result-btn"
              onClick={() => setShowReview(false)}
            >
              ← Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz screen
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  const answeredCount = answers.filter(Boolean).length;
  const remainingCount = questions.length - answeredCount;

  const options = [
    currentQuestion.Option1,
    currentQuestion.Option2,
    currentQuestion.Option3,
    currentQuestion.Option4,
  ].filter((option) => option !== undefined && option !== null);

  return (
    <div className="quiz-page">
      <div className="quiz-layout">
        <main className="quiz-main">
          <div className="question-header">
            <div className="question-header-left">
              <div className="question-header-icon">{"</>"}</div>
              <div>
                <h1>Data Structures &amp; Algorithms</h1>
                <p>
                  Topic:{" "}
                  <span>
                    {currentQuestion.Topic || topicName}
                  </span>
                  <b> • </b>
                  Difficulty:{" "}
                  <span className="difficulty-text">
                    {selectedDifficulty}
                  </span>
                </p>
              </div>
            </div>

            <div className="question-progress-info">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="header-progress">
                <div style={{ width: `${progress}%` }} />
              </div>
              <strong>{Math.round(progress)}%</strong>
            </div>
          </div>

          <div className="question-card">
            <div className="question-badge">
              Question {currentIndex + 1}
            </div>

            <h2 className="question-text">
              {currentQuestion.Question}
            </h2>

            <div className="options-list">
              {options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);

                return (
                  <label
                    key={index}
                    className={`answer-option ${
                      selectedOption === option ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                    />
                    <span className="option-letter">
                      {optionLetter}
                    </span>
                    <span className="option-text">{option}</span>
                    <span className="option-check">✓</span>
                  </label>
                );
              })}
            </div>

            {errorMessage && (
              <div className="quiz-validation">
                ⚠️ {errorMessage}
              </div>
            )}

            <div className="quiz-hint">
              <div className="hint-icon">💡</div>
              <div>
                <strong>Quick Hint</strong>
                <p>
                  Think carefully about the concept before selecting
                  your answer.
                </p>
              </div>
            </div>

            <div className="question-actions">
              <button
                className="previous-btn"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || isSubmitting}
              >
                ← Previous
              </button>

              <button
                className="next-question-btn"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {currentIndex === questions.length - 1
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit Quiz"
                  : "Next"}
                <span>→</span>
              </button>
            </div>
          </div>
        </main>

        <aside className="quiz-sidebar">
          <div className="timer-card">
            <div className="timer-circle">
              <div>🕐</div>
            </div>
            <div>
              <span>Time Spent</span>
              <strong>{formatTime(timeSpent)}</strong>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <span>◉</span>
              Question Navigation
            </div>

            <div className="question-number-grid">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`question-number ${
                    index === currentIndex
                      ? "current"
                      : answers[index]
                      ? "answered"
                      : ""
                  }`}
                  onClick={() => goToQuestion(index)}
                  disabled={isSubmitting}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="legend">
              <span>
                <i className="legend-dot answered-dot" />
                Answered
              </span>
              <span>
                <i className="legend-dot current-dot" />
                Current
              </span>
              <span>
                <i className="legend-dot unanswered-dot" />
                Not Answered
              </span>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <span>▣</span>
              Quiz Overview
            </div>

            <div className="overview-row">
              <span>Total Questions</span>
              <strong>{questions.length}</strong>
            </div>

            <div className="overview-row">
              <span>Answered</span>
              <strong>{answeredCount}</strong>
            </div>

            <div className="overview-row">
              <span>Remaining</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>

          <div className="motivation-card">
            <div className="motivation-icon">✨</div>
            <h3>Keep going!</h3>
            <p>Stay focused and trust your understanding.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Quiz;