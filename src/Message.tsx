interface MessageProps {
  message: string;
  timestamp: number; // Added timestamp for time display
  isSentByUser: boolean;
  username: string;
}

export function Message({ message, timestamp, isSentByUser, username }: MessageProps) {
  // Extract the first letter of the username
  const firstLetter = username.charAt(0).toUpperCase();

  // Format timestamp to hour:minute
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formattedTime = formatTime(timestamp);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center', // Align items vertically in the center
      justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem',
      position: 'relative',
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
        borderRadius: '0.5rem',
        backgroundColor: isSentByUser ? 'var(--chat-message-bg-light)' : 'var(--chat-message-bg-dark)',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        color: '#fff',
        fontSize: '1rem',
        wordWrap: 'break-word',
        position: 'relative',
        padding: "0.5rem 1rem 1.5rem 0.5rem",
      }}>
        {message}
        <div style={{
          fontSize: '0.6rem',
          color: '#ccc',
          position: 'absolute',
          bottom: '0.5rem', // Position the time 0.5rem from the bottom
          right: '0.5rem', // Position the time 0.5rem from the right
        }}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;
