import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addHistory } from './features/messages/messagesSlice';
import { RootState } from './app/store';
import Message from './Message';
import { CircularProgress } from '@mui/material';
import { MESSAGES_BATCH_SIZE } from './config';

interface TempChatProps {
  user: string;
}

function TempChat({ user }: TempChatProps) {
  const dispatch = useDispatch();
  const { messages, loading, error, lastMessagesAdded, targetMessage } = useSelector((state: RootState) => state.messages);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const tombstoneRef = useRef<HTMLDivElement | null>(null);
  const [tombstoneVisible, setTombstoneVisible] = useState(false);
  const [showLoadingIcon, setShowLoadingIcon] = useState(true);

  // Scroll to the bottom of the messages on initial load
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Function to check if the tombstone is visible
  const checkTombstoneVisibility = () => {
    if (tombstoneRef.current && chatContainerRef.current) {
      const tombstoneRect = tombstoneRef.current.getBoundingClientRect();
      const containerRect = chatContainerRef.current.getBoundingClientRect();

      // Check if the tombstone is at least 50% visible
      const isVisible =
        tombstoneRect.bottom >= containerRect.top &&
        tombstoneRect.top <= containerRect.bottom &&
        tombstoneRect.height <= containerRect.bottom - tombstoneRect.top;

      if (isVisible && !tombstoneVisible) {
        console.log('Tombstone is visible: Load more history');

        // Get current scroll position before loading new messages
        const currentScrollTop = chatContainerRef.current.scrollTop;

        // Capture the current height of the container before new messages are added
        const currentHeight = chatContainerRef.current.scrollHeight;

        if (lastMessagesAdded !== null && lastMessagesAdded.length === 0) {
          console.log(lastMessagesAdded)
          setShowLoadingIcon(false)
        }


        // Dispatch the addHistory action
        dispatch(addHistory({ oldestId: messages.length > 0 ? messages[0].id : null, amount: MESSAGES_BATCH_SIZE }));

        // Adjust scroll position after messages are added
        setTimeout(() => {
          if (chatContainerRef.current) {
            // Reset scroll to the top of the existing messages
            chatContainerRef.current.scrollTop = 0;

            // Calculate the new height of the container after messages are added
            const newHeight = chatContainerRef.current.scrollHeight;
            console.log(newHeight)

            // Maintain the scroll position at the top of the messages
            chatContainerRef.current.scrollTop = currentScrollTop + (newHeight - currentHeight);
          }
        }, 2000); // Timeout to ensure this runs after the state updates
        setTombstoneVisible(true); // Mark tombstone as visible
      } else if (!isVisible && tombstoneVisible) {
        setTombstoneVisible(false); // Mark tombstone as not visible
      }
    }
  };

  // Handle user scroll events
  const handleScroll = () => {
    checkTombstoneVisibility();


  };

  // Render loading or error states
  if (loading) return (
    <div style={{ padding: '1rem', height: '100%' }}>
      <p>Loading...</p>
    </div>
  );
  if (error) return (
    <div style={{ padding: '1rem', height: '100%' }}>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div
      className="chat-container"
      ref={chatContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        width: '100%',
      }}
      onScroll={handleScroll} // Attach scroll handler
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
      <div ref={tombstoneRef} style={{ justifyContent: 'center', display: showLoadingIcon ? "flex" : "none", height: '2rem' }}>
        <CircularProgress size={'2rem'} sx={{ color: 'var(--highlight-color-light)' }} />
      </div>
      {/* Render messages dynamically */}
      {messages.map((msg) => (
        <Message
          currentUser={user}
          key={msg.id}
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
      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default TempChat;
