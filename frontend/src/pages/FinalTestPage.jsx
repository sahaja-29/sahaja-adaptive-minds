import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FinalTestPage() {
  const navigate = useNavigate();

  // =========================================================
  // CURRENT LEARNING DATA
  // =========================================================

  const subject =
    localStorage.getItem("currentSubject") ||
    "Data Structures";

  const topic =
    localStorage.getItem("currentTopic") ||
    "Arrays";

  const level =
    localStorage.getItem("recommendedLevel") ||
    "Medium";

  // =========================================================
  // FINAL TEST QUESTIONS
  // =========================================================
  // Temporary questions for the demo.
  // Later these can come from the backend/CSV based
  // on the selected topic.

  const questions = [
    {
      question: `Which statement best describes ${topic}?`,
      options: [
        "A fundamental data structure used to organize data",
        "A type of operating system",
        "A network communication protocol",
        "A database management system",
      ],
      answer: "A fundamental data structure used to organize data",
    },

    {
      question: `Which of the following is an important concept when learning ${topic}?`,
      options: [
        "Understanding its operations and usage",
        "Only memorizing definitions",
        "Ignoring practical examples",
        "Avoiding problem solving",
      ],
      answer: "Understanding its operations and usage",
    },

    {
      question: `What is the best way to improve your understanding of ${topic}?`,
      options: [
        "Practice problems and examples",
        "Only read the title",
        "Skip all exercises",
        "Avoid reviewing mistakes",
      ],
      answer: "Practice problems and examples",
    },

    {
      question: `What should you do after learning ${topic}?`,
      options: [
        "Apply the concept to problems",
        "Forget the concept",
        "Skip practice",
        "Avoid testing your understanding",
      ],
      answer: "Apply the concept to problems",
    },

    {
      question: `What is the main purpose of this final test?`,
      options: [
        "Confirm your understanding of the topic",
        "Start a completely different subject",
        "Replace the learning resources",
        "Skip the learning process",
      ],
      answer: "Confirm your understanding of the topic",
    },
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] =
    useState("");

  const [answers, setAnswers] = useState([]);

  const [testCompleted, setTestCompleted] =
    useState(false);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion =
    questions[currentIndex];

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const selectAnswer = (option) => {
    setSelectedOption(option);

    setAnswers((previousAnswers) => {
      const updatedAnswers = [
        ...previousAnswers,
      ];

      updatedAnswers[currentIndex] = option;

      return updatedAnswers;
    });
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = () => {
    if (!selectedOption) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);

      setSelectedOption(
        answers[nextIndex] || ""
      );
    } else {
      setTestCompleted(true);
    }
  };

  // =========================================================
  // CALCULATE SCORE
  // =========================================================

  const calculateScore = () => {
    let score = 0;

    questions.forEach((question, index) => {
      if (
        answers[index] ===
        question.answer
      ) {
        score++;
      }
    });

    return score;
  };

  const score = calculateScore();

  // Student needs 4/5 to pass.

  const passed = score >= 4;

  // =========================================================
  // TEST RESULT
  // =========================================================

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-xl w-full text-center shadow-2xl">

          <div className="text-6xl mb-5">
            {passed ? "🎉" : "📚"}
          </div>

          <h1 className="text-3xl font-bold">
            {passed
              ? "Topic Completed!"
              : "Keep Learning"}
          </h1>

          <p className="text-gray-400 mt-4">
            {topic} Final Test Score
          </p>

          <p className="text-5xl font-bold text-indigo-400 mt-2">
            {score} / {questions.length}
          </p>


          {/* PASSED */}

          {passed ? (
            <>
              <p className="text-green-400 mt-5 font-medium">
                ✓ You passed the final confirmation test.
              </p>

              <p className="text-gray-400 mt-2">
                You have successfully completed{" "}
                {topic}.
              </p>


              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 mt-6">

                <p className="text-green-300 font-medium">
                  🎓 Learning Path Updated
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  Your progress has been recorded for
                  this demo.
                </p>

              </div>


              <button
                onClick={() => {

                  localStorage.setItem(
                    `topicCompleted_${topic}`,
                    "true"
                  );

                  navigate("/dashboard");
                }}
                className="mt-8 bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold transition"
              >
                Back to Dashboard →
              </button>

            </>
          ) : (

            /* FAILED */

            <>
              <p className="text-yellow-400 mt-5 font-medium">
                You need at least 4 correct answers
                to complete this topic.
              </p>

              <p className="text-gray-400 mt-2">
                Review the learning resources and
                try the test again.
              </p>


              <button
                onClick={() =>
                  navigate("/learning-page")
                }
                className="mt-8 bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold transition"
              >
                Return to Learning →
              </button>

            </>
          )}

        </div>

      </div>
    );
  }

  // =========================================================
  // TEST PAGE
  // =========================================================

  const progress =
    ((currentIndex + 1) /
      questions.length) *
    100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="bg-slate-900 border-b border-slate-800">

        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-indigo-400">
              Adaptive Minds
            </h1>

            <p className="text-gray-500 text-sm">
              Final Confirmation Test
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/learning-page")
            }
            className="text-gray-300 hover:text-white transition"
          >
            ← Back to Learning
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="max-w-4xl mx-auto px-8 py-10">

        {/* Test Information */}

        <div className="mb-8">

          <p className="text-indigo-400 text-sm font-semibold">
            {subject.toUpperCase()} •{" "}
            {topic.toUpperCase()}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Final Confirmation Test
          </h1>

          <p className="text-gray-400 mt-3">
            Confirm your understanding of the
            learning resources you completed.
          </p>

        </div>


        {/* Recommended Level */}

        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-5 mb-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-xs">
                AI RECOMMENDED LEVEL
              </p>

              <p className="text-indigo-300 font-bold text-lg mt-1">
                {level}
              </p>

            </div>

            <span className="text-2xl">
              🤖
            </span>

          </div>

        </div>


        {/* Progress */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

          <div className="flex justify-between text-sm mb-3">

            <span className="text-gray-400">
              Question {currentIndex + 1} of{" "}
              {questions.length}
            </span>

            <span className="text-indigo-400">
              {Math.round(progress)}%
            </span>

          </div>


          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">

            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* Question Card */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <p className="text-xl font-semibold leading-8 mb-7">
            {currentQuestion.question}
          </p>


          {/* Options */}

          <div className="space-y-4">

            {currentQuestion.options.map(
              (option) => ( 

                <button
                  key={option}
                  onClick={() =>
                    selectAnswer(option)
                  }
                  className={`w-full text-left p-5 rounded-xl border transition ${
                    selectedOption === option
                      ? "border-indigo-500 bg-indigo-600/20 text-white"
                      : "border-slate-700 bg-slate-800 text-gray-300 hover:border-slate-600"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedOption ===
                        option
                          ? "border-indigo-400"
                          : "border-gray-600"
                      }`}
                    >

                      {selectedOption ===
                        option && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      )}

                    </div>

                    <span>
                      {option}
                    </span>

                  </div>

                </button>

              )
            )}

          </div>


          {/* Navigation */}

          <div className="flex justify-end mt-8">

            <button
              onClick={nextQuestion}
              disabled={!selectedOption}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed px-7 py-3 rounded-xl font-semibold transition"
            >

              {currentIndex ===
              questions.length - 1
                ? "Submit Test"
                : "Next →"}

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default FinalTestPage;