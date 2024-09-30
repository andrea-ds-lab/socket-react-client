import { useEffect, useState } from "react";
import ChatDisplay from "./ChatDisplay";
import { SendAction } from "./SendAction";
import { SendActionProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "./features/messages/messagesSlice";
import { RootState } from "./app/store";
import { IconButton } from '@mui/material';
import { ArrowBack } from "@mui/icons-material";

function NewChat({ user, channelName, channelInstance }: SendActionProps) {
  const TOP_BAR_HEIGHT = "4rem";
  const BOTTOM_BAR_HEIGHT = "4rem";
  const PADDING = "1rem"; // Define padding here

  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.messages);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false); // Track initial load

  useEffect(() => {
    // Load first messages batch when the chat is opened for the first time
    if (!initialLoadCompleted) {
      // @ts-ignore
      dispatch(fetchMessages(messages.length > 0 ? messages[0].id : null)).then(() => {
        console.log("QUI");
        setInitialLoadCompleted(true); // Mark initial load as complete after messages are fetched
      });
    }
  }, [dispatch]);

  return (
    <div id="mobileChat" style={{ display: "flex", flexDirection: "column", background: "var(--background-color)", height: "100vh", boxSizing: "border-box" }}>
      <div
        id="top-bar"
        style={{
          height: TOP_BAR_HEIGHT,
          display: "flex",
          width: "100%",
          background: "var(--highlight-color-light)",
          padding: PADDING,
          boxSizing: "border-box",
          alignItems: "center",
          gap: "1rem"
        }}>
        <IconButton style={{ background: "var(--highlight-color)", width: "2rem", height: "100%", color: "white", fontSize: "1rem", margin: 0, padding: 0 }}>
          <ArrowBack style={{ width: "1rem" }} />
        </IconButton>
        <p>Current channel: <b>{channelName}</b></p>
      </div>
      <div
        id="chat-content"
        style={{
          flexGrow: 1,
          height: `calc(100vh - ${TOP_BAR_HEIGHT} - ${BOTTOM_BAR_HEIGHT} - 2 * ${PADDING})`,
          display: "flex",
          width: "100%"
        }}>
        <ChatDisplay user={user} />
      </div>
      <div
        id="bottom-bar"
        style={{
          height: BOTTOM_BAR_HEIGHT,
          display: "flex",
          width: "100%",
          background: "white",
          justifyContent: "center",
          alignContent: "center"
        }}>
        <SendAction user={user} channelName={channelName} channelInstance={channelInstance} />
      </div>
    </div>
  );
}

export default NewChat;
