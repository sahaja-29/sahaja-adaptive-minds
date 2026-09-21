const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const predictRoutes = require("./routes/predictRoutes");
const csvRoutes = require("./routes/csvRoutes");

const db = require("./config/db");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);

app.use("/subjects", subjectRoutes);
app.use("/topics", topicRoutes);
app.use("/", quizRoutes);
app.use("/", predictRoutes);
app.use("/", csvRoutes);
app.use("/api/auth", authRoutes);


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