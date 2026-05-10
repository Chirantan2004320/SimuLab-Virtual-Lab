import ReactMarkdown from "react-markdown";

import formatMessageContent from "../utils/formatMessageContent";
import TypingIndicator from "./TypingIndicator";

const ChatMessages = ({
  messages,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className="ai-chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`ai-message ${msg.type}`}
        >
          <div className="ai-message-content">
            <ReactMarkdown>
              {formatMessageContent(
                msg.content
              )}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;