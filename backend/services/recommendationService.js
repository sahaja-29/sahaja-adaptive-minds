const {
    isTopicRelevant,
    isShortVideo,
    isEnglishVideo
} = require("./videoFilterService");

// ============================================================
// DIFFICULTY MAPPING
// ============================================================

const difficultyMap = {
    Easy: "Beginner",
    Medium: "Intermediate",
    Hard: "Advanced"
};

// ============================================================
// GET LEARNING LEVEL
// ============================================================

function getLearningLevel(difficulty) {
    return difficultyMap[difficulty];
}

// ============================================================
// BUILD YOUTUBE SEARCH QUERY
// ============================================================

function buildSearchQuery(subject, topic, difficulty) {
    const learningLevel =
        getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error(
            "Invalid difficulty level"
        );
    }

    const subjectTopicMap = {
        "operating systems": {
            "os": "Operating Systems"
        },

        "computer networks": {
            "cn": "Computer Networks"
        },

        "data structures": {
            "ds": "Data Structures"
        },

        "database management system": {
            "dbms": "Database Management Systems"
        },

        "object oriented programming": {
            "oop": "Object Oriented Programming"
        },

        "artificial intelligence": {
            "ai": "Artificial Intelligence"
        },

        "machine learning": {
            "ml": "Machine Learning"
        }
    };

    const subjectKey =
        subject.toLowerCase().trim();

    const topicKey =
        topic.toLowerCase().trim();

    const mappedTopic =
        subjectTopicMap[subjectKey]?.[topicKey];

    const finalTopic =
        mappedTopic || topic;

    return `${subject} ${finalTopic} ${learningLevel} tutorial`;
}

// ============================================================
// FILTER YOUTUBE RECOMMENDATIONS
// ============================================================


function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function hasTopicMatch(video, topic) {
    const title = normalizeText(video.title);
    const description = normalizeText(video.description);
    const requestedTopic = normalizeText(topic);

    if (!title && !description) {
        return false;
    }

    if (isTopicRelevant(video, topic)) {
        return true;
    }

    const words = requestedTopic
        .split(" ")
        .filter((word) => word.length > 2);

    if (words.length === 0) {
        return false;
    }

    const searchableText = `${title} ${description}`;

    const matchingWords = words.filter((word) =>
        searchableText.includes(word)
    );

    const requiredMatches = Math.min(2, words.length);

    return matchingWords.length >= requiredMatches;
}

function filterRecommendations(
    videos,
    subject,
    topic,
    difficulty
) {
    const learningLevel = getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error("Invalid difficulty level");
    }

    return videos.filter((video) => {
        const relevant = hasTopicMatch(video, topic);
        const english = isEnglishVideo(video);
        const isShort = isShortVideo(video);

        return relevant && english && !isShort;
    });
}

async function getRecommendations(
    subject,
    topic,
    difficulty
) {
    const { searchYouTube } = require("./youtubeService");
    const { rankVideos } = require("./rankingService");

    const query = buildSearchQuery(
        subject,
        topic,
        difficulty
    );

    const videos = await searchYouTube(query);

    console.log("YouTube videos found:", videos.length);

    const filteredVideos = filterRecommendations(
        videos,
        subject,
        topic,
        difficulty
    );

    console.log("Videos after filtering:", filteredVideos.length);

    const rankedVideos = rankVideos(
        filteredVideos,
        subject,
        topic,
        difficulty
    );

    return {
        subject,
        topic,
        difficulty,
        searchQuery: query,
        totalVideosFound: videos.length,
        totalVideosAfterFiltering: filteredVideos.length,
        recommendations: rankedVideos
    };
}
module.exports = {
    getLearningLevel,
    buildSearchQuery,
    filterRecommendations,
    getRecommendations
};