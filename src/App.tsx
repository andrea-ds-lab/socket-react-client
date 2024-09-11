import { useState } from "react"
import { ChatComponent } from "./Chat"

function App() {

  const [username, setUsername] = useState("andrea")

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <>
      <div>
        <label htmlFor="username">Enter your username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter username"
        />
      </div>
      <h1>Vite + React</h1>
      <ChatComponent username={username} />

    </>
  )
}

export default App
