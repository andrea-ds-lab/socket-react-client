import { useState } from "react"
import { ChatComponent } from "./Chat"

function App() {

  const [username, setUsername] = useState("andrea")

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <label htmlFor="username">Enter your username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter username"
        />
      </div>
      <hr style={{ width: "100%" }} />
      <ChatComponent username={username} />
    </div >
  )
}

export default App
