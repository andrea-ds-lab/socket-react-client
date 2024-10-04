import { useEffect, useState } from "react";
// @ts-ignore
import socket from "./socket";
import './css/theme.css';
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "./features/messages/messagesSlice";
import { Channel, MessageProps } from "./types";
import NewChat from "./NewChat";
import { RootState } from "./app/store";

export function ChatMiddleware({ }) {
  const [channelName, setChannelName] = useState<string>("lobby");
  const [channel, setChannel] = useState<Channel | null>(null);

  const username = useSelector((state: RootState) => state.account.user?.name);
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

  return <NewChat user={username ? username : "anonymous"} channelName={channelName} channelInstance={channel} />;

}

export default ChatMiddleware;