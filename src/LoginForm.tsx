// src/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fakeLogin } from "./features/messages/accountSlice"; // Import your login action
import { RootState } from "./app/store"; // Import the RootState type
import "./css/loginform.css"; // Ensure to include your CSS
import { useNavigate } from "react-router-dom";
import { PATH_GROUP_CHAT } from "./config";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
  const error = useSelector((state: RootState) => state.account.error); // Retrieve error from the state

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Dispatch the login action
    // @ts-ignore
    dispatch(fakeLogin({ email: username, password: password })).then((result) => {
      // Check if the login was successful
      if (result.meta.requestStatus === "fulfilled") {
        // Redirect the user to the chat page upon successful login
        navigate(PATH_GROUP_CHAT);
      }
    });
  };

  // Handle navigation upon successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated!");
      navigate(PATH_GROUP_CHAT);
    }
  }, [isAuthenticated]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
