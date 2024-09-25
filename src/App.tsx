import { KeyboardEvent, useState } from "react"
import { ChatComponent } from "./Chat"
import RoundedInput from "./RountedTextField"

function App() {

  const [username, setUsername] = useState("andrea")
  const [password, setPassword] = useState("")
  const [signedIn, setSignedIn] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent default Enter key behavior
      login();  // Send the message on Enter key press
    }
  };

  const login = () => {
    console.log("logged in as %s with password %s", username, password);
    setSignedIn(true)
  };

  const logout = () => {
    setSignedIn(false);
  }

  function signInComponent() {
    if (signedIn) {
      return <></>
    } else {
      return <div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p>Username</p>
            <RoundedInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Username"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p>Password</p>
            <RoundedInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="..."
            />
          </div>
        </div>
        <div className="rounded-button" style={{ width: "10rem" }} onClick={login}>Login</div>
      </div>
    }
  }

  return (
    <div
      id="main-container"
      style={{
        padding: "1rem 2rem",
        display: "flex",
        flexDirection: "column",
        background: "red",
        height: "100vh",  // Ensure the container takes the full height of the viewport
        justifyContent: "space-between"
      }}>
      {/* Sign-In Component at the Top */}
      <div style={{ flexShrink: 0 }}> {/* Prevents the sign-in component from shrinking */}
        {signInComponent()}
      </div>

      {/* Content for Logged-In Users at the Bottom */}
      <div style={{ flexGrow: 1, display: signedIn ? 'flex' : 'none', flexDirection: 'column', gap: '10px' }}>
        {signedIn ? (
          <>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label htmlFor="username">Logged in as:</label>
              <p><b>{username}</b></p>
              <div className="rounded-button" onClick={logout}>Logout</div>
            </div>
            <hr style={{ width: "100%" }} />
            <ChatComponent user={username} />
          </>
        ) : null}
      </div>
    </div>

  )
}

export default App
