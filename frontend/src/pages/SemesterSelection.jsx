import React from "react";
import { useNavigate } from "react-router-dom";

function SemesterSelection() {
  const navigate = useNavigate();

  const selectSemester = (semester) => {
    localStorage.setItem("semester", semester);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#DDD7FF] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-40 -right-32 w-[420px] h-[420px] bg-[#E5E0FF] rounded-full blur-3xl opacity-70"></div>

      <div className="relative w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5B4BDB] to-[#7C6FF2] flex items-center justify-center text-2xl shadow-lg shadow-[#5B4BDB]/20">
              🧠
            </div>

            <div className="text-left">
              <h1 className="text-xl font-bold text-[#172554]">
                Adaptive Minds
              </h1>

              <p className="text-xs text-[#64748B]">
                Learn • Practice • Improve
              </p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#172554]">
            Choose Your Semester
          </h2>

          <p className="text-[#64748B] mt-3 text-lg">
            Select your semester to personalize your learning journey.
          </p>

        </div>

        {/* Semester cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

          {/* Semester 3 */}
          <div
            onClick={() => selectSemester("Semester 3")}
            className="group bg-white border border-[#E7E5F5] rounded-[28px] p-8 cursor-pointer shadow-[0_15px_40px_rgba(79,70,229,0.08)] hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(79,70,229,0.15)] transition-all duration-300"
          >

            <div className="flex items-start justify-between mb-8">

              <div className="w-16 h-16 rounded-2xl bg-[#EEEBFF] flex items-center justify-center text-3xl">
                📚
              </div>

              <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#5B4BDB] group-hover:bg-[#5B4BDB] group-hover:text-white transition">
                →
              </div>

            </div>

            <p className="text-sm font-semibold text-[#7C6FF2] mb-2">
              SEMESTER 03
            </p>

            <h3 className="text-3xl font-bold text-[#172554] mb-4">
              Semester 3
            </h3>

            <p className="text-[#64748B] leading-relaxed">
              Data Structures, DBMS, OOP with Java, Operating Systems
            </p>

            <div className="mt-7 flex items-center gap-2 text-sm text-[#94A3B8]">
              <span>🎯</span>
              <span>Build your core CS foundation</span>
            </div>

          </div>

          {/* Semester 4 */}
          <div
            onClick={() => selectSemester("Semester 4")}
            className="group bg-white border border-[#E7E5F5] rounded-[28px] p-8 cursor-pointer shadow-[0_15px_40px_rgba(79,70,229,0.08)] hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(79,70,229,0.15)] transition-all duration-300"
          >

            <div className="flex items-start justify-between mb-8">

              <div className="w-16 h-16 rounded-2xl bg-[#E9F2FF] flex items-center justify-center text-3xl">
                🚀
              </div>

              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition">
                →
              </div>

            </div>

            <p className="text-sm font-semibold text-[#4F46E5] mb-2">
              SEMESTER 04
            </p>

            <h3 className="text-3xl font-bold text-[#172554] mb-4">
              Semester 4
            </h3>

            <p className="text-[#64748B] leading-relaxed">
              Algorithms, Biology for Computer Engineers, Microcontrollers, Digital Design and Computer Organization
            </p>

            <div className="mt-7 flex items-center gap-2 text-sm text-[#94A3B8]">
              <span>💡</span>
              <span>Strengthen your technical skills</span>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#94A3B8]">
            🧠 Your personalized learning path starts here
          </p>
        </div>

      </div>
    </div>
  );
}

export default SemesterSelection;