import React, { useState } from "react";

interface Message {
  sender: "user" | "bot";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: message },
      ]);
      setMessage("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: "This is a bot response!" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          onClick={toggleChat}
          className="bg-blue-500 w-5 h-5 flex justify-center fixed right-6 mt-1 items-center rounded-full text-white cursor-pointer"
        >
          x
        </div>
      ) : (
        <div
          onClick={toggleChat}
          className="bg-blue-500 p-3 rounded-full text-white cursor-pointer"
        >
          Chat
        </div>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
          <div className="flex-1 overflow-auto mb-4">
            {messages?.length == 0 && (
              <div className="text-gray-600 mt-4">
                Chatbot messages will appear here...
              </div>
            )}
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    msg.sender === "user"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="border rounded-l-md w-full px-2 py-1"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-1 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
