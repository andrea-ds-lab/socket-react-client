import { MessageProps } from "./types";

interface MessageComponentProps extends MessageProps {
  currentUser: string;
}

export function Message({ currentUser, id, body, user, boosted, channel, inserted_at, updated_at }: MessageComponentProps) {
  // Extract the first letter of the username
  const firstLetter = user.charAt(0).toUpperCase();
  const isSentByUser = currentUser === user;

  function extractTime(dateString: string): string {
    // Convert the ISO date string to a Date object
    const date = new Date(dateString);

    // Extract hours and minutes in UTC
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Pad with leading zero if needed
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Pad with leading zero if needed

    // Return the time in hh:mm format
    return `${hours}:${minutes}`;
  }

  const formattedTime = extractTime(inserted_at);

  function getMessageBackgroundColor(): string {
    if (isSentByUser) {
      return boosted ? 'var(--highlight-color-light)' : 'var(--chat-message-bg-light)'
    } else {
      return 'var(--chat-message-bg-dark)'
    }
  }

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
        backgroundColor: getMessageBackgroundColor(),
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        color: '#fff',
        fontSize: '1rem',
        wordWrap: 'break-word',
        position: 'relative',
        padding: "0.5rem 1rem 1.5rem 0.5rem",
      }}>
        {body}
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
