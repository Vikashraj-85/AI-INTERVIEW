import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/InterviewSetup";
import Interviews from "./pages/Interviews";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Results from "./pages/Results";
import Workspace from "./components/Workspace";
import "./pages/FunctionalPages.css";

function ProtectedRoute({ children }) {
  return localStorage.getItem("access_token") ? children : <Navigate to="/login" replace />;
}
function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/interview/setup" element={<ProtectedRoute><Workspace><InterviewSetup /></Workspace></ProtectedRoute>} />
    <Route path="/interviews" element={<ProtectedRoute><Workspace><Interviews /></Workspace></ProtectedRoute>} />
    <Route path="/interview/:id" element={<ProtectedRoute><Workspace><Results /></Workspace></ProtectedRoute>} />
    <Route path="/resume" element={<ProtectedRoute><Workspace><Resume /></Workspace></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Workspace><Profile /></Workspace></ProtectedRoute>} />
    <Route path="/performance" element={<ProtectedRoute><Workspace><Results performance /></Workspace></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Workspace><Profile settings /></Workspace></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter>;
}
export default App;
