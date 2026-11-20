const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                },
                body: JSON.stringify({
                    model: "nvidia/nemotron-3.5-lightning:free",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are the AI Tutor for Adaptive Minds, an educational learning platform. Explain concepts clearly and completely for college students. Give definitions, important points, examples, and step-by-step explanations when appropriate. Answer the student's actual question directly. Do not respond with safety classifications or metadata. Do not stop in the middle of an explanation."
                        },
                        {
                            role: "user",
                            content: question.trim()
                        }
                    ],
                    temperature: 0.7
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter Error:", data);

            return res.status(response.status).json({
                error: data?.error?.message || "OpenRouter request failed"
            });
        }

        const answer = data?.choices?.[0]?.message?.content;

        if (!answer) {
            return res.status(500).json({
                error: "No answer received from AI"
            });
        }

        res.json({ answer });

    } catch (error) {
        console.error("AI Tutor Error:", error);

        res.status(500).json({
            error: "AI Tutor request failed"
        });
    }
};

module.exports = {
    askAI
};