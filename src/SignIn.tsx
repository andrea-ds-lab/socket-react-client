import { KeyboardEvent, useState } from "react"
import RoundedInput from "./RountedTextField";


export function SignInComponent() {

  const [signedIn, setSignedIn] = useState(false)
  const [username, setUsername] = useState("andrea")
  const [password, setPassword] = useState("")


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

export default SignInComponent;