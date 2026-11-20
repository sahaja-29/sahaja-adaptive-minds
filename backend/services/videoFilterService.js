function normalizeText(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^\w\s.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// TOPIC CONFIGURATION
// ============================================================

const topicConfig = {

    "operating systems": {
        aliases: [
            "operating systems",
            "operating system",
            "os"
        ]
    },

    "computer networks": {
        aliases: [
            "computer networks",
            "computer network",
            "networking",
            "computer networking",
            "cn"
        ]
    },

    "data structures": {
        aliases: [
            "data structures",
            "data structure",
            "ds"
        ]
    },

    "database management system": {
        aliases: [
            "database management system",
            "database management systems",
            "dbms",
            "database"
        ]
    },

    "object oriented programming": {
        aliases: [
            "object oriented programming",
            "object-oriented programming",
            "oop"
        ]
    },

    "artificial intelligence": {
        aliases: [
            "artificial intelligence",
            "ai"
        ]
    },

    "machine learning": {
        aliases: [
            "machine learning",
            "ml"
        ]
    }
};


// ============================================================
// ACRONYMS
// ============================================================

const acronymMap = {
    "os": "operating systems",
    "cn": "computer networks",
    "ds": "data structures",
    "dbms": "database management system",
    "oop": "object oriented programming",
    "ai": "artificial intelligence",
    "ml": "machine learning"
};


// ============================================================
// REGEX HELPER
// ============================================================

function escapeRegex(text) {
    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


// ============================================================
// KEYWORD MATCHING
// ============================================================

function containsKeyword(text, keyword) {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedText || !normalizedKeyword) {
        return false;
    }

    return normalizedText.includes(normalizedKeyword);
}


// ============================================================
// COMPUTER NETWORK SPECIAL RELEVANCE
// ============================================================

function isComputerNetworksRoutingRelevant(
    text,
    topic
) {

    if (
        topic !== "computer networks" &&
        topic !== "cn"
    ) {
        return false;
    }

    const routingKeywords = [
        "routing",
        "router",
        "routers",
        "routing protocols",
        "rip",
        "ospf",
        "bgp",
        "eigrp",
        "distance vector",
        "link state",
        "path vector",
        "routing algorithm",
        "routing algorithms",
        "packet forwarding",
        "forwarding table",
        "static routing",
        "dynamic routing"
    ];

    return routingKeywords.some(
        keyword =>
            containsKeyword(text, keyword)
    );
}


// ============================================================
// TOPIC RELEVANCE
// ============================================================

function isTopicRelevant(
    video,
    topic
) {

    const title =
        normalizeText(video.title);

    const description =
        normalizeText(video.description);

    const combinedText =
        `${title} ${description}`;

    const requestedTopic =
        normalizeText(topic);

    if (!requestedTopic) {
        return false;
    }

    // --------------------------------------------------------
    // Direct topic match
    // --------------------------------------------------------

    if (
        containsKeyword(
            title,
            requestedTopic
        )
    ) {
        return true;
    }

    if (
        containsKeyword(
            description,
            requestedTopic
        )
    ) {
        return true;
    }


    // --------------------------------------------------------
    // Acronym match
    // --------------------------------------------------------

    const expandedTopic =
        acronymMap[requestedTopic];

    if (expandedTopic) {

        if (
            containsKeyword(
                combinedText,
                expandedTopic
            )
        ) {
            return true;
        }
    }


    // --------------------------------------------------------
    // Subject-specific aliases
    // --------------------------------------------------------

    for (const subject in topicConfig) {

        const aliases =
            topicConfig[subject].aliases;

        if (
            aliases.some(
                alias =>
                    normalizeText(alias) ===
                    requestedTopic
            )
        ) {

            if (
                aliases.some(
                    alias =>
                        containsKeyword(
                            combinedText,
                            alias
                        )
                )
            ) {
                return true;
            }
        }
    }


    // --------------------------------------------------------
    // Computer Networks routing topics
    // --------------------------------------------------------

    if (
        isComputerNetworksRoutingRelevant(
            combinedText,
            requestedTopic
        )
    ) {
        return true;
    }


    // --------------------------------------------------------
    // Data Structures topic aliases
    // --------------------------------------------------------

    const dataStructureAliases = {

        "linked list": [
            "linked list",
            "linked lists",
            "singly linked list",
            "doubly linked list",
            "circular linked list"
        ],

        "stack": [
            "stack",
            "stacks"
        ],

        "queue": [
            "queue",
            "queues",
            "circular queue",
            "priority queue"
        ],

        "tree": [
            "tree",
            "trees",
            "binary tree",
            "binary search tree",
            "bst",
            "avl tree",
            "heap"
        ],

        "graphs": [
            "graph",
            "graphs",
            "graph data structure",
            "graph algorithms"
        ],

        "hashing": [
            "hashing",
            "hash table",
            "hash tables",
            "hash map",
            "hash maps"
        ],

        "arrays": [
            "array",
            "arrays"
        ]
    };

    const topicAliases =
        dataStructureAliases[requestedTopic];

    if (topicAliases) {

        if (
            topicAliases.some(
                alias =>
                    containsKeyword(
                        combinedText,
                        alias
                    )
            )
        ) {
            return true;
        }
    }


    // --------------------------------------------------------
    // DBMS normalization aliases
    // --------------------------------------------------------

    const dbmsAliases = {

        "normalization": [
            "normalization",
            "normalisation",
            "normal forms",
            "1nf",
            "2nf",
            "3nf",
            "bcnf",
            "4nf",
            "5nf",
            "functional dependency",
            "functional dependencies"
        ],

        "normal forms": [
            "normalization",
            "normalisation",
            "normal forms",
            "1nf",
            "2nf",
            "3nf",
            "bcnf",
            "4nf",
            "5nf"
        ]
    };

    const dbAliases =
        dbmsAliases[requestedTopic];

    if (dbAliases) {

        if (
            dbAliases.some(
                alias =>
                    containsKeyword(
                        combinedText,
                        alias
                    )
            )
        ) {
            return true;
        }
    }

    return false;
}


// ============================================================
// ENGLISH VIDEO FILTER
// ============================================================

function isEnglishVideo(video) {

    const title =
        video.title || "";

    const description =
        video.description || "";

    const text =
        `${title} ${description}`;

    // Strong non-English indicators.
    const nonEnglishIndicators = [

        "hindi",
        "tamil",
        "telugu",
        "malayalam",
        "kannada",
        "bengali",
        "marathi",
        "gujarati",
        "punjabi",
        "urdu",

        "हिंदी",
        "தமிழ்",
        "తెలుగు",
        "മലയാളം",
        "ಕನ್ನಡ",
        "বাংলা"
    ];

    for (
        const indicator
        of nonEnglishIndicators
    ) {

        if (
            text.toLowerCase().includes(
                indicator.toLowerCase()
            )
        ) {
            return false;
        }
    }

    return true;
}


// ============================================================
// SHORT VIDEO FILTER
// ============================================================

function isShortVideo(video) {

    const title =
        normalizeText(video.title);

    const description =
        normalizeText(video.description);

    const text =
        `${title} ${description}`;

    const shortIndicators = [

        "#shorts",
        "shorts",
        "youtube short",
        "youtube shorts"
    ];

    return shortIndicators.some(
        indicator =>
            containsKeyword(
                text,
                indicator
            )
    );
}


// ============================================================
// VIDEO DIFFICULTY CLASSIFICATION
// ============================================================

function classifyVideoDifficulty(video) {

    const title =
        normalizeText(video.title);

    const description =
        normalizeText(video.description);


    // ========================================================
    // BEGINNER KEYWORDS
    // ========================================================

    const beginnerKeywords = [

        "beginner",
        "beginners",
        "basic",
        "basics",
        "fundamentals",
        "introduction",
        "intro",
        "from scratch",
        "getting started",
        "simple explanation",
        "simple",
        "easy",
        "absolute beginner",
        "what is",
        "learn from scratch"
    ];


    // ========================================================
    // INTERMEDIATE KEYWORDS
    // ========================================================

    const intermediateKeywords = [

        "intermediate",
        "implementation",
        "implement",
        "examples",
        "example",
        "practice",
        "problems",
        "problem solving",
        "applications",
        "application",
        "case study",
        "analysis",
        "techniques",
        "technique",
        "methods",
        "method",
        "explained",
        "explanation",
        "tutorial",
        "lecture",
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
        "concept",

        // DBMS
        "1nf",
        "2nf",
        "3nf",
        "normal forms",
        "functional dependency",
        "functional dependencies"
    ];


    // ========================================================
    // ADVANCED KEYWORDS
    // ========================================================

    const advancedKeywords = [

        "advanced",
        "expert",
        "deep dive",

        "interview",
        "coding interview",
        "technical interview",
        "interview questions",

        "coding problems",
        "hard problems",
        "advanced problems",

        "optimization",
        "optimized",

        "competitive programming",
        "leetcode",
        "codeforces",
        "hackerrank",

        "gate",
        "gate pyq",
        "gate pyqs",
        "pyq",
        "pyqs",
        "previous year questions",
        "previous year problems",

        "research"
    ];


    // ========================================================
    // DSA-SPECIFIC ADVANCED KEYWORDS
    // ========================================================

    const dsaAdvancedKeywords = [

        "reverse linked list",
        "detect cycle",
        "cycle detection",
        "floyd cycle detection",
        "middle of linked list",
        "merge linked list",
        "merge two linked lists",
        "intersection of linked list",
        "remove nth node",
        "palindrome linked list",
        "sort linked list",
        "rotate linked list",
        "clone linked list",
        "flatten linked list",
        "recursive linked list",
        "advanced linked list",

        "linked list interview",
        "linked list problems",
        "linked list problem",
        "linked list coding problems",

        "tree interview",
        "tree problems",
        "tree coding problems",

        "graph interview",
        "graph problems",
        "graph coding problems",

        "stack interview",
        "stack problems",

        "queue interview",
        "queue problems"
    ];


    // ========================================================
    // DBMS-SPECIFIC ADVANCED KEYWORDS
    // ========================================================

    const dbAdvancedKeywords = [

        "functional dependency",
        "functional dependencies",

        "candidate key",
        "candidate keys",

        "attribute closure",

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
        "boyce codd",
        "boyce-codd",

        "4nf",
        "5nf",

        "multivalued dependency",
        "multivalued dependencies",

        "join dependency",
        "join dependencies",

        "3nf",
        "3 nf",
        "4 nf",
        "5 nf"
    ];


    // ========================================================
    // SCORE CALCULATION
    // ========================================================

    let beginnerScore = 0;
    let intermediateScore = 0;
    let advancedScore = 0;


    // ========================================================
    // BEGINNER SCORING
    // ========================================================

    beginnerKeywords.forEach(
        keyword => {

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {
                beginnerScore += 5;
            }

            if (
                containsKeyword(
                    description,
                    keyword
                )
            ) {
                beginnerScore += 2;
            }
        }
    );


    // ========================================================
    // INTERMEDIATE SCORING
    // ========================================================

    intermediateKeywords.forEach(
        keyword => {

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {
                intermediateScore += 3;
            }

            if (
                containsKeyword(
                    description,
                    keyword
                )
            ) {
                intermediateScore += 1;
            }
        }
    );


    // ========================================================
    // ADVANCED SCORING
    // ========================================================

    advancedKeywords.forEach(
        keyword => {

            /*
             * IMPORTANT:
             *
             * Advanced evidence in the TITLE is much stronger
             * than advanced evidence appearing only in a
             * description.
             *
             * This prevents generic videos such as:
             *
             * "Linked List in Python"
             *
             * from becoming Advanced only because their
             * description says they are useful for interviews.
             */

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {

                if (
                    keyword === "interview"
                ) {
                    advancedScore += 8;
                }
                else if (
                    keyword === "deep dive" ||
                    keyword === "coding interview" ||
                    keyword === "technical interview" ||
                    keyword === "interview questions"
                ) {
                    advancedScore += 15;
                }
                else {
                    advancedScore += 8;
                }
            }

            /*
             * Description-only advanced evidence is deliberately
             * weak.
             *
             * This avoids false Advanced classifications caused
             * by generic descriptions mentioning interviews,
             * coding, GATE, etc.
             */

            if (
                containsKeyword(
                    description,
                    keyword
                )
            ) {

                if (
                    keyword === "interview" ||
                    keyword === "gate" ||
                    keyword === "research"
                ) {
                    advancedScore += 0;
                }
                else {
                    advancedScore += 1;
                }
            }
        }
    );


    // ========================================================
    // DSA ADVANCED SCORING
    // ========================================================

    dsaAdvancedKeywords.forEach(
        keyword => {

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {
                advancedScore += 10;
            }

            /*
             * Description evidence is weaker so that a generic
             * tutorial does not become Advanced simply because
             * its description talks about interviews.
             */

            if (
                containsKeyword(
                    description,
                    keyword
                )
            ) {
                advancedScore += 2;
            }
        }
    );


    // ========================================================
    // DBMS ADVANCED SCORING
    // ========================================================

    dbAdvancedKeywords.forEach(
        keyword => {

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {
                advancedScore += 10;
            }

            if (
                containsKeyword(
                    description,
                    keyword
                )
            ) {
                advancedScore += 2;
            }
        }
    );


    // ========================================================
    // EXPLICIT DIFFICULTY WORDS
    // ========================================================

    if (
        containsKeyword(
            title,
            "beginner"
        ) ||
        containsKeyword(
            title,
            "beginners"
        )
    ) {
        beginnerScore += 12;
    }

    if (
        containsKeyword(
            title,
            "intermediate"
        )
    ) {
        intermediateScore += 12;
    }

    if (
        containsKeyword(
            title,
            "advanced"
        )
    ) {
        advancedScore += 15;
    }


    // ========================================================
    // STRONG INTERVIEW TITLE SIGNALS
    // ========================================================

    const strongInterviewTitles = [

        "coding interview",
        "technical interview",
        "interview questions",
        "interview problems",
        "interview preparation",
        "interview prep"
    ];

    strongInterviewTitles.forEach(
        keyword => {

            if (
                containsKeyword(
                    title,
                    keyword
                )
            ) {
                advancedScore += 15;
            }
        }
    );


    // ========================================================
    // PROBLEM-SOLVING TITLE SIGNAL
    // ========================================================

    if (
        containsKeyword(
            title,
            "problem solving"
        )
    ) {

        advancedScore += 12;
    }


    // ========================================================
    // FULL COURSE SIGNAL
    // ========================================================

    if (
        containsKeyword(
            title,
            "full course"
        )
    ) {

        intermediateScore += 3;
    }


    // ========================================================
    // DETERMINE RESULT
    // ========================================================

    const scores = {

        Beginner: beginnerScore,

        Intermediate: intermediateScore,

        Advanced: advancedScore
    };


    const sorted =
        Object.entries(scores)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    const highestLevel =
        sorted[0][0];

    const highestScore =
        sorted[0][1];

    const secondHighestScore =
        sorted[1][1];


    // --------------------------------------------------------
    // No evidence
    // --------------------------------------------------------

    if (
        highestScore === 0
    ) {
        return "Unknown";
    }


    // --------------------------------------------------------
    // Exact tie
    // --------------------------------------------------------

    if (
        highestScore ===
        secondHighestScore
    ) {
        return "Unknown";
    }


    // --------------------------------------------------------
    // Advanced needs stronger evidence
    // --------------------------------------------------------

    if (
        highestLevel === "Advanced"
    ) {

        /*
         * Advanced classification should require
         * meaningful evidence.
         */

        if (
            advancedScore < 10
        ) {
            return (
                intermediateScore >=
                beginnerScore
            )
                ? "Intermediate"
                : "Beginner";
        }
    }


    return highestLevel;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    normalizeText,

    isTopicRelevant,

    isEnglishVideo,

    isShortVideo,

    classifyVideoDifficulty
};