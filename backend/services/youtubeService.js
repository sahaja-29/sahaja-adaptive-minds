const path = require("path");
const axios = require("axios");

require("dotenv").config({
    path: path.join(__dirname, "../../.env")
});


async function searchYouTube(query) {

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        throw new Error(
            "YouTube API key is not configured"
        );
    }


    const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: 50,
                key: apiKey
            }
        }
    );


    const items = response.data.items || [];


    return items
        .filter((video) => {

            return (
                video.id &&
                video.id.videoId &&
                video.snippet
            );

        })
        .map((video) => {

            return {
                videoId: video.id.videoId,

                title:
                    video.snippet.title || "",

                description:
                    video.snippet.description || "",

                channel:
                    video.snippet.channelTitle || "",

                thumbnail:
                    video.snippet.thumbnails?.high?.url ||
                    video.snippet.thumbnails?.default?.url ||
                    "",

                url:
                    `https://www.youtube.com/watch?v=${video.id.videoId}`
            };

        });
}


module.exports = {
    searchYouTube
};