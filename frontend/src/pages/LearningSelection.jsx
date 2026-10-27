import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LearningSelection() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const semester =
    localStorage.getItem("semester") || "Semester 3";

  // =========================================================
  // LOAD SUBJECTS
  // =========================================================


useEffect(() => {
  fetch("http://localhost:5000/subjects")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load subjects");
      }

      return response.json();
    })
    .then((data) => {
      const semester3Subjects = [
        "Data Structures",
        "Database Management Systems",
        "OOP with Java",
        "Operating Systems"
      ];

      const semester4Subjects = [
        "Analysis & Design of Algorithms",
        "Biology for Computer Engineers",
        "Microcontrollers",
        "Digital Design and Computer Organization"
      ];

      const allowedSubjects =
        semester === "Semester 4"
          ? semester4Subjects
          : semester3Subjects;

      setSubjects(
        data.filter((subject) =>
          allowedSubjects.includes(subject.name)
        )
      );
    })
    .catch((error) => {
      console.error("Error loading subjects:", error);
    });
}, [semester]);


  // =========================================================
  // LOAD TOPICS
  // =========================================================

  useEffect(() => {
    if (!selectedSubject) {
      setTopics([]);
      return;
    }

    fetch(
      `http://localhost:5000/topics?subjectId=${selectedSubject}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load topics");
        }

        return response.json();
      })
      .then((data) => {
        setTopics(data);
      })
      .catch((error) => {
        console.error("Error loading topics:", error);
      });
  }, [selectedSubject]);

  // =========================================================
  // START ASSESSMENT
  // =========================================================

  const startAssessment = () => {
    if (
      !selectedSubject ||
      !selectedTopic ||
      !selectedDifficulty
    ) {
      return;
    }

    const subject = subjects.find(
      (item) =>
        String(item.id) === String(selectedSubject)
    );

    const topic = topics.find(
      (item) =>
        String(item.id) === String(selectedTopic)
    );

    const subjectName =
      subject?.name || "Data Structures";

    const topicName =
      topic?.topic_name || "Arrays";

    // =====================================================
    // SAVE CURRENT LEARNING INFORMATION
    // =====================================================

    localStorage.setItem(
      "currentSubject",
      subjectName
    );

    localStorage.setItem(
      "currentSubjectId",
      selectedSubject
    );

    localStorage.setItem(
      "currentTopic",
      topicName
    );

    localStorage.setItem(
      "currentTopicId",
      selectedTopic
    );

    localStorage.setItem(
      "currentDifficulty",
      selectedDifficulty
    );

    localStorage.removeItem(
      `learningProgress_${topicName}`
    );

    // =====================================================
    // GO TO QUIZ
    // =====================================================

    navigate(
      `/quiz/${encodeURIComponent(subjectName)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#172554] relative overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-[#E3DEFF] rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-[#E8F0FF] rounded-full blur-3xl opacity-70 pointer-events-none"></div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative bg-white/90 backdrop-blur-xl border-b border-[#E8E8F2]">

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5B4BDB] to-[#7C6FF2] flex items-center justify-center text-xl shadow-lg shadow-[#5B4BDB]/20">
              🧠
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#172554]">
                Adaptive Minds
              </h1>

              <p className="text-xs text-[#64748B]">
                Personalized Learning
              </p>
            </div>

          </div>


          {/* Dashboard */}

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#5B4BDB] bg-[#F3F1FF] hover:bg-[#EAE7FF] transition"
          >
            ← Dashboard
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative max-w-6xl mx-auto px-6 md:px-8 py-10 md:py-14">

        {/* Heading */}

        <div className="mb-10">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEEBFF] text-[#5B4BDB] text-sm font-semibold mb-4">
            🎯 {semester}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#172554]">
            Choose Your Learning Path
          </h1>

          <p className="text-[#64748B] mt-3 text-lg max-w-2xl">
            Select a subject, topic and difficulty to begin
            your personalized assessment.
          </p>

        </div>


        {/* =====================================================
            MAIN SELECTION CARD
        ===================================================== */}

        <div className="bg-white border border-[#E7E5F5] rounded-[30px] p-6 md:p-9 shadow-[0_20px_60px_rgba(79,70,229,0.08)]">

          {/* TOP STEP INDICATOR */}

          <div className="flex items-center gap-3 mb-9">

            <div className="w-9 h-9 rounded-xl bg-[#5B4BDB] text-white flex items-center justify-center font-bold">
              1
            </div>

            <div className="h-px flex-1 bg-[#E7E5F5]"></div>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                selectedSubject
                  ? "bg-[#5B4BDB] text-white"
                  : "bg-[#F1F0F8] text-[#94A3B8]"
              }`}
            >
              2
            </div>

            <div className="h-px flex-1 bg-[#E7E5F5]"></div>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                selectedTopic
                  ? "bg-[#5B4BDB] text-white"
                  : "bg-[#F1F0F8] text-[#94A3B8]"
              }`}
            >
              3
            </div>

          </div>


          {/* =====================================================
              SUBJECT
          ===================================================== */}

          <div className="mb-8">

            <label
              htmlFor="subject"
              className="block text-[#334155] font-bold mb-3"
            >
              <span className="text-[#5B4BDB] mr-2">
                01
              </span>
              Select Subject
            </label>

            <div className="relative">

              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic("");
                }}
                className="appearance-none w-full bg-[#F8F9FF] border border-[#E1E3EF] rounded-2xl px-5 py-4 pr-12 text-[#172554] font-medium outline-none cursor-pointer transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
              >

                <option value="">
                  Choose a subject
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}

              </select>

              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7C6FF2] pointer-events-none">
                ▼
              </div>

            </div>

          </div>


          {/* =====================================================
              TOPIC
          ===================================================== */}

          <div className="mb-8">

            <label
              htmlFor="topic"
              className="block text-[#334155] font-bold mb-3"
            >
              <span className="text-[#5B4BDB] mr-2">
                02
              </span>
              Select Topic
            </label>

            <div className="relative">

              <select
                id="topic"
                value={selectedTopic}
                onChange={(e) =>
                  setSelectedTopic(e.target.value)
                }
                disabled={!selectedSubject}
                className="appearance-none w-full bg-[#F8F9FF] border border-[#E1E3EF] rounded-2xl px-5 py-4 pr-12 text-[#172554] font-medium outline-none cursor-pointer transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <option value="">
                  {selectedSubject
                    ? "Choose a topic"
                    : "Select subject first"}
                </option>

                {topics.map((topic) => (
                  <option
                    key={topic.id}
                    value={topic.id}
                  >
                    {topic.topic_name}
                  </option>
                ))}

              </select>

              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7C6FF2] pointer-events-none">
                ▼
              </div>

            </div>

          </div>


          {/* =====================================================
              DIFFICULTY
          ===================================================== */}

          <div className="mb-9">

            <label className="block text-[#334155] font-bold mb-4">
              <span className="text-[#5B4BDB] mr-2">
                03
              </span>
              Select Difficulty
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* EASY */}

              <button
                type="button"
                onClick={() =>
                  setSelectedDifficulty("Easy")
                }
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  selectedDifficulty === "Easy"
                    ? "border-[#10B981] bg-[#ECFDF5] shadow-md shadow-[#10B981]/10"
                    : "border-[#E5E7EF] bg-[#FAFAFD] hover:border-[#A7F3D0] hover:bg-[#F8FFFC]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-xl">
                    🌱
                  </div>

                  {selectedDifficulty === "Easy" && (
                    <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}

                </div>

                <h3 className="font-bold text-lg text-[#172554] mt-4">
                  Easy
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Build fundamentals
                </p>

              </button>


              {/* MEDIUM */}

              <button
                type="button"
                onClick={() =>
                  setSelectedDifficulty("Medium")
                }
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  selectedDifficulty === "Medium"
                    ? "border-[#F59E0B] bg-[#FFFBEB] shadow-md shadow-[#F59E0B]/10"
                    : "border-[#E5E7EF] bg-[#FAFAFD] hover:border-[#FDE68A] hover:bg-[#FFFDF5]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-xl">
                    ⚡
                  </div>

                  {selectedDifficulty === "Medium" && (
                    <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}

                </div>

                <h3 className="font-bold text-lg text-[#172554] mt-4">
                  Medium
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Test understanding
                </p>

              </button>


              {/* HARD */}

              <button
                type="button"
                onClick={() =>
                  setSelectedDifficulty("Hard")
                }
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  selectedDifficulty === "Hard"
                    ? "border-[#EF4444] bg-[#FEF2F2] shadow-md shadow-[#EF4444]/10"
                    : "border-[#E5E7EF] bg-[#FAFAFD] hover:border-[#FECACA] hover:bg-[#FFF9F9]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-xl">
                    🔥
                  </div>

                  {selectedDifficulty === "Hard" && (
                    <div className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}

                </div>

                <h3 className="font-bold text-lg text-[#172554] mt-4">
                  Hard
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Challenge yourself
                </p>

              </button>

            </div>

          </div>


          {/* =====================================================
              START ASSESSMENT
          ===================================================== */}

          <button
            onClick={startAssessment}
            disabled={
              !selectedSubject ||
              !selectedTopic ||
              !selectedDifficulty
            }
            className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] hover:from-[#4F46C5] hover:to-[#6D5CE7] disabled:from-[#E2E3EB] disabled:to-[#E2E3EB] disabled:text-[#94A3B8] disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#5B4BDB]/20 hover:shadow-xl hover:shadow-[#5B4BDB]/25 transition-all duration-300"
          >
            Start Assessment →
          </button>

        </div>


        {/* =====================================================
            INFO CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

          <div className="bg-white border border-[#E8E7F2] rounded-2xl p-5 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-[#EEEBFF] flex items-center justify-center text-xl mb-4">
              🧠
            </div>

            <h3 className="font-bold text-[#172554]">
              Adaptive Assessment
            </h3>

            <p className="text-[#64748B] text-sm mt-2 leading-relaxed">
              Your performance helps determine your
              personalized learning level.
            </p>

          </div>


          <div className="bg-white border border-[#E8E7F2] rounded-2xl p-5 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-[#E8F1FF] flex items-center justify-center text-xl mb-4">
              🎥
            </div>

            <h3 className="font-bold text-[#172554]">
              Personalized Learning
            </h3>

            <p className="text-[#64748B] text-sm mt-2 leading-relaxed">
              Get learning resources based on your
              assessment performance.
            </p>

          </div>


          <div className="bg-white border border-[#E8E7F2] rounded-2xl p-5 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-xl mb-4">
              📈
            </div>

            <h3 className="font-bold text-[#172554]">
              Track Progress
            </h3>

            <p className="text-[#64748B] text-sm mt-2 leading-relaxed">
              Continue your learning journey from
              where you stopped.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default LearningSelection;