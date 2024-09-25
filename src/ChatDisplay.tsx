import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addHistory, fetchMessages } from './features/messages/messagesSlice';
import { RootState } from './app/store';
import Message from './Message';
import { CircularProgress } from '@mui/material';
import { MESSAGES_BATCH_SIZE } from './config';

interface ChatDisplayProps {
  user: string;
}

function ChatDisplay({ user }: ChatDisplayProps) {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.messages);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const tombstoneRef = useRef<HTMLDivElement | null>(null);
  const [tombstoneVisible, setTombstoneVisible] = useState(false);

  // Fetch messages on component mount
  useEffect(() => {
    dispatch(fetchMessages(messages.length > 0 ? messages[0].id : null));
  }, [dispatch]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Function to check if the tombstone is visible
  const checkTombstoneVisibility = () => {
    if (tombstoneRef.current && chatContainerRef.current) {
      const tombstoneRect = tombstoneRef.current.getBoundingClientRect();
      const containerRect = chatContainerRef.current.getBoundingClientRect();

      // Check if the tombstone is in the visible area of the container
      const isVisible =
        tombstoneRect.bottom >= containerRect.top && tombstoneRect.top <= containerRect.bottom;

      if (isVisible && !tombstoneVisible) {
        console.log('Tombstone is visible: Load more history');
        dispatch(addHistory({ oldestId: messages.length > 0 ? messages[0].id : null, amount: MESSAGES_BATCH_SIZE }));
        // Call your function to load more messages here
        setTombstoneVisible(true); // Mark tombstone as visible
      } else if (!isVisible && tombstoneVisible) {
        setTombstoneVisible(false); // Mark tombstone as not visible
      }
    }
  };

  // Render loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Render the chat messages
  return (
    <div
      className="chat-container"
      ref={chatContainerRef}
      style={{
        maxHeight: '50vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      onScroll={checkTombstoneVisibility}
    >
      {/* For WebKit browsers */}
      <style>
        {`
          .chat-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* Tombstone div to detect visibility */}
      <div ref={tombstoneRef} style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress size={"2rem"} sx={{ color: "var(--highlight-color-light)" }} />
      </div>
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
      <div style={{ height: '1px' }} />
    </div>
  );
}

export default ChatDisplay;
