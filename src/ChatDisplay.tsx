import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages } from './features/messages/messagesSlice';
import { RootState } from './app/store';
import Message from './Message';

interface ChatDisplayProps {
  user: string;
}

function ChatDisplay({ user }: ChatDisplayProps) {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.messages);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages on component mount
  useEffect(() => {
    const startFromDate = null; // Pass null to use the default date (1st January 2024)
    dispatch(fetchMessages(startFromDate));
  }, [dispatch]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Render loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Render the chat messages
  return (
    <div
      className="chat-container"
      style={{
        maxHeight: '50vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
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
          currentUser={user}
          key={index}
          id={msg.id}
          body={msg.body}
          user={msg.user}
          boosted={msg.boosted}
          channel={msg.channel}
          inserted_at={msg.inserted_at}
          updated_at={msg.updated_at}
        />
      ))}
      {/* Empty div to act as a scroll target */}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatDisplay;
