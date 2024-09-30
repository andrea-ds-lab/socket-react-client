import { useState } from "react"
import { ChatComponent } from "./Chat"

function App() {

  const [username, setUsername] = useState("andrea")

  return (
    <div
      id="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
        <div id="logged-user-container" style={{ display: "none", gap: "1rem", padding: "1rem", height: "1rem", alignItems: "center" }}>
          <label htmlFor="username">Logged in as:</label>
          <p><b>{username}</b></p>
        </div>
        <ChatComponent user={username} />
      </div>
    </div >

  )
}

export default App
