
import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Database, ArrowLeft, Sparkles } from "lucide-react";

export default function CodingPractice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-10 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
            <Sparkles size={16} />
            Your Practice Workspace
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Coding Practice
          </h1>

          <p className="mx-auto max-w-xl text-lg text-gray-600">
            Learn by doing. Write code, solve problems, and strengthen your
            programming skills.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <a
            href="http://localhost:3000/codestudio/"
            className="group rounded-3xl border border-indigo-100 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Code2 size={32} />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              CodeStudio
            </h2>

            <p className="mb-6 leading-7 text-gray-600">
              Write and run programs, explore programming languages, and
              practice your coding skills.
            </p>

            <span className="font-semibold text-indigo-600">
              Open CodeStudio →
            </span>
          </a>

          <a
            href="http://localhost:3000/querystudio/"
            className="group rounded-3xl border border-purple-100 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white">
              <Database size={32} />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              QueryStudio
            </h2>

            <p className="mb-6 leading-7 text-gray-600">
              Practice SQL queries and improve your database programming
              skills in your query workspace.
            </p>

            <span className="font-semibold text-purple-600">
              Open QueryStudio →
            </span>
          </a>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Keep practicing. Every problem brings you one step forward.
        </p>
      </div>
    </div>
  );
}
