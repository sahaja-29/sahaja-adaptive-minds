const {
    classifyVideoDifficulty
} = require("./videoFilterService");

const difficultyMap = {
    Easy: "Beginner",
    Medium: "Intermediate",
    Hard: "Advanced"
};

function calculateVideoScore(
    video,
    subject,
    topic,
    difficulty
) {
    const title =
        (video.title || "").toLowerCase();

    const description =
        (video.description || "").toLowerCase();

    const subjectLower =
        subject.toLowerCase();

    const topicLower =
        topic.toLowerCase();

    const learningLevel =
        difficultyMap[difficulty];

    if (!learningLevel) {
        throw new Error(
            "Invalid difficulty level"
        );
    }

    const learningLevelLower =
        learningLevel.toLowerCase();

    let score = 0;

    /*
     * -----------------------------------------
     * TOPIC RELEVANCE
     * -----------------------------------------
     */

    if (title.includes(topicLower)) {
        score += 60;
    }

    if (description.includes(topicLower)) {
        score += 25;
    }

    if (title.includes(subjectLower)) {
        score += 25;
    }

    if (description.includes(subjectLower)) {
        score += 10;
    }

    /*
     * -----------------------------------------
     * VIDEO DIFFICULTY
     * -----------------------------------------
     */

    const detectedDifficulty =
        classifyVideoDifficulty(video);

    if (
        detectedDifficulty ===
        learningLevel
    ) {
        /*
         * Strong reward for exact difficulty.
         */
        score += 150;
    }
    else if (
        detectedDifficulty ===
        "Unknown"
    ) {
        /*
         * Unknown videos are allowed,
         * but should appear below
         * clearly classified videos.
         */
        score -= 60;
    }
    else {
        /*
         * Wrong difficulty should be
         * strongly pushed down.
         */
        score -= 150;
    }

    /*
     * Explicit difficulty word
     * in title/description.
     */

    if (
        title.includes(
            learningLevelLower
        )
    ) {
        score += 35;
    }

    if (
        description.includes(
            learningLevelLower
        )
    ) {
        score += 10;
    }

    /*
     * -----------------------------------------
     * EDUCATIONAL CONTENT
     * -----------------------------------------
     */

    const educationalKeywords = [
        "tutorial",
        "learn",
        "course",
        "lesson",
        "explained",
        "explanation",
        "examples",
        "example",
        "implementation",
        "concepts",
        "concept",
        "lecture",
        "complete guide",
        "study",
        "education",
        "practice",
        "problems",
        "problem solving",
        "applications"
    ];

    educationalKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score += 5;
            }

        }
    );

    /*
     * -----------------------------------------
     * ENGINEERING / ACADEMIC CONTENT
     * -----------------------------------------
     */

    const academicKeywords = [
        "university",
        "college",
        "engineering",
        "btech",
        "b.tech",
        "semester",
        "syllabus",
        "academic",
        "exam",
        "exam prep",
        "exam preparation",
        "placement",
        "placements",
        "computer science",
        "core concepts"
    ];

    academicKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score += 15;
            }

            if (
                description.includes(keyword)
            ) {
                score += 7;
            }

        }
    );

    const engineeringKeywords = [
        "syllabus",
        "university exam",
        "university",
        "semester",
        "engineering",
        "btech",
        "b.tech",
        "exam preparation",
        "exam prep",
        "placement",
        "placements",
        "core concepts",
        "complete course",
        "computer science"
    ];

    engineeringKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score += 20;
            }

            if (
                description.includes(keyword)
            ) {
                score += 10;
            }

        }
    );

    /*
     * -----------------------------------------
     * PROFESSIONAL CERTIFICATION PENALTY
     * -----------------------------------------
     */

    const professionalCertificationKeywords = [
        "ccna",
        "ccnp",
        "ccie",
        "cisco certification",
        "hcia",
        "hcip",
        "hcie",
        "certification training",
        "certification course",
        "vendor certification",
        "cisco training",
        "huawei training",
        "network academy",
        "certification",
        "network+"
    ];

    professionalCertificationKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score -= 70;
            }

            if (
                description.includes(keyword)
            ) {
                score -= 35;
            }

        }
    );

    /*
     * -----------------------------------------
     * PROFESSIONAL TRAINING PENALTY
     * -----------------------------------------
     */

    const professionalTrainingKeywords = [
        "professional training",
        "professional course",
        "enterprise network",
        "network management solutions",
        "routing & switching",
        "routing and switching",
        "cisco router",
        "cisco routers"
    ];

    professionalTrainingKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score -= 45;
            }

            if (
                description.includes(keyword)
            ) {
                score -= 25;
            }

        }
    );

    /*
     * -----------------------------------------
     * NON-ACADEMIC CONTENT
     * -----------------------------------------
     */

    const nonAcademicKeywords = [
        "route 53",
        "aws",
        "amazon web services",
        "cloud",
        "cloud computing",
        "api",
        "application api",
        "geolocation routing",
        "failover routing",
        "load balancing",
        "microservices",
        "kubernetes",
        "docker",
        "devops",
        "web application",
        "application reliability",
        "application availability"
    ];

    nonAcademicKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score -= 80;
            }

            if (
                description.includes(keyword)
            ) {
                score -= 40;
            }

        }
    );

    /*
     * -----------------------------------------
     * GENERAL AUDIENCE / QUICK CONTENT
     * -----------------------------------------
     */

    const generalAudienceKeywords = [
        "explained in",
        "as fast as possible",
        "in 8 minutes",
        "in 10 minutes",
        "in 15 minutes",
        "in 17 minutes",
        "in 20 minutes",
        "quick",
        "quickly",
        "fast",
        "short",
        "crash course",
        "every operating system",
        "every database",
        "every data structure",
        "every computer network"
    ];

    generalAudienceKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score -= 20;
            }

            if (
                description.includes(keyword)
            ) {
                score -= 10;
            }

        }
    );

    /*
     * -----------------------------------------
     * DIFFICULTY KEYWORDS
     * -----------------------------------------
     */

    const beginnerKeywords = [
        "beginner",
        "beginners",
        "basic",
        "basics",
        "introduction",
        "intro",
        "fundamentals",
        "from scratch",
        "simple",
        "easy",
        "absolute beginner",
        "getting started"
    ];

    const intermediateKeywords = [
        "intermediate",
        "implementation",
        "implement",
        "practice",
        "examples",
        "example",
        "problems",
        "problem solving",
        "applications",
        "application",
        "case study",
        "detection",
        "prevention",
        "analysis",
        "techniques",
        "methods",
        "explained",
        "explanation",
        "tutorial",
        "lecture",
        "complete course",
        "complete tutorial",
        "university",
        "college",
        "engineering",
        "btech",
        "b.tech",
        "semester",
        "exam preparation",
        "exam prep",
        "placement preparation",
        "placement prep",
        "concepts",
        "concept"
    ];

    const advancedKeywords = [
        "advanced",
        "expert",
        "interview",
        "coding interview",
        "technical interview",
        "interview questions",
        "optimization",
        "optimized",
        "complex",
        "deep dive",
        "challenging",
        "hard problems",
        "advanced problems",
        "competitive programming",
        "leetcode",
        "coding challenge",
        "gate",
        "gate pyq",
        "gate pyqs",
        "pyq",
        "pyqs",
        "previous year questions",
        "previous year problems",
        "research",

        "functional dependency",
        "functional dependencies",
        "candidate key",
        "candidate keys",
        "attribute closure",
        "closure",
        "minimal cover",
        "canonical cover",
        "lossless decomposition",
        "dependency preservation",
        "decomposition",
        "normalization problem",
        "normalization problems",
        "normalization question",
        "normalization questions",
        "bcnf",
        "4nf",
        "5nf",
        "boyce codd",
        "boyce-codd",
        "multivalued dependency",
        "multivalued dependencies",
        "join dependency",
        "join dependencies",
        "3nf",
        "3 nf",
        "4 nf",
        "5 nf"
    ];

    const keywordMap = {
        Beginner: beginnerKeywords,
        Intermediate: intermediateKeywords,
        Advanced: advancedKeywords
    };

    const targetKeywords =
        keywordMap[learningLevel];

    targetKeywords.forEach(
        keyword => {

            if (
                title.includes(keyword)
            ) {
                score += 12;
            }

            if (
                description.includes(keyword)
            ) {
                score += 5;
            }

        }
    );

    /*
     * -----------------------------------------
     * PENALIZE OTHER EXPLICIT LEVELS
     * -----------------------------------------
     */

    const allLevels = [
        "beginner",
        "intermediate",
        "advanced"
    ];

    allLevels.forEach(
        level => {

            if (
                level !==
                learningLevelLower
            ) {

                if (
                    title.includes(level)
                ) {
                    score -= 45;
                }

                if (
                    description.includes(level)
                ) {
                    score -= 20;
                }

            }

        }
    );

    /*
     * -----------------------------------------
     * SHORTS
     * -----------------------------------------
     */

    if (
        title.includes("#shorts") ||
        title.includes("shorts")
    ) {
        score -= 60;
    }

    return score;
}

function rankVideos(
    videos,
    subject,
    topic,
    requestedDifficulty
) {
    const learningLevel =
        difficultyMap[requestedDifficulty];

    if (!learningLevel) {
        throw new Error(
            "Invalid difficulty level"
        );
    }

    return videos
        .map(video => {

            const classifiedDifficulty =
                classifyVideoDifficulty(video);

            const score =
                calculateVideoScore(
                    video,
                    subject,
                    topic,
                    requestedDifficulty
                );

            return {
                ...video,
                classifiedDifficulty,
                score
            };

        })
        .sort(
            (a, b) =>
                b.score - a.score
        );
}

module.exports = {
    calculateVideoScore,
    rankVideos
};