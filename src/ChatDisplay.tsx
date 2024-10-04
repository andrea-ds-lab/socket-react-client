import { useEffect, useRef, useState } from "react";
import { ChatDisplayProps } from "./types";
import Message from "./Message"; // Assuming you have a Message component for rendering individual messages
import { EVENT_LOAD_MORE_MESSAGES, LAST_MESSAGE } from "./config";
import { CircularProgress } from "@mui/material";

function ChatDisplay({ user, messages, targetMessage }: ChatDisplayProps) {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [lastEventTime, setLastEventTime] = useState<number>(0);
  const [hasReachedTop, setHasReachedTop] = useState<boolean>(false);
  const previousScrollTop = useRef<number>(0); // Per tracciare la direzione dello scroll

  if (messages === null) {
    return <div>Loading chat...</div>;
  }

  useEffect(() => {
    if (targetMessage) {
      if (targetMessage === LAST_MESSAGE) {
        const lastMessageIndex = messages.length - 1;
        if (lastMessageIndex >= 0 && messageRefs.current[lastMessageIndex]) {
          messageRefs.current[lastMessageIndex]?.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        const targetIndex = messages.findIndex(msg => msg.id === targetMessage);
        if (targetIndex !== -1 && messageRefs.current[targetIndex]) {
          messageRefs.current[targetIndex]?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, targetMessage]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;

      if (container) {
        const currentScrollTop = container.scrollTop;
        const currentTime = Date.now();

        // Controlla se l'utente ha scrollato verso l'alto ed è in cima
        if (currentScrollTop === 0 && previousScrollTop.current > currentScrollTop) {
          if (!hasReachedTop && currentTime - lastEventTime > 5000) {
            setIsAtTop(true);
            setLastEventTime(currentTime);
            setHasReachedTop(true);

            // Trigger evento custom per caricare più messaggi
            const loadMoreEvent = new CustomEvent(EVENT_LOAD_MORE_MESSAGES, { detail: { value: messages.length > 0 ? messages[0].id : null } });
            window.dispatchEvent(loadMoreEvent);
          }
        } else if (currentScrollTop > 0) {
          // Reset quando l'utente non è più in cima
          setIsAtTop(false);
          setHasReachedTop(false); // Permette di riemettere l'evento solo quando si torna in cima dall'alto
        }

        // Aggiorna il precedente valore di scrollTop
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
  }, [lastEventTime, hasReachedTop]);

  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
      {isAtTop ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <CircularProgress size="2rem" style={{ color: 'var(--highlight-color-light)' }} />
        </div>
      ) : null}

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
          <div
            key={msg.id}
            ref={(el) => (messageRefs.current[index] = el)}
          >
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
      </div></div>
  );
}

export default ChatDisplay;
