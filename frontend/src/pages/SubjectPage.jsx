import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SubjectPage() {

  const { subjectName } = useParams();
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-3">
        {subjectName}
      </h1>

      <p className="text-gray-400 mb-10">
        Personalized AI learning experience
      </p>

      <div className="grid grid-cols-2 gap-8">

        {/* Notes */}
        <div
  onClick={() => navigate(`/notes/${subjectName}`)}
  className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 cursor-pointer"
>

  <h2 className="text-3xl font-bold mb-4">
    📘 Notes
  </h2>

  <p className="text-gray-400">
    Access topic-wise smart notes and explanations.
  </p>

</div>
        

        

        {/* Videos */}

        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 cursor-pointer">

          <h2 className="text-3xl font-bold mb-4">
            🎥 Video Lectures
          </h2>

          <p className="text-gray-400">
            Watch AI recommended video lectures.
          </p>

        </div>

        {/* Quiz */}

          <div
            onClick={() => navigate(`/quiz/${subjectName}`)}
            className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 cursor-pointer"
          >
          <h2 className="text-3xl font-bold mb-4">
            🧠 Quiz
          </h2>

          <p className="text-gray-400">
            Practice adaptive quizzes based on performance.
          </p>

        </div>

        {/* Coding */}

        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 cursor-pointer">

          <h2 className="text-3xl font-bold mb-4">
            💻 Coding Practice
          </h2>

          <p className="text-gray-400">
            Solve coding questions directly in browser.
          </p>

        </div>

      </div>

      {/* AI Tutor */}

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl mt-12 shadow-2xl">

        <h2 className="text-4xl font-bold mb-4">
          🤖 AI Tutor
        </h2>

        <p className="text-gray-200 mb-5">
          Ask doubts, generate explanations and get personalized recommendations.
        </p>

        <button
  onClick={() => navigate("/ai-tutor")}
  className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
>
  Open AI Tutor
</button>

      </div>

    </div>

  );
}

export default SubjectPage;