import { useEffect, useRef, useState } from "react";
import Message from "./Message";

interface Message {
  body: string;
  timestamp: number;
  user: string;
  boosted: boolean;
}

interface ChatDisplayProps {
  user: string;
  lastUpdate: number;
}

function ChatDisplay({ user, lastUpdate }: ChatDisplayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("In useEffect, loading past messages...")
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/messages');
        if (!response.ok) {
          console.log("Error while loading the messages.")

          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error: any) {
        setError(error.message);
      } finally {
        console.log("Messages loaded.")
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="chat-container"
      style={{
        maxHeight: '50vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      }}
    >
      {/* For WebKit browsers */}
      <style>
        {`
          .chat-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {messages.map((msg, index) => (
        <Message
          key={index}
          body={msg.body}
          isSentByUser={msg.user === user}
          user={msg.user}
          timestamp={msg.timestamp}
          boosted={msg.boosted}
        />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatDisplay;
