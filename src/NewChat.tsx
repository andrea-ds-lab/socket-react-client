import { useEffect, useState } from "react";
import ChatDisplay from "./ChatDisplay";
import { SendAction } from "./SendAction";
import { SendActionProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "./features/messages/messagesSlice";
import { RootState } from "./app/store";

function NewChat({ user, channelName, channelInstance }: SendActionProps) {

  const TOP_BAR_HEIGHT = "4rem"
  const BOTTOM_BAR_HEIGHT = "4rem"

  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.messages);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false); // Track initial load

  useEffect(() => {
    // Load first messages batch when the chat is opened for the first time
    if (!initialLoadCompleted) {
      // @ts-ignore
      dispatch(fetchMessages(messages.length > 0 ? messages[0].id : null)).then(() => {
        console.log("QUI")
        setInitialLoadCompleted(true); // Mark initial load as complete after messages are fetched
      });
    }
  }, [dispatch]);

  return (
    <div id="mobileChat" style={{ display: "flex", flexDirection: "column", background: "var(--background-color)", height: "100%" }}>
      <div id="top-bar" style={{ height: "4rem", display: "flex", width: "100%", background: "var(--highlight-color-light)" }}>
      </div>
      <div id="chat-content" style={{ flexGrow: 1, maxHeight: `calc(100% - ${TOP_BAR_HEIGHT} - ${BOTTOM_BAR_HEIGHT})`, display: "flex", width: "100%" }}>
        <ChatDisplay user={user} />
      </div>
      <div id="bottom-bar" style={{ height: "4rem", display: "flex", width: "100%", background: "white", justifyContent: "center", alignContent: "center" }}>
        <SendAction user={user} channelName={channelName} channelInstance={channelInstance} />
      </div>

    </div >);
}

export default NewChat;
