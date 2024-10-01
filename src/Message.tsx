import { MessageProps } from "./types";
import './css/theme.css';
import { SmartToy } from "@mui/icons-material";
import { AI_MODEL_NAME } from "./config";


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

  function getSpeakerIcon() {

    if (!isSentByUser) {
      if (user === AI_MODEL_NAME) {
        return (
          <div className="tooltip">
            <SmartToy style={{ marginRight: "0.5rem" }} />
            <span className="tooltiptext">{user}</span>
          </div>
        )
      } else {
        return (
          <div className="tooltip">
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: '#8B2635',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginRight: '0.5rem'
            }}>
              {firstLetter}
              <span className="tooltiptext">{user}</span>
            </div>
          </div>
        )
      }
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
      {getSpeakerIcon()}
      <div style={{
        maxWidth: '60%',
        minWidth: "2rem",
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
          bottom: '0.5rem',
          right: '0.5rem',
        }}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;
