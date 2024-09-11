interface MessageBubbleProps {
  message: string;
  isSentByUser: boolean;
  username: string
}

export function MessageBubble({ message, isSentByUser, username }: MessageBubbleProps) {

  // Extract the first letter of the message
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center', // Align items vertically in the center
      justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem'
    }}>
      {!isSentByUser && (
        <div style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: '#8B2635', // Background color for the icon
          color: '#FFF', // Text color for the icon
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
          marginRight: '0.5rem' // Space between the icon and the message
        }}>
          {firstLetter}
        </div>
      )}
      <div style={{
        maxWidth: '60%',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: isSentByUser ? 'var(--chat-message-bg-light)' : 'var(--chat-message-bg-dark)',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        color: '#fff',
        fontSize: '1rem',
        wordWrap: 'break-word',
      }}>
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
