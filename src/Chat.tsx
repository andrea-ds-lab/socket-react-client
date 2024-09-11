import { useEffect, useState, KeyboardEvent, MouseEvent } from "react";
import socket from "./socket";  // Ensure the correct path to your socket.js file
import './css/theme.css';  // Import the theme.css file
import MessageBubble from "./MessageBubble";
import RoundedInput from "./RountedTextField";
import IconButton from "./IconButton";
import { WorkspacePremium } from "@mui/icons-material";
import ChatDisplay from "./ChatDisplay";
import OffsetContainer from "./OffsetContainer";

// Interface to define the type of channel object
interface Channel {
  leave: () => void;
  join: () => { receive: (status: string, callback: (response: any) => void) => void };
  on: (event: string, callback: (payload: { message: string, timestamp: number, username: string }) => void) => void;
  push: (event: string, payload: { message: string, timestamp: number, username: string }) => void;
}

type Message = {
  message: string, timestamp: number, username: string
}

interface ChatComponentProps {
  username: string;  // Properly define the username prop type
}

export function ChatComponent({ username }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [newChannel, setNewChannel] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("lobby");
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    // Cleanup previous channel before joining a new one
    if (channel) {
      channel.leave();
    }

    // Join a new channel
    const newChannelInstance = socket.channel(`testing_channel:${channelName}`, {});

    newChannelInstance.join()
      .receive("ok", (response: any) => {
        console.log("Joined successfully", response);
      })
      .receive("error", (response: any) => {
        console.log("Unable to join", response);
      });

    newChannelInstance.on("new_msg", (payload: { message: string, timestamp: number, username: string }) => {
      console.log("Message payload", payload)
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    setChannel(newChannelInstance);

    // Cleanup the channel when the component unmounts or when channelName changes
    return () => {
      newChannelInstance.leave();
    };
  }, [channelName]);  // The effect runs only when `channelName` changes

  const sendMessage = () => {
    if (message.trim() !== "" && channel) {
      channel.push("new_msg", { message: message, timestamp: Date.now(), username: username });
      setMessage("");  // Clear the message input after sending
    }
  };

  const handleChannelChange = () => {
    if (newChannel.trim() !== "") {
      setChannelName(newChannel.trim());
      setNewChannel("");  // Clear the new channel input field
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent default Enter key behavior
      sendMessage();  // Send the message on Enter key press
    }
  };

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    console.log("Click");
    // You can handle async operations here
  };

  return (
    <div >
      <h1>Test chat</h1>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <p>Connected to channel:</p>
        <b>{channelName}</b>
        <input
          type="text"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a new channel..."
          style={{ marginRight: "1rem" }}
        />
        <button style={{ height: "2rem" }} onClick={handleChannelChange}>Set channel</button>
      </div>
      <OffsetContainer >
        <ChatDisplay messages={messages} username={username} />
      </OffsetContainer>
      <div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <IconButton icon={<WorkspacePremium />} onClick={handleClick} />
          <div style={{
            background: "var(--chat-message-bg-light)", padding: "0.5rem", borderRadius: "2rem", display: "flex", gap: 10
          }}>
            <RoundedInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />
            <div className="rounded-button" onClick={sendMessage}>Send</div>
          </div>
        </div>
      </div>
    </div >
  );
}
