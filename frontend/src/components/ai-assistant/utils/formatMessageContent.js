 
 
 const formatMessageContent = (
    content
  ) => {
    // Safety check
    if (
      !content ||
      typeof content !== "string"
    ) {
      return "⚠️ No response available.";
    }

    return content;
  };


export default formatMessageContent;