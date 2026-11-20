require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");

const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const predictRoutes = require("./routes/predictRoutes");
const csvRoutes = require("./routes/csvRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const progressRoutes = require("./routes/progressRoutes");
const authRoutes = require("./routes/authRoutes");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/subjects", subjectRoutes);
app.use("/topics", topicRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

app.use("/", quizRoutes);
app.use("/", predictRoutes);
app.use("/", csvRoutes);

app.use("/api", recommendationRoutes);
app.use("/api/ai", aiRoutes);

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});