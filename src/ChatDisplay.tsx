import { useRef, useEffect } from 'react';
import Message from './Message';

interface Message {
  message: string;
  timestamp: number;
  username: string;
  highlighted: boolean;
}

interface ChatProps {
  messages: Message[];
  username: string;
}

function ChatDisplay({ messages, username }: ChatProps) {
  // Create a ref for the chat container
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Depend on messages so it runs when messages change

  return (
    <div className="chat-container" style={{ maxHeight: '50vh', overflowY: 'hidden' }}>
      {messages.slice().map((msg, index) => (
        <Message
          key={index}
          message={msg.message}
          isSentByUser={msg.username === username}
          username={msg.username}
          timestamp={msg.timestamp}
        />
      ))}
      {/* Empty div to act as a scroll target */}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatDisplay;
