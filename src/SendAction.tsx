import IconButton from "./IconButton";
import RoundedInput from "./RountedTextField";
import { KeyboardEvent, useState } from "react";
import { SendActionProps } from "./types";
import { EVENT_SCROLL_TO, LAST_MESSAGE } from "./config";

export function SendAction({ user, channelName, channelInstance }: SendActionProps) {

  const [body, setBody] = useState<string>("");
  const [boostOn, setBoostOn] = useState<boolean>(false);

  const sendMessage = () => {
    if (body.trim() !== "" && channelInstance) {
      channelInstance.push("new_msg", { body: body, timestamp: Date.now(), user: user, boosted: boostOn, channel: channelName });
      setBody("");
    }
  };

  const handleClick = async () => {
    console.log(boostOn ? "AI turned down" : "AI turned up");
    setBoostOn(!boostOn);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
      const scrollToEvent = new CustomEvent(EVENT_SCROLL_TO, { detail: { value: LAST_MESSAGE } });
      window.dispatchEvent(scrollToEvent);
    }
  };

  return (
    <div id="send-action" style={{ display: "flex", width: "100%", gap: 10, background: "var(--highlight-color-light)", alignItems: "center", padding: "0.5rem" }}>
      <IconButton onClick={handleClick} />
      <div style={{
        background: "var(--chat-message-bg-light)", padding: "0.5rem", borderRadius: "2rem", display: "flex", flexGrow: 1, gap: "1rem"
      }}>
        <RoundedInput
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <div className="rounded-button" onClick={sendMessage}>Send</div>
      </div>
    </div>
  )
}