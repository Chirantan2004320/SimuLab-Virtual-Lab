const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
}) => {
  return (
    <div className="ai-chat-input">
      <input
        type="text"
        placeholder="Ask something..."
        value={inputMessage}
        onChange={(e) =>
          setInputMessage(
            e.target.value
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />

      <button className="ai-send-btn"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;