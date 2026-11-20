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
        <div className="min-h-screen bg-[#F7F8FF] text-[#172554]">

            {/* Header */}
            <header className="bg-white border-b border-indigo-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-md">
                            🤖
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-[#172554]">
                                AI Tutor
                            </h1>

                            <p className="text-xs text-slate-500">
                                Your personal learning assistant
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                        ← Back
                    </button>

                </div>
            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-6 py-8">

                {/* Intro */}
                <div className="mb-7">

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold mb-3">
                        ✨ AI Powered Learning
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-[#172554]">
                        Learn smarter with your AI Tutor
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Ask questions, understand concepts, and learn step by step.
                    </p>

                </div>

                {/* Chat */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">

                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">

                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                            🤖
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800">
                                Adaptive Minds AI
                            </h3>

                            <p className="text-xs text-green-600 font-medium">
                                ● Ready to help
                            </p>
                        </div>

                    </div>

                    <div className="p-6 min-h-[300px] max-h-[520px] overflow-y-auto">

                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16">

                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-4xl mb-5">
                                    🤖
                                </div>

                                <h3 className="text-xl font-bold text-slate-800">
                                    Start a conversation
                                </h3>

                                <p className="text-sm text-slate-500 mt-2 max-w-md">
                                    Ask me anything about your subjects, programming,
                                    DSA, DBMS, operating systems, or other concepts.
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
                                                    ? "max-w-[82%] bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl rounded-br-md px-5 py-4 shadow-sm"
                                                    : "max-w-[82%] bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md px-5 py-4"
                                            }
                                        >

                                            <div
                                                className={
                                                    message.role === "user"
                                                        ? "text-xs font-bold mb-2 text-purple-100"
                                                        : "text-xs font-bold mb-2 text-purple-600"
                                                }
                                            >
                                                {message.role === "user"
                                                    ? "You"
                                                    : "AI Tutor"}
                                            </div>

                                            <div
                                                className={
                                                    message.role === "user"
                                                        ? "whitespace-pre-wrap leading-7 text-sm"
                                                        : "whitespace-pre-wrap leading-7 text-sm text-slate-700"
                                                }
                                            >
                                                {message.content}
                                            </div>

                                        </div>

                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">

                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-md px-5 py-4">

                                            <div className="text-xs font-bold text-purple-600 mb-2">
                                                AI Tutor
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="animate-pulse">
                                                    Thinking...
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Input */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        Ask your question
                    </label>

                    <textarea
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Example: Explain INNER JOIN in DBMS with an example."
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none"
                    />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">

                        <p className="text-xs text-slate-400">
                            Press Enter to send • Shift + Enter for a new line
                        </p>

                        <button
                            onClick={askAI}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? "Thinking..." : "Send ✨"}
                        </button>

                    </div>

                </div>

                {/* Suggested Questions */}
                <div className="mt-6">

                    <p className="text-sm font-semibold text-slate-600 mb-3">
                        Try asking
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {[
                            "Explain process scheduling",
                            "What is a binary tree?",
                            "Explain SQL joins",
                            "What is normalization in DBMS?"
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setQuestion(suggestion)}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition"
                            >
                                {suggestion}
                            </button>
                        ))}

                    </div>

                </div>

            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-xs text-slate-400">
                Adaptive Minds • AI-powered personalized learning
            </footer>

        </div>
    );
}

export default AITutor;