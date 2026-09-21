import React, { useState } from "react";

function AITutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const currentQuestion = question.trim();

    setLoading(true);
    setError("");
    setQuestion("");

    try {
      // Build previous conversation as context for the AI
      const conversationContext = messages
        .map(
          (message) =>
            `${message.role === "user" ? "Student" : "AI Tutor"}: ${
              message.content
            }`
        )
        .join("\n\n");

      const fullQuestion = conversationContext
        ? `${conversationContext}\n\nStudent: ${currentQuestion}`
        : currentQuestion;

      const response = await fetch(
        "http://localhost:5000/api/ai/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: fullQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "AI Tutor request failed"
        );
      }

      // Add student's question
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "user",
          content: currentQuestion,
        },
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("AI Tutor Error:", error);

      setError(
        "Unable to connect to the AI Tutor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAI();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-400">
            AI Tutor 🤖
          </h1>

          <p className="text-gray-400 mt-2">
            Ask questions, understand concepts, and learn step by step.
          </p>
        </div>

        {/* Chat History */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl mb-6">

          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl mb-2">
                Start a conversation with your AI Tutor
              </p>

              <p className="text-sm">
                Ask a question about your subject.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >

                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[80%] bg-indigo-600 rounded-2xl px-5 py-4"
                        : "max-w-[80%] bg-slate-800 rounded-2xl px-5 py-4"
                    }
                  >

                    <div className="text-sm font-semibold mb-2">
                      {message.role === "user"
                        ? "You"
                        : "AI Tutor"}
                    </div>

                    <div className="text-gray-100 whitespace-pre-wrap leading-7">
                      {message.content}
                    </div>

                  </div>

                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-5 py-4">
                    <div className="text-sm font-semibold mb-2">
                      AI Tutor
                    </div>

                    <div className="text-gray-400">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 mb-4">
            {error}
          </p>
        )}

        {/* Question Input */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl">

          <label className="block text-lg font-semibold mb-3">
            Ask your question
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: Explain INNER JOIN in DBMS with an example."
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />

          <div className="flex justify-between items-center mt-4">

            <p className="text-sm text-gray-500">
              Press Enter to send • Shift + Enter for a new line
            </p>

            <button
              onClick={askAI}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 px-6 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AITutor;