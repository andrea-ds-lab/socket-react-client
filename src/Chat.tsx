import { useEffect, useState } from "react";
// @ts-ignore
import socket from "./socket";
import './css/theme.css';
import RoundedInput from "./RountedTextField";
import ChatDisplay from "./ChatDisplay";
import OffsetContainer from "./OffsetContainer";
import { useDispatch } from "react-redux";
import { addMessage } from "./features/messages/messagesSlice";
import { Channel, ChatComponentProps, MessageProps } from "./types";
import useIsMobile from "./IsMobole";
import NewChat from "./NewChat";


export function ChatComponent({ user }: ChatComponentProps) {
  const [newChannel, setNewChannel] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("lobby");
  const [channel, setChannel] = useState<Channel | null>(null);

  const dispatch = useDispatch();
  const isMobile = useIsMobile();

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

  const handleChannelChange = () => {
    if (newChannel.trim() !== "") {
      setChannelName(newChannel.trim());
      setNewChannel("");  // Clear the new channel input field
    }
  };

  // Handle key down event to trigger channel change on Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleChannelChange();
    }
  };

  if (isMobile) {
    return <NewChat user={user} channelName={channelName} channelInstance={channel} />;
  } else {
    return (
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }} >
        <h1>Test chat</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <p>Connected to:</p>
          <b>{channelName}</b>
          <div>
            <RoundedInput
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              onKeyDown={handleKeyDown} // Use the new key down handler
              placeholder="Type a channel..."
            />
          </div>
          <div className="rounded-button" style={{ width: "10rem" }} onClick={handleChannelChange}>Change channel</div>
        </div>
        <OffsetContainer>
          <ChatDisplay user={user} />
        </OffsetContainer>
      </div>
    );
  }
}

