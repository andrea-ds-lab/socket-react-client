import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatMiddleware } from "./ChatMiddleware";
import { PATH_GROUP_CHAT, PATH_LOGIN } from "./config";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute"; // Import the protected route

export function App() {

  return (
    <Router>
      <div id="app-container">
        <Routes>
          {/* Protect the group chat route */}
          <Route
            path={PATH_GROUP_CHAT}
            element={<ProtectedRoute element={<ChatMiddleware />} />}
          />

          {/* The login route, accessible to everyone */}
          <Route path={PATH_LOGIN} element={<LoginForm />} />

          {/* Optionally, add a default route or 404 route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
