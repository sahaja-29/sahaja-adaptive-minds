import AITutor from "./pages/AITutor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SemesterSelection from "./pages/SemesterSelection";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import NotesPage from "./pages/NotesPage";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
  path="/ai-tutor"
  element={<AITutor />}
/>


        <Route path="/ai-tutor" element={<AITutor />} />
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/semester"
          element={<SemesterSelection />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/subject/:subjectName"
          element={<SubjectPage />}
        />

        <Route
          path="/notes/:subjectName"
          element={<NotesPage />}
        />

        {/* Quiz Integration */}
        <Route
          path="/quiz/:subjectName"
          element={<QuizPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;