import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const semester = localStorage.getItem("semester");

  const subjects =
    semester === "Semester 3"
      ? [
          "Data Structures",
          "DBMS",
          "Discrete Mathematics",
          "Digital Electronics"
        ]
      : [
          "Operating Systems",
          "Computer Networks",
          "Analysis of Algorithms",
          "Software Engineering"
        ];

  return (

    <div className="min-h-screen flex bg-slate-950 text-white">

      {/* Sidebar */}

      <div className="w-[260px] bg-slate-900 p-6 flex flex-col justify-between border-r border-slate-800">

        <div>

          <h1 className="text-3xl font-bold text-indigo-400 mb-12">
            Adaptive Minds
          </h1>

          <ul className="space-y-6 text-lg">

            <li className="hover:text-indigo-400 cursor-pointer">
              Dashboard
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Subjects
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Coding Practice
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              AI Tutor
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Analytics
            </li>

          </ul>

        </div>

        <div className="text-gray-400 text-sm">
          AI Based Learning Platform
        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-10 overflow-y-auto">

        <h1 className="text-5xl font-bold mb-3">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 mb-10">
          {semester} Personalized Learning Dashboard
        </p>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-slate-900 p-6 rounded-3xl shadow-lg">

            <h2 className="text-gray-400 mb-2">
              Overall Progress
            </h2>

            <p className="text-4xl font-bold text-indigo-400">
              72%
            </p>

          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-lg">

            <h2 className="text-gray-400 mb-2">
              Coding Problems
            </h2>

            <p className="text-4xl font-bold text-green-400">
              24
            </p>

          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-lg">

            <h2 className="text-gray-400 mb-2">
              AI Recommendations
            </h2>

            <p className="text-4xl font-bold text-pink-400">
              12
            </p>

          </div>

        </div>

        {/* Subjects */}

        <h2 className="text-3xl font-bold mb-6">
          Your Subjects
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-12">

          {subjects.map((subject, index) => (

            <div
              key={index}
              onClick={() => navigate(`/subject/${subject}`)}
              className="bg-slate-900 p-6 rounded-3xl shadow-xl hover:scale-105 transition duration-300 cursor-pointer"
            >

              <h3 className="text-2xl font-bold mb-4">
                {subject}
              </h3>

              <div className="w-full bg-slate-700 h-3 rounded-full mb-3">

                <div className="bg-indigo-500 h-3 rounded-full w-[70%]"></div>

              </div>

              <p className="text-gray-400">
                70% Completed
              </p>

            </div>

          ))}

        </div>

        {/* AI Tutor */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-3">
            AI Tutor Assistant 🤖
          </h2>

          <p className="text-gray-200 mb-5">
            Ask doubts, generate explanations, and get adaptive recommendations instantly.
          </p>

          <button
  onClick={() => navigate("/ai-tutor")}
  className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
>
  Open AI Tutor
</button>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;