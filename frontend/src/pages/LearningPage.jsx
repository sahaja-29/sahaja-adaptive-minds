
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

// =========================================================
// YOUTUBE HELPERS
// =========================================================
function getYouTubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    ) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }
    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com" ||
      hostname === "www.youtube-nocookie.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }
      const match = parsedUrl.pathname.match(
        /\/(?:embed|shorts|live)\/([^/?]+)/
      );
      return match ? match[1] : null;
    }
  } catch {
    return null;
  }
  return null;
}

// =========================================================
// LOAD YOUTUBE IFRAME PLAYER API ONCE
// =========================================================
let youtubeApiPromise = null;

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }
  youtubeApiPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === "function") {
        previousCallback();
      }
      resolve(window.YT);
    };
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        youtubeApiPromise = null;
        reject(new Error("Could not load the YouTube player API."));
      };
      document.head.appendChild(script);
    }
  });
  return youtubeApiPromise;
}

// =========================================================
// EMBEDDED YOUTUBE PLAYER
// =========================================================
function YouTubePlayer({
  videoId,
  title,
  locked,
  completed,
  onComplete,
  onWatchTime,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const onWatchTimeRef = useRef(onWatchTime);
  const completedRef = useRef(completed);
  const [playerError, setPlayerError] = useState("");

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onWatchTimeRef.current = onWatchTime;
    completedRef.current = completed;
  }, [onComplete, onWatchTime, completed]);

  useEffect(() => {
    let cancelled = false;
    let player = null;
    let trackingInterval = null;
    let lastTick = null;
    let watchedSeconds = 0;
    let completionSent = false;

    setPlayerError("");
    if (!videoId || locked) return undefined;

    const stopTracking = () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
      }
      lastTick = null;
    };

    const startTracking = () => {
      if (trackingInterval) return;
      lastTick = Date.now();

      trackingInterval = setInterval(() => {
        if (!player || cancelled) return;
        try {
          if (player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
            lastTick = null;
            return;
          }
          const now = Date.now();
          if (lastTick !== null) {
            const elapsed = Math.min((now - lastTick) / 1000, 6);
            if (elapsed > 0) {
              watchedSeconds += elapsed;
              onWatchTimeRef.current?.(
                videoId,
                watchedSeconds,
                player.getDuration()
              );
            }
          }
          lastTick = now;
        } catch (error) {
          console.error("Watch tracking error:", error);
          lastTick = null;
        }
      }, 5000);
    };

    async function initializePlayer() {
      try {
        await loadYouTubeAPI();
        if (cancelled || !containerRef.current) return;

        player = new window.YT.Player(containerRef.current, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                setPlayerError("");
                console.log("YouTube player ready:", videoId);
              }
            },
            onStateChange: (event) => {
              if (cancelled) return;
              console.log(
                "YOUTUBE PLAYER STATE:",
                event.data,
                "VIDEO:",
                videoId
              );

              if (event.data === window.YT.PlayerState.PLAYING) {
                startTracking();
              } else {
                stopTracking();
              }

              if (
                event.data === window.YT.PlayerState.ENDED &&
                !completionSent
              ) {
                completionSent = true;
                completedRef.current = true;
                console.log("VIDEO ENDED:", videoId);
                onCompleteRef.current?.(videoId, {
                  title,
                  url: `https://www.youtube.com/watch?v=${videoId}`,
                });
              }
            },
            onError: (event) => {
              if (cancelled) return;
              stopTracking();
              const messages = {
                2: "This video has an invalid video ID.",
                5: "This video cannot be played in the embedded player.",
                100: "This video is unavailable.",
                101: "The video owner does not allow embedded playback.",
                150: "The video owner does not allow embedded playback.",
                153: "YouTube could not verify the player request. Try reloading the page.",
              };
              setPlayerError(
                messages[event.data] ||
                  "This video could not be played. Try another resource."
              );
              console.error("YouTube player error:", event.data, videoId);
            },
          },
        });
        playerRef.current = player;
      } catch (error) {
        if (!cancelled) {
          console.error("YouTube initialization failed:", error);
          setPlayerError(
            "Unable to load the YouTube player. Check your internet connection and reload."
          );
        }
      }
    }

    initializePlayer();

    return () => {
      cancelled = true;
      stopTracking();
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.warn("Player cleanup:", error);
        }
      }
      if (playerRef.current === player) playerRef.current = null;
    };
  }, [videoId, locked, title]);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-[#F1F5F9] flex items-center justify-center p-6 text-center">
        <p className="text-sm text-[#64748B]">
          A valid YouTube video URL was not provided.
        </p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="w-full aspect-video bg-[#EEF0F6] flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🔒</span>
        <p className="font-semibold text-[#64748B]">
          Complete the previous lesson to unlock this video.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          title={title || "Learning video"}
        />
      </div>
      {playerError && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3">
          <p className="text-sm text-[#92400E]">⚠️ {playerError}</p>
        </div>
      )}
      <p className="text-xs text-[#64748B] mt-2">
        Video playback is provided by YouTube.
      </p>
    </div>
  );
}

function LearningPage() {
  const navigate = useNavigate();
  const subject =
    localStorage.getItem("currentSubject") ||
    "Data Structures";
  const topic =
    localStorage.getItem("currentTopic") ||
    "Arrays";
  const level =
    localStorage.getItem("recommendedLevel") ||
    "Medium";
  const topicId =
    localStorage.getItem("currentTopicId") || topic;
  const studentId = localStorage.getItem("studentId");
  const progressKey = `learningProgress_${topicId}`;
  const completedKey = `completedVideos_${topicId}`;
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoError, setVideoError] = useState("");
  const [completedVideos, setCompletedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem(completedKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const watchedSecondsKey = `watchedSeconds_${topicId}`;
  const [watchedSeconds, setWatchedSeconds] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(watchedSecondsKey) || "{}"
      );
    } catch {
      return {};
    }
  });
  const [videoDurations, setVideoDurations] = useState({});

  // Restore saved video progress from MySQL.
  useEffect(() => {
    const numericStudentId = Number(studentId);
    if (
      !Number.isInteger(numericStudentId) ||
      numericStudentId <= 0
    ) {
      return;
    }

    let cancelled = false;

    async function loadSavedVideoProgress() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/progress/videos/${numericStudentId}`
        );
        if (!response.ok) {
          throw new Error("Could not load saved video progress.");
        }

        const records = await response.json();
        if (cancelled || !Array.isArray(records)) return;

        const matchingRecords = records.filter(
          (record) =>
            record.subject_name === subject &&
            record.topic_name === topic
        );
        const savedSeconds = {};
        const savedDurations = {};

        matchingRecords.forEach((record) => {
          const id = String(record.video_id);
          savedSeconds[id] = Math.max(
            savedSeconds[id] || 0,
            Number(record.watched_seconds) || 0
          );
          savedDurations[id] = Math.max(
            savedDurations[id] || 0,
            Number(record.duration_seconds) || 0
          );
        });

        setWatchedSeconds((previous) => {
          const merged = { ...previous };
          Object.entries(savedSeconds).forEach(([id, seconds]) => {
            merged[id] = Math.max(
              Number(merged[id]) || 0,
              seconds
            );
          });
          localStorage.setItem(
            watchedSecondsKey,
            JSON.stringify(merged)
          );
          return merged;
        });

        setVideoDurations((previous) => ({
          ...previous,
          ...savedDurations,
        }));

        const savedIds = matchingRecords
          .filter(
            (record) =>
              record.completed === true ||
              Number(record.completed) === 1
          )
          .map((record) => String(record.video_id));

        setCompletedVideos((previous) => [
          ...new Set([
            ...previous.map(String),
            ...savedIds,
          ]),
        ]);
      } catch (error) {
        console.error(
          "Error loading saved video progress:",
          error
        );
      }
    }

    loadSavedVideoProgress();
    return () => {
      cancelled = true;
    };
  }, [studentId, subject, topic, watchedSecondsKey]);

  // =========================================================
  // LOAD RECOMMENDATIONS
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      setLoadingVideos(true);
      setVideoError("");
      try {
        const response = await fetch(
          "http://localhost:5000/api/recommend",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject,
              topic,
              difficulty: level,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to load recommendations.");
        }

        const data = await response.json();
        if (!cancelled) {
          setVideos(
            (data.recommendations || []).slice(0, 6)
          );
        }
      } catch (error) {
        console.error(
          "Learning Page Recommendation Error:",
          error
        );
        if (!cancelled) {
          setVideoError(
            "Unable to load recommended learning resources."
          );
          setVideos([]);
        }
      } finally {
        if (!cancelled) setLoadingVideos(false);
      }
    }

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [subject, topic, level]);

  // Save completed videos locally.
  useEffect(() => {
    localStorage.setItem(
      completedKey,
      JSON.stringify(completedVideos)
    );
  }, [completedVideos, completedKey]);

  // Overall progress is based on completed recommendations.
  
const totalVideos = videos.length;

const completedCount = videos.filter((video) =>
  completedVideos.includes(
    video.videoId || video.video_id || video.id
  )
).length;

const progress =
  totalVideos > 0
    ? Math.round((completedCount / totalVideos) * 100)
    : 0;


  const allVideosCompleted =
    totalVideos > 0 &&
    videos.every((video) =>
      completedVideos.includes(
        String(video.videoId || video.id)
      )
    );

  const hasCompletedAnyVideo = videos.some((video) =>
    completedVideos.includes(
      String(video.videoId || video.id)
    )
  );

  useEffect(() => {
    localStorage.setItem(progressKey, String(progress));
  }, [progress, progressKey]);

  // =========================================================
  // MARK A VIDEO COMPLETE
  // =========================================================
  const markVideoComplete = useCallback(
    async (videoId, videoDetails) => {
      const normalizedId = String(videoId);

      setCompletedVideos((previous) => {
        const normalizedPrevious = previous.map(String);
        if (normalizedPrevious.includes(normalizedId)) {
          return previous;
        }
        return [...normalizedPrevious, normalizedId];
      });

      const numericStudentId = Number(studentId);
      if (
        !Number.isInteger(numericStudentId) ||
        numericStudentId <= 0
      ) {
        console.warn(
          "Video completion was saved locally, but studentId is missing or invalid."
        );
        return;
      }

console.log("COMPLETION PROGRESS:", {
  videoId: normalizedId,
  watchedSeconds: watchedSeconds[normalizedId],
  durationSeconds: videoDurations[normalizedId],
});

      try {
        const response = await fetch(
          "http://localhost:5000/api/progress/videos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_id: numericStudentId,
              subject_name: subject,
              topic_name: topic,
              video_id: normalizedId,
              video_title: videoDetails?.title || null,
              video_url: videoDetails?.url || null,
              watched_seconds: Math.floor(
  Number(watchedSeconds[normalizedId] || 0)
),
duration_seconds: Math.floor(
  Number(videoDurations[normalizedId] || 0)
),
              completed: true,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Could not save video progress."
          );
        }

        console.log(
          "Video completion saved to MySQL:",
          normalizedId
        );
      } catch (error) {
        console.error("Error saving video completion:", error);
      }
    },
    [
      studentId,
      subject,
      topic,
      watchedSeconds,
      videoDurations,
    ]
  );

  // =========================================================
  // TRACK PLAYBACK TIME
  // =========================================================
  const handleWatchTime = useCallback(
    (videoId, seconds, duration) => {
      const id = String(videoId);
      const currentSeconds = Math.max(0, Math.floor(seconds));
      const currentDuration = Math.max(
        0,
        Math.floor(duration || 0)
      );

      setWatchedSeconds((previous) => {
        const updated = {
          ...previous,
          [id]: Math.max(
            Number(previous[id]) || 0,
            currentSeconds
          ),
        };
        localStorage.setItem(
          watchedSecondsKey,
          JSON.stringify(updated)
        );
        return updated;
      });

      if (currentDuration > 0) {
        setVideoDurations((previous) => ({
          ...previous,
          [id]: currentDuration,
        }));
      }

      const numericStudentId = Number(studentId);
      if (
        !Number.isInteger(numericStudentId) ||
        numericStudentId <= 0 ||
        currentDuration <= 0
      ) {
        return;
      }

      const video = videos.find(
        (item) => String(item.videoId || item.id) === id
      );

      fetch("http://localhost:5000/api/progress/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: numericStudentId,
          subject_name: subject,
          topic_name: topic,
          video_id: id,
          video_title: video?.title || null,
          video_url:
            video?.url ||
            `https://www.youtube.com/watch?v=${id}`,
          watched_seconds: currentSeconds,
          duration_seconds: currentDuration,
          completed: completedVideos
            .map(String)
            .includes(id),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save video watch progress.");
          }
        })
        .catch((error) => {
          console.error(
            "Error saving video watch progress:",
            error
          );
        });
    },
    [
      watchedSecondsKey,
      studentId,
      subject,
      topic,
      videos,
      completedVideos,
    ]
  );

  // =========================================================
  // LEVEL MESSAGE
  // =========================================================
  const getLevelMessage = () => {
    if (level === "Hard") {
      return "Your assessment shows strong understanding. The learning path includes challenging resources to deepen your knowledge.";
    }
    if (level === "Easy") {
      return "Your assessment indicates that strengthening the fundamentals will help build a stronger foundation.";
    }
    return "Your assessment indicates that you should continue building your understanding through structured practice.";
  };

  // The main page UI follows in Part 3.

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#172554]">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-[#E8E7F2] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
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
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2.5 rounded-xl bg-[#F3F1FF] text-[#5B4BDB] font-semibold text-sm hover:bg-[#E9E6FF] transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-6">
          <span>{subject}</span>
          <span>/</span>
          <span className="text-[#5B4BDB] font-medium">
            {topic}
          </span>
        </div>

        {/* TITLE */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEEBFF] text-[#5B4BDB] text-xs font-bold mb-4">
              📚 CURRENT LEARNING
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#172554]">
              {topic}
            </h1>
            <p className="text-[#64748B] mt-3 text-lg">
              {subject} • Personalized learning path
            </p>
          </div>
          <div className="bg-white border border-[#E7E5F5] rounded-2xl px-6 py-5 shadow-[0_10px_30px_rgba(79,70,229,0.06)]">
            <p className="text-[#7C6FF2] text-xs font-bold tracking-wide">
              AI RECOMMENDED LEVEL
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-[#EEEBFF] flex items-center justify-center">
                🤖
              </div>
              <p className="text-2xl font-bold text-[#172554]">
                {level}
              </p>
            </div>
          </div>
        </div>

        {/* LEARNING PROGRESS */}
        <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-6 md:p-7 mb-9 shadow-[0_12px_35px_rgba(79,70,229,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EEEBFF] flex items-center justify-center">
                  📈
                </div>
                <h2 className="font-bold text-lg">
                  Learning Progress
                </h2>
              </div>
              <p className="text-[#64748B] text-sm mt-2">
                Watch each recommended video until it ends to
                complete the lesson.
              </p>
            </div>
            <div className="text-3xl font-bold text-[#5B4BDB]">
              {progress}%
            </div>
          </div>

          <div className="w-full bg-[#EEF0F6] h-3 rounded-full overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-[#5B4BDB] to-[#8B7CF6] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 gap-3">
            <p className="text-[#94A3B8] text-sm">
              {completedCount} of {totalVideos} resources completed
            </p>
            {allVideosCompleted && (
              <span className="text-[#059669] text-sm font-semibold">
                ✓ Learning complete
              </span>
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F1FF] flex items-center justify-center text-2xl">
            🎥
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#172554]">
              Recommended Learning
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Personalized videos selected for{" "}
              <strong className="text-[#334155]">{topic}</strong>
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loadingVideos && (
          <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EEEBFF] flex items-center justify-center text-3xl mb-5">
              🔎
            </div>
            <h3 className="text-xl font-bold text-[#172554]">
              Finding your learning resources...
            </h3>
            <p className="text-[#64748B] mt-2">
              Matching videos to your {level} learning level.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loadingVideos && videoError && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6">
            <p className="text-[#B45309] font-semibold">
              ⚠️ Recommendations unavailable
            </p>
            <p className="text-[#64748B] text-sm mt-2">
              {videoError}
            </p>
          </div>
        )}

        {/* NO VIDEOS */}
        {!loadingVideos &&
          !videoError &&
          videos.length === 0 && (
            <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F1F5F9] flex items-center justify-center text-3xl mb-4">
                📚
              </div>
              <h3 className="font-bold text-xl">
                No learning resources found
              </h3>
              <p className="text-[#64748B] mt-2">
                No matching videos were returned for this topic.
              </p>
            </div>
          )}

        {/* VIDEO CARDS */}
        {!loadingVideos && videos.length > 0 && (
          <div className="space-y-5">
            {videos.map((video, index) => {
              const rawVideoId = video.videoId || video.id;
              const videoId =
                rawVideoId != null ? String(rawVideoId) : "";
              const youtubeId = getYouTubeVideoId(video.url);
              const completed = completedVideos
                .map(String)
                .includes(videoId);

              // All recommended videos remain unlocked.
              const locked = false;

              const watchPercentage = completed
                ? 100
                : videoDurations[videoId] > 0
                  ? Math.min(
                      100,
                      Math.round(
                        ((watchedSeconds[videoId] || 0) /
                          videoDurations[videoId]) *
                          100
                      )
                    )
                  : 0;

              return (
                <div
                  key={videoId || index}
                  className={`bg-white rounded-[26px] overflow-hidden border shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all ${
                    completed
                      ? "border-[#BBF7D0]"
                      : "border-[#C4B5FD] shadow-[0_12px_40px_rgba(91,75,219,0.08)]"
                  }`}
                >
                  {/* LESSON PLAYER */}
                  <div className="bg-[#F1F5F9]">
                    <YouTubePlayer
                      videoId={youtubeId}
                      title={video.title || `Lesson ${index + 1}`}
                      locked={locked}
                      completed={completed}
                      onComplete={(endedVideoId, details) =>
                        markVideoComplete(
                          endedVideoId || videoId,
                          details || video
                        )
                      }
                      onWatchTime={handleWatchTime}
                    />
                  </div>

                  {/* LESSON DETAILS */}
                  <div className="p-6 md:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <p className="text-[#7C6FF2] text-xs font-bold uppercase tracking-wide">
                          Lesson {index + 1} · Recommended Resource
                        </p>
                        <h3 className="text-xl font-bold leading-7 text-[#172554] mt-2">
                          {video.title || "Learning video"}
                        </h3>
                        {video.channel && (
                          <p className="text-[#5B4BDB] text-sm font-medium mt-2">
                            {video.channel}
                          </p>
                        )}
                      </div>
                      {video.classifiedDifficulty && (
                        <span className="flex-shrink-0 bg-[#F3F1FF] border border-[#DDD6FE] text-[#6D5CE7] text-xs px-3 py-1.5 rounded-full font-semibold">
                          {video.classifiedDifficulty}
                        </span>
                      )}
                    </div>

                    {/* SCORE */}
                    {video.score !== undefined && (
                      <p className="text-[#94A3B8] text-xs mt-3">
                        Recommendation score: {video.score}
                      </p>
                    )}

                    {/* DESCRIPTION */}
                    {video.description && (
                      <p className="text-[#64748B] text-sm mt-4 leading-6">
                        {video.description}
                      </p>
                    )}

                    {/* INDIVIDUAL VIDEO WATCH PROGRESS */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-[#64748B] mb-2">
                        <span>Video watch progress</span>
                        <span>{watchPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#EEF0F6] rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-[#5B4BDB] to-[#8B7CF6] rounded-full transition-all duration-500"
                          style={{ width: `${watchPercentage}%` }}
                        />
                      </div>
                      {watchedSeconds[videoId] > 0 && (
                        <p className="text-[#64748B] text-xs mt-2">
                          Watched:{" "}
                          {Math.floor(
                            watchedSeconds[videoId] / 60
                          )}{" "}
                          min{" "}
                          {Math.floor(
                            watchedSeconds[videoId] % 60
                          )}{" "}
                          sec
                        </p>
                      )}
                    </div>

                    {/* LESSON STATUS */}
                    <div className="flex flex-wrap gap-3 mt-5">
                      {completed ? (
                        <span className="px-5 py-2.5 rounded-xl font-semibold bg-[#ECFDF5] text-[#059669] border border-[#BBF7D0]">
                          ✓ Completed
                        </span>
                      ) : !youtubeId ? (
                        <span className="px-5 py-2.5 rounded-xl font-semibold bg-[#FFFBEB] text-[#92400E]">
                          ⚠️ Invalid video URL
                        </span>
                      ) : (
                        <span className="px-5 py-2.5 rounded-xl font-semibold bg-[#EEF0F6] text-[#334155]">
                          ▶ Play the embedded video to complete this lesson
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FINAL TEST */}
        <div
          className={`mt-9 rounded-[28px] p-7 md:p-8 border ${
            hasCompletedAnyVideo
              ? "bg-[#ECFDF5] border-[#BBF7D0]"
              : "bg-white border-[#E7E5F5]"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    hasCompletedAnyVideo
                      ? "bg-[#D1FAE5]"
                      : "bg-[#F1F5F9]"
                  }`}
                >
                  {hasCompletedAnyVideo ? "🎉" : "🔒"}
                </div>
                <div>
                  <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wide">
                    Next Step
                  </p>
                  <h2 className="text-2xl font-bold mt-1">
                    Final Confirmation Test
                  </h2>
                </div>
              </div>
              <p className="text-[#64748B] mt-4 max-w-2xl">
                {hasCompletedAnyVideo
                  ? "You have completed at least one recommended video. You can now take the final test."
                  : "Complete at least one recommended video to unlock the final test."}
              </p>
            </div>
            <button
              disabled={!hasCompletedAnyVideo}
              onClick={() => navigate("/final-test")}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition ${
                hasCompletedAnyVideo
                  ? "bg-gradient-to-r from-[#059669] to-[#10B981] text-white hover:-translate-y-0.5 hover:shadow-lg"
                  : "bg-[#EEF0F6] text-[#94A3B8] cursor-not-allowed"
              }`}
            >
              {hasCompletedAnyVideo
                ? "Take Final Test →"
                : "🔒 Locked"}
            </button>
          </div>
        </div>

        {/* AI EXPLANATION */}
        <div className="mt-7 bg-[#F3F1FF] border border-[#DDD6FE] rounded-[24px] p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm flex-shrink-0">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-[#5B4BDB]">
                Why this learning path?
              </h3>
              <p className="text-[#64748B] text-sm mt-2 leading-6">
                {getLevelMessage()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E7EF] mt-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-[#94A3B8] text-sm">
            Adaptive Minds
          </p>
          <p className="text-[#CBD5E1] text-sm">
            Learn • Practice • Improve
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LearningPage;
