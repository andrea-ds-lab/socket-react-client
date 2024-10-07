import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatMiddleware } from "./ChatMiddleware";
import { PATH_GROUP_CHAT, PATH_LOGIN } from "./config";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout

function App() {
  return (
    <Router>
      <div id="app-container">
        <Routes>
          {/* Protected route with sidebar */}
          <Route
            path={PATH_GROUP_CHAT}
            element={
              <ProtectedRoute
                element={
                  <SidebarLayout>
                    <ChatMiddleware />
                  </SidebarLayout>
                }
              />
            }
          />

          {/* Login route, accessible to everyone */}
          <Route path={PATH_LOGIN} element={<LoginForm />} />

          {/* Default route to login */}
          <Route path={""} element={<LoginForm />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
