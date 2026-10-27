import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SemesterSelection from "./pages/SemesterSelection";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import NotesPage from "./pages/NotesPage";
import QuizPage from "./pages/QuizPage";
import LearningSelection from "./pages/LearningSelection";
import LearningPage from "./pages/LearningPage";
import FinalTestPage from "./pages/FinalTestPage";
import AITutor from "./pages/AITutor";
import ProgressPage from "./pages/ProgressPage";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/semester" element={<SemesterSelection />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/learning" element={<LearningSelection />} />

        <Route path="/subject/:subjectName" element={<SubjectPage />} />

        <Route path="/notes/:subjectName" element={<NotesPage />} />

        <Route path="/quiz/:subjectName" element={<QuizPage />} />

        <Route path="/learning-page" element={<LearningPage />} />

        <Route path="/final-test" element={<FinalTestPage />} />

        <Route path="/ai-tutor" element={<AITutor />} />

        <Route path="/progress" element={<ProgressPage />} />

        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;