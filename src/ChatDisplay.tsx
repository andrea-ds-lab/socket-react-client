import { useRef, useEffect } from 'react';
import Message from './Message';

interface Message {
  body: string;
  timestamp: number;
  user: string;
  boosted: boolean;
}

interface ChatProps {
  messages: Message[];
  user: string;
}

function ChatDisplay({ messages, user }: ChatProps) {
  // Create a ref for the chat container
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    messages.slice().map((msg, index) => {
      console.log(msg.user, user)
    });
  }, [messages]); // Depend on messages so it runs when messages change

  return (
    <div className="chat-container" style={{ maxHeight: '50vh', overflowY: 'hidden' }}>
      {messages.slice().map((msg, index) => (
        <Message
          key={index}
          body={msg.body}
          isSentByUser={msg.user === user}
          user={msg.user}
          timestamp={msg.timestamp}
          boosted={msg.boosted}
        />
      ))}
      {/* Empty div to act as a scroll target */}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatDisplay;
