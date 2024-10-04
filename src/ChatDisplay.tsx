import { useEffect, useRef, useState } from "react";
import { ChatDisplayProps } from "./types";
import Message from "./Message"; // Assuming you have a Message component for rendering individual messages
import { EVENT_LOAD_MORE_MESSAGES, LAST_MESSAGE } from "./config";
import { CircularProgress } from "@mui/material";

function ChatDisplay({ user, messages, scrollTargetMessage }: ChatDisplayProps) {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [hasReachedTop, setHasReachedTop] = useState<boolean>(false);
  const previousScrollTop = useRef<number>(0); // To track scroll direction

  if (messages === null) {
    return <div>Loading chat...</div>;
  }

  useEffect(() => {
    if (scrollTargetMessage) {
      if (scrollTargetMessage === LAST_MESSAGE) {
        const lastMessageIndex = messages.length - 1;
        if (lastMessageIndex >= 0 && messageRefs.current[lastMessageIndex]) {
          messageRefs.current[lastMessageIndex]?.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        const targetIndex = messages.findIndex(msg => msg.id === scrollTargetMessage);
        if (targetIndex !== -1 && messageRefs.current[targetIndex]) {
          messageRefs.current[targetIndex]?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, scrollTargetMessage]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;

      if (container) {
        const currentScrollTop = container.scrollTop;

        // Check if the user has scrolled to the top
        if (currentScrollTop === 0 && !hasReachedTop) {
          setIsAtTop(true);
          setHasReachedTop(true);

          // Trigger custom event to load more messages
          console.log("Number of messages: ", messages.length);
          const loadMoreEvent = new CustomEvent(EVENT_LOAD_MORE_MESSAGES, { detail: { value: messages.length > 0 ? messages[0].id : null } });
          window.dispatchEvent(loadMoreEvent);
        } else if (currentScrollTop > 0) {
          // Reset when the user is no longer at the top
          setIsAtTop(false);
          setHasReachedTop(false);
        }

        // Update previous scroll position
        previousScrollTop.current = currentScrollTop;
      }
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasReachedTop, messages.length]);

  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
      {isAtTop && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <CircularProgress size="2rem" style={{ color: 'var(--highlight-color-light)' }} />
        </div>
      )}

      <div
        className="messages-display"
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          width: '100%',
          padding: "1rem",
          boxSizing: "border-box"
        }}
      >
        {messages.map((msg, index) => (
          <div key={msg.id} ref={(el) => (messageRefs.current[index] = el)}>
            <Message
              currentUser={user}
              id={msg.id}
              body={msg.body}
              user={msg.user}
              boosted={msg.boosted}
              channel={msg.channel}
              inserted_at={msg.inserted_at}
              updated_at={msg.updated_at}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatDisplay;
