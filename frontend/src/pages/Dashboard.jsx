import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const semester =
    localStorage.getItem("semester") ||
    "Semester 7";

  // =========================================================
  // CURRENT LEARNING
  // =========================================================

  const currentSubject =
    localStorage.getItem("currentSubject") ||
    "Data Structures";

  const currentTopic =
    localStorage.getItem("currentTopic") ||
    "Arrays";

  const currentLevel =
    localStorage.getItem("recommendedLevel") ||
    "Medium";

  const topicProgress = Number(
    localStorage.getItem(
      `learningProgress_${currentTopic}`
    ) || 0
  );

  // =========================================================
  // TOPIC COMPLETION
  // =========================================================

  const allTopics = [
    "Arrays",
    "Linked List",
    "Stack",
    "Queue",
    "Trees",
    "Graphs",
  ];

  // Keep every topic that has been marked completed in localStorage.
  const completedTopics = allTopics.filter(
    (topic) =>
      localStorage.getItem(`topicCompleted_${topic}`) === "true"
  );

  // Check whether the currently selected topic is completed.
  const topicCompleted =
    localStorage.getItem(
      `topicCompleted_${currentTopic}`
    ) === "true";


  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#172554]">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="w-[270px] bg-white border-r border-[#E8E7F2] p-6 flex flex-col justify-between fixed left-0 top-0 bottom-0 shadow-[4px_0_25px_rgba(79,70,229,0.04)] z-20">

        <div>

          {/* LOGO */}

          <div className="mb-10 px-2">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5B4BDB] to-[#7C6FF2] flex items-center justify-center text-xl shadow-lg shadow-[#5B4BDB]/20">
                🧠
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#172554]">
                  Adaptive Minds
                </h1>

                <p className="text-[11px] text-[#64748B]">
                  AI Powered Learning
                </p>
              </div>

            </div>

          </div>


          {/* NAVIGATION */}

          <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-3">
            Workspace
          </p>

          <nav className="space-y-2">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="w-full text-left px-4 py-3.5 rounded-2xl bg-[#EEEBFF] text-[#5B4BDB] font-semibold flex items-center gap-3"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>


            <button
              onClick={() =>
                navigate("/learning")
              }
              className="w-full text-left px-4 py-3.5 rounded-2xl text-[#64748B] hover:bg-[#F5F3FF] hover:text-[#5B4BDB] transition flex items-center gap-3"
            >
              <span>📚</span>
              <span>Start New Learning</span>
            </button>


            <button
              className="w-full text-left px-4 py-3.5 rounded-2xl text-[#64748B] hover:bg-[#F5F3FF] hover:text-[#5B4BDB] transition flex items-center gap-3"
            >
              <span>💻</span>
              <span>Coding Practice</span>
            </button>


            {/* AI TUTOR */}

            <button
              onClick={() =>
                navigate("/ai-tutor")
              }
              className="w-full text-left px-4 py-3.5 rounded-2xl text-[#64748B] hover:bg-[#F5F3FF] hover:text-[#5B4BDB] transition flex items-center gap-3"
            >
              <span>🤖</span>
              <span>AI Tutor</span>
            </button>


            
<button
  onClick={() => navigate("/progress")}
  className="w-full text-left px-4 py-3.5 rounded-2xl text-[#64748B] hover:bg-[#F5F3FF] hover:text-[#5B4BDB] transition flex items-center gap-3"
>
  <span>📊</span>
  <span>Analytics</span>
</button>


          </nav>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="bg-[#F8F7FF] border border-[#E9E7F5] rounded-2xl p-4">

          <p className="text-[#94A3B8] text-xs font-medium">
            CURRENT SEMESTER
          </p>

          <div className="flex items-center gap-2 mt-2">

            <div className="w-8 h-8 rounded-lg bg-[#EEEBFF] flex items-center justify-center">
              🎓
            </div>

            <p className="text-[#334155] font-semibold">
              {semester}
            </p>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="ml-[270px] min-h-screen p-7 md:p-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-center justify-between mb-9">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <span className="px-3 py-1 rounded-full bg-[#EEEBFF] text-[#5B4BDB] text-xs font-bold">
                {semester}
              </span>

            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Welcome Back 👋
            </h1>

            <p className="text-[#64748B] mt-2">
              Continue your personalized learning journey.
            </p>

          </div>


          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E4EF] shadow-sm flex items-center justify-center text-xl">
            👤
          </div>

        </div>


        {/* ===================================================
            STATS
        =================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9">


          {/* COMPLETED */}

          <div className="bg-white border border-[#E8E7F2] rounded-2xl p-6 shadow-[0_10px_30px_rgba(16,185,129,0.04)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[#64748B] text-sm">
                  Topics Completed
                </p>

                <p className="text-3xl font-bold text-[#10B981] mt-2">
                  {completedTopics.length}
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-xl">
                ✓
              </div>

            </div>

            <p className="text-[#94A3B8] text-xs mt-5">
              Keep going
            </p>

          </div>


          {/* LEVEL */}

          <div className="bg-white border border-[#E8E7F2] rounded-2xl p-6 shadow-[0_10px_30px_rgba(124,111,242,0.05)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[#64748B] text-sm">
                  Current Level
                </p>

                <p className="text-3xl font-bold text-[#7C3AED] mt-2">
                  {currentLevel}
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-xl">
                🎯
              </div>

            </div>

            <p className="text-[#94A3B8] text-xs mt-5">
              Based on your assessment
            </p>

          </div>

        </div>


        {/* ===================================================
            CONTINUE LEARNING
        =================================================== */}

        {!topicCompleted && (

          <section className="mb-10">

            <div className="flex items-end justify-between mb-5">

              <div>

                <h2 className="text-2xl font-bold">
                  Continue Learning
                </h2>

                <p className="text-[#64748B] mt-1">
                  Pick up where you left off.
                </p>

              </div>

              <span className="text-sm text-[#94A3B8]">
                Your current path
              </span>

            </div>


            <div className="bg-gradient-to-br from-[#5B4BDB] via-[#6959E5] to-[#8B7CF6] rounded-[28px] p-7 md:p-8 text-white shadow-[0_20px_45px_rgba(91,75,219,0.22)]">

              <div className="flex flex-col md:flex-row justify-between gap-6">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="px-3 py-1 rounded-full bg-white/15 text-white/80 text-xs font-semibold">
                      CURRENT LEARNING
                    </span>

                  </div>

                  <h2 className="text-3xl font-bold mt-4">
                    {currentSubject}
                  </h2>

                  <p className="text-xl text-white/80 mt-1">
                    {currentTopic}
                  </p>

                </div>


                <div className="bg-white/12 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl h-fit">

                  <p className="text-xs text-white/60">
                    AI RECOMMENDED LEVEL
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {currentLevel}
                  </p>

                </div>

              </div>


              {/* PROGRESS */}

              <div className="mt-8">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-white/80">
                    Learning Progress
                  </span>

                  <span className="font-semibold">
                    {topicProgress}%
                  </span>

                </div>

                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">

                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${topicProgress}%`,
                    }}
                  />

                </div>

              </div>


              {/* ACTION */}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-7">

                <p className="text-white/75 text-sm">
                  🎥 Continue your personalized learning resources
                </p>

                <button
                  onClick={() =>
                    navigate("/learning-page")
                  }
                  className="bg-white text-[#5B4BDB] px-6 py-3 rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Continue Learning →
                </button>

              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            COMPLETED TOPIC
        =================================================== */}

        {topicCompleted && (

          <section className="mb-10">

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-[28px] p-8">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[#059669] text-sm font-bold">
                    LEARNING COMPLETED
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-[#14532D]">
                    {currentTopic}
                  </h2>

                  <p className="text-[#4B5563] mt-2">
                    You successfully completed this topic
                    and passed the final confirmation test.
                  </p>

                </div>

                <div className="text-5xl">
                  🎉
                </div>

              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            COMPLETED TOPICS
        =================================================== */}

        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Completed Topics
            </h2>

            <p className="text-[#64748B] mt-1">
              Topics you've successfully finished.
            </p>

          </div>


          {completedTopics.length === 0 ? (

            <div className="bg-white border border-[#E8E7F2] rounded-2xl p-6">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  📚
                </div>

                <div>

                  <p className="font-semibold text-[#334155]">
                    No topics completed yet
                  </p>

                  <p className="text-[#94A3B8] text-sm mt-1">
                    Complete your current learning path to see it here.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {completedTopics.map(
                (topic) => (

                  <div
                    key={topic}
                    className="bg-white border border-[#BBF7D0] rounded-2xl p-6 shadow-sm"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981] font-bold">
                        ✓
                      </div>

                      <div>

                        <h3 className="font-bold text-lg">
                          {topic}
                        </h3>

                        <p className="text-[#64748B] text-sm">
                          Topic completed
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ===================================================
            START NEW LEARNING
        =================================================== */}

        <section className="bg-white border border-[#E8E7F2] rounded-[28px] p-7 md:p-8 mb-10 shadow-sm">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

            <div>

              <div className="w-11 h-11 rounded-xl bg-[#EEEBFF] flex items-center justify-center text-xl mb-4">
                🚀
              </div>

              <h2 className="text-2xl font-bold">
                Want to start something new?
              </h2>

              <p className="text-[#64748B] mt-2">
                Choose another learning path and begin a new assessment.
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/learning")
              }
              className="bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] hover:from-[#4F46C5] hover:to-[#6D5CE7] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#5B4BDB]/20 transition"
            >
              Choose Learning Path →
            </button>

          </div>

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="border-t border-[#E5E7EF] pt-7 pb-4">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

            <div>

              <h3 className="text-lg font-bold text-[#5B4BDB]">
                Adaptive Minds
              </h3>

              <p className="text-[#94A3B8] text-sm mt-1">
                AI-powered personalized learning platform
              </p>

            </div>

            <p className="text-[#94A3B8] text-sm">
              Learn • Practice • Improve
            </p>

          </div>

          <p className="text-[#CBD5E1] text-xs mt-5">
            © 2026 Adaptive Minds. All rights reserved.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;