import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_BASE_URL = "http://localhost:5000";

function ProgressPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState("");

  // LOAD QUIZ HISTORY
  useEffect(() => {
    let cancelled = false;

    async function fetchQuizProgress() {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        if (!cancelled) {
          setError("Student ID not found. Please log in again.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/progress/attempts/${encodeURIComponent(
            studentId
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load quiz progress."
          );
        }

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data.attempts)
            ? data.attempts
            : Array.isArray(data.data)
              ? data.data
              : [];

        if (!cancelled) {
          setAttempts(records);
          setError("");
        }
      } catch (err) {
        console.error("Quiz progress loading error:", err);

        if (!cancelled) {
          setError(
            err.message || "Unable to load quiz progress."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchQuizProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  // LOAD SAVED VIDEO PROGRESS
  useEffect(() => {
    let cancelled = false;

    async function fetchVideoProgress() {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        if (!cancelled) {
          setVideoError(
            "Student ID not found. Please log in again."
          );
          setVideoLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/progress/videos/${encodeURIComponent(
            studentId
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load learning progress."
          );
        }

        if (!cancelled) {
          setVideos(Array.isArray(data) ? data : []);
          setVideoError("");
        }
      } catch (err) {
        console.error("Video progress loading error:", err);

        if (!cancelled) {
          setVideoError(
            err.message || "Unable to load learning progress."
          );
        }
      } finally {
        if (!cancelled) {
          setVideoLoading(false);
        }
      }
    }

    fetchVideoProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  // LEARNING ANALYTICS
  const completedVideos = videos.filter(
    (video) => Number(video.completed) === 1
  ).length;

  const totalTrackedVideos = videos.length;

  const learningProgress =
    totalTrackedVideos > 0
      ? Math.round(
          (completedVideos / totalTrackedVideos) * 100
        )
      : 0;

  // QUIZ ANALYTICS
  const totalAttempts = attempts.length;

  const averageAccuracy =
    totalAttempts > 0
      ? attempts.reduce(
          (sum, item) => sum + Number(item.score ?? 0),
          0
        ) / totalAttempts
      : 0;

  const totalCorrect = attempts.reduce(
    (sum, item) =>
      sum + Number(item.correct_answers ?? 0),
    0
  );

  const totalQuestions = attempts.reduce(
    (sum, item) =>
      sum + Number(item.total_questions ?? 0),
    0
  );

  // CHART DATA: OLDEST ATTEMPT FIRST
  const chartData = [...attempts]
    .sort((a, b) => {
      const dateA = new Date(a.attempted_at).getTime();
      const dateB = new Date(b.attempted_at).getTime();

      if (Number.isNaN(dateA) && Number.isNaN(dateB)) {
        return 0;
      }

      if (Number.isNaN(dateA)) return 1;
      if (Number.isNaN(dateB)) return -1;

      return dateA - dateB;
    })
    .map((attempt, index) => ({
      attempt: `Quiz ${index + 1}`,
      score: Number(attempt.score ?? 0),
      topic: attempt.topic_name || "Quiz",
      attemptedAt: attempt.attempted_at,
    }));

  function formatTime(seconds) {
    const totalSeconds = Math.max(
      0,
      Number(seconds) || 0
    );

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            My Learning Analytics
          </h1>

          <p style={styles.subtitle}>
            Track your video learning, quiz scores, and
            improvement.
          </p>
        </div>

        <Link to="/dashboard" style={styles.backButton}>
          Back to Dashboard
        </Link>
      </header>

      {/* LEARNING ANALYTICS */}
      <section
        style={{
          ...styles.history,
          marginBottom: "24px",
        }}
      >
        <h2 style={styles.sectionTitle}>
          Learning Progress
        </h2>

        {videoLoading ? (
          <div style={styles.message}>
            Loading learning progress...
          </div>
        ) : videoError ? (
          <div style={styles.error}>{videoError}</div>
        ) : (
          <>
            <div style={styles.summaryGrid}>
              <SummaryCard
                label="Videos Completed"
                value={`${completedVideos}/${totalTrackedVideos}`}
                detail="Saved video records"
              />

              <SummaryCard
                label="Overall Learning Progress"
                value={`${learningProgress}%`}
                detail="Percentage of tracked videos completed"
              />
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${learningProgress}%`,
                }}
              />
            </div>

            {totalTrackedVideos === 0 && (
              <p style={styles.cardDetail}>
                Your saved video progress will appear here
                after you start learning.
              </p>
            )}
          </>
        )}
      </section>

      {/* QUIZ ANALYTICS */}
      <section style={{ marginBottom: "24px" }}>
        <h2 style={styles.sectionTitle}>
          Quiz Analytics
        </h2>

        {loading ? (
          <div style={styles.message}>
            Loading quiz progress...
          </div>
        ) : error ? (
          <div style={styles.error}>
            <p>{error}</p>

            <button
              style={styles.primaryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div style={styles.summaryGrid}>
              <SummaryCard
                label="Quiz Attempts"
                value={totalAttempts}
                detail="Saved quiz attempts"
              />

              <SummaryCard
                label="Average Accuracy"
                value={`${averageAccuracy.toFixed(1)}%`}
                detail="Average score across attempts"
              />

              <SummaryCard
                label="Correct Answers"
                value={`${totalCorrect}/${totalQuestions}`}
                detail="Across all saved attempts"
              />
            </div>

            {/* QUIZ SCORE PROGRESS GRAPH */}
            <section
              style={{
                ...styles.history,
                marginBottom: "24px",
              }}
            >
              <h2 style={styles.sectionTitle}>
                Quiz Score Progress
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "-8px",
                  marginBottom: "24px",
                }}
              >
                Track how your scores change across quiz
                attempts.
              </p>

              {chartData.length === 0 ? (
                <div style={styles.message}>
                  Complete a quiz to see your score progress
                  graph here.
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "320px",
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 5,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="attempt"
                        tick={{
                          fill: "#64748b",
                          fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={{
                          stroke: "#cbd5e1",
                        }}
                      />

                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        tickFormatter={(value) =>
                          `${value}%`
                        }
                        tick={{
                          fill: "#64748b",
                          fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}%`,
                          "Score",
                        ]}
                        labelFormatter={(label, payload) => {
                          const point = payload?.[0]?.payload;

                          return point
                            ? `${label} — ${point.topic}`
                            : label;
                        }}
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          boxShadow:
                            "0 3px 12px rgba(15, 23, 42, 0.08)",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Score"
                        stroke="#5b4bdb"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#5b4bdb",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 7,
                          fill: "#5b4bdb",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {/* QUIZ HISTORY */}
            <section style={styles.history}>
              <h2 style={styles.sectionTitle}>
                Quiz History
              </h2>

              {attempts.length === 0 ? (
                <div style={styles.message}>
                  No quiz attempts found yet. Complete a
                  quiz and return here to see your results.
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Subject</th>
                        <th style={styles.th}>Topic</th>
                        <th style={styles.th}>Score</th>
                        <th style={styles.th}>Correct</th>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>
                          Attempted At
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attempts.map((attempt, index) => {
                        const accuracy = Number(
                          attempt.score ?? 0
                        );

                        return (
                          <tr
                            key={
                              attempt.id ??
                              attempt.attempt_id ??
                              `${attempt.attempted_at}-${index}`
                            }
                          >
                            <td style={styles.td}>
                              {attempt.subject_name || "—"}
                            </td>

                            <td style={styles.td}>
                              {attempt.topic_name || "—"}
                            </td>

                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.score,
                                  background:
                                    accuracy >= 80
                                      ? "#dcfce7"
                                      : accuracy >= 50
                                        ? "#fef3c7"
                                        : "#fee2e2",
                                  color:
                                    accuracy >= 80
                                      ? "#166534"
                                      : accuracy >= 50
                                        ? "#92400e"
                                        : "#991b1b",
                                }}
                              >
                                {accuracy.toFixed(1)}%
                              </span>
                            </td>

                            <td style={styles.td}>
                              {Number(
                                attempt.correct_answers ?? 0
                              )}
                              /
                              {Number(
                                attempt.total_questions ?? 0
                              )}
                            </td>

                            <td style={styles.td}>
                              {formatTime(
                                attempt.time_spent_seconds
                              )}
                            </td>

                            <td style={styles.td}>
                              {formatDate(
                                attempt.attempted_at
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, detail }) {
  return (
    <div style={styles.summaryCard}>
      <p style={styles.cardLabel}>{label}</p>
      <h2 style={styles.cardValue}>{value}</h2>
      <p style={styles.cardDetail}>{detail}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f4f6fb",
    color: "#172554",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "32px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },

  backButton: {
    display: "inline-block",
    background: "#4338ca",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    textDecoration: "none",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },

  summaryCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
  },

  cardLabel: {
    color: "#64748b",
    margin: 0,
  },

  cardValue: {
    fontSize: "30px",
    margin: "12px 0",
  },

  cardDetail: {
    color: "#94a3b8",
    margin: 0,
    fontSize: "14px",
  },

  history: {
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  },

  progressTrack: {
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#5b4bdb",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    padding: "14px 12px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  score: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  message: {
    padding: "24px",
    background: "#fff",
    borderRadius: "12px",
    color: "#475569",
  },

  error: {
    padding: "24px",
    background: "#fff1f2",
    color: "#9f1239",
    borderRadius: "12px",
  },

  primaryButton: {
    border: 0,
    background: "#4338ca",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ProgressPage;