import { useEffect, useState } from "react";
import { SendAction } from "./SendAction";
import { SendActionProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { addHistory, fetchMessages, setTargetMessage } from "./features/messages/messagesSlice";
import { RootState } from "./app/store";
import { IconButton } from '@mui/material';
import { ArrowBack } from "@mui/icons-material";
import ChatDisplay from "./ChatDisplay";
import { EVENT_LOAD_MORE_MESSAGES, EVENT_SCROLL_TO, MESSAGES_BATCH_SIZE, PATH_LOGIN } from "./config";
import { useNavigate } from "react-router-dom";

function NewChat({ user, channelName, channelInstance }: SendActionProps) {
  const TOP_BAR_HEIGHT = "4rem";
  const BOTTOM_BAR_HEIGHT = "4rem";
  const PADDING = "1rem"; // Define padding here

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, scrollTargetMessage } = useSelector((state: RootState) => state.messages);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false); // Track initial load
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

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

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('Received custom event:', customEvent.detail.value);
    };

    const handleLoadMoreMessage = (e: Event) => {
      if (isFetchingHistory) return
      const customEvent = e as CustomEvent;
      console.log('Load more messages!', customEvent.detail.value)
      setIsFetchingHistory(true);
      console.log(messages, { amount: MESSAGES_BATCH_SIZE, oldestId: customEvent.detail.value })
      // @ts-ignore
      dispatch(addHistory({ amount: MESSAGES_BATCH_SIZE }))
      console.log(messages.filter(mex => mex.id === customEvent.detail.value))
      dispatch(setTargetMessage(customEvent.detail.value))
    }

    window.addEventListener(EVENT_SCROLL_TO, handleCustomEvent as EventListener);
    window.addEventListener(EVENT_LOAD_MORE_MESSAGES, handleLoadMoreMessage as EventListener);

    return () => {
      window.removeEventListener(EVENT_SCROLL_TO, handleCustomEvent as EventListener);
      window.removeEventListener(EVENT_LOAD_MORE_MESSAGES, handleLoadMoreMessage as EventListener);

    };
  }, []);

  const goBack = async () => {
    navigate(PATH_LOGIN)
  }

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
          gap: "1rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
        }}>
        <IconButton onClick={goBack} style={{ background: "var(--highlight-color)", width: "2rem", height: "100%", color: "white", fontSize: "1rem", margin: 0, padding: 0 }}>
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
        <ChatDisplay user={user} messages={messages} scrollTargetMessage={scrollTargetMessage} />
      </div>
      <div
        id="bottom-bar"
        style={{
          height: BOTTOM_BAR_HEIGHT,
          display: "flex",
          width: "100%",
          background: "white",
          justifyContent: "center",
          alignContent: "center",
          boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
        }}>
        <SendAction user={user} channelName={channelName} channelInstance={channelInstance} />
      </div>
    </div>
  );
}

export default NewChat;
