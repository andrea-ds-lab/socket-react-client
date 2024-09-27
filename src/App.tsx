import { useState } from "react"
import { ChatComponent } from "./Chat"

function App() {

  const [username, setUsername] = useState("andrea")


  return (
    <div
      id="main-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "yellow"
      }}>
      {/* Content for Logged-In Users at the Bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', height: "100%", gap: '10px' }}>
        <>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label htmlFor="username">Logged in as:</label>
            <p><b>{username}</b></p>
          </div>
          <hr style={{ width: "100%" }} />
          <ChatComponent user={username} />
        </>
        )
      </div>
    </div >

  )
}

export default App
