import { useEffect, useState, KeyboardEvent, MouseEvent } from "react";
import socket from "./socket";  // Ensure the correct path to your socket.js file
import './css/theme.css';
import RoundedInput from "./RountedTextField";
import IconButton from "./IconButton";
import { WorkspacePremium } from "@mui/icons-material";
import ChatDisplay from "./ChatDisplay";
import OffsetContainer from "./OffsetContainer";
import { useDispatch } from "react-redux";
import { addMessage } from "./features/messages/messagesSlice";
import { MessageProps } from "./types";

// Interface to define the type of channel object
interface Channel {
  leave: () => void;
  join: () => { receive: (status: string, callback: (response: any) => void) => void };
  on: (event: string, callback: (payload: { body: string, timestamp: number, user: string, boosted: boolean, channel: string }) => void) => void;
  push: (event: string, payload: { body: string, timestamp: number, user: string, boosted: boolean, channel: string }) => void;
}

interface ChatComponentProps {
  user: string;  // Properly define the username prop type
}

export function ChatComponent({ user }: ChatComponentProps) {
  const [body, setBody] = useState<string>("");
  const [newChannel, setNewChannel] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("lobby");
  const [channel, setChannel] = useState<Channel | null>(null);
  const [boostOn, setBoostOn] = useState<boolean>(false);

  const dispatch = useDispatch();

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

    newChannelInstance.on("new_msg", (payload: MessageProps) => {
      dispatch(addMessage(payload));
    });

    setChannel(newChannelInstance);

    // Cleanup the channel when the component unmounts or when channelName changes
    return () => {
      newChannelInstance.leave();
    };
  }, [channelName]);  // The effect runs only when `channelName` changes

  const sendMessage = () => {
    if (body.trim() !== "" && channel) {
      channel.push("new_msg", { body: body, timestamp: Date.now(), user: user, boosted: boostOn, channel: channelName });
      setBody("");  // Clear the message input after sending
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
    setBoostOn(!boostOn);
    // You can handle async operations here
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }} >
      <h1>Test chat</h1>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <p>Connected to:</p>
        <b>{channelName}</b>
        <div>
          <RoundedInput
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a channel..."
          />
        </div>
        <div className="rounded-button" style={{ width: "10rem" }} onClick={handleChannelChange}>Change channel</div>
      </div>
      <OffsetContainer >
        <ChatDisplay user={user} />
      </OffsetContainer>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: "1rem" }}>
          <IconButton icon={<WorkspacePremium />} onClick={handleClick} />
          <div style={{
            background: "var(--chat-message-bg-light)", padding: "0.5rem", borderRadius: "2rem", display: "flex", gap: 10
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
      </div>
    </div >
  );
}
