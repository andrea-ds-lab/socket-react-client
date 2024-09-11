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
  return (
    <div className="chat-container">
      {messages.slice().reverse().map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.message}
          isSentByUser={msg.username === username}
          username={msg.username}
        />
      ))}
    </div>
  );
}

export default ChatDisplay;
