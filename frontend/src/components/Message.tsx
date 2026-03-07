import React from 'react';
import PropTypes from 'prop-types';
import { User, Bot } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-red-700'
            : 'bg-gradient-to-br from-red-700 to-amber-500'
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-red-700 text-white rounded-br-none'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-red-100' : 'text-gray-500'}`}>
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'bot', 'system']).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

export default Message;
