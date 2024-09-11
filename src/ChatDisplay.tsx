import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble'; // Adjust the path as needed

interface Message {
  message: string;
  timestamp: number;
  username: string;
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
    <div className="chat-container" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
      {messages.slice().map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.message}
          isSentByUser={msg.username === username}
          username={msg.username}
        />
      ))}
      {/* Empty div to act as a scroll target */}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatDisplay;
