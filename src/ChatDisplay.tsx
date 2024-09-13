import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';

interface Message {
  body: string;
  timestamp: number;
  user: string;
  boosted: boolean;
}

interface ChatDisplayProps {
  user: string;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/messages');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data.messages); // Assuming `data.messages` is the array of messages
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Depend on messages so it runs when messages change

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chat-container" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
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
      {/* Empty div to act as a scroll target */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatDisplay;
