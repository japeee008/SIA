import React from "react";

const MessageList = ({ messages, isLoading }) => {

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">

      <div className="max-w-3xl mx-auto space-y-6">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >

            <div
              className={`
                max-w-[70%] px-4 py-3 rounded-2xl shadow-sm
                ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border rounded-bl-sm"
                }
              `}
            >
              {msg.text}
            </div>

          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border px-4 py-2 rounded-xl text-gray-500">
              Chatbot is typing...
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default MessageList;