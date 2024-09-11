import { useEffect, useState, KeyboardEvent } from "react";
import socket from "./socket";  // Ensure the correct path to your socket.js file
import './css/theme.css';  // Import the theme.css file
import MessageBubble from "./MessageBubble";

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

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
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
      <div style={{ maxHeight: "30dvh", flex: 1, overflowY: "hidden" }}>
        {messages.slice().reverse().map((msg, index) => {
          console.log(msg.message, username);
          return <MessageBubble key={index} message={msg.message} isSentByUser={msg.username === username} username={username} />
        })}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ marginRight: "1rem" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
