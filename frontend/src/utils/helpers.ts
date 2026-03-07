import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

export const formatDate = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatTimestamp = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return `Today ${formatDate(d)}`;
  } else if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${formatDate(d)}`;
  } else {
    return d.toLocaleDateString();
  }
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return false;
  }
  return message.trim().length > 0;
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    if (status === HTTP_STATUS.BAD_REQUEST) {
      return data.message || ERROR_MESSAGES.INVALID_MESSAGE;
    } else if (status === HTTP_STATUS.UNAUTHORIZED) {
      return 'Unauthorized. Please login again.';
    } else if (status === HTTP_STATUS.FORBIDDEN) {
      return 'You do not have permission to perform this action.';
    } else if (status === HTTP_STATUS.NOT_FOUND) {
      return 'Resource not found.';
    } else if (status >= HTTP_STATUS.SERVER_ERROR) {
      return data.message || ERROR_MESSAGES.API_ERROR;
    }
  } else if (error.request) {
    // Request made but no response received
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Error in request setup
    return ERROR_MESSAGES.API_ERROR;
  }
};

export const createMessage = (text, sender, id) => ({
  id,
  text,
  sender,
  timestamp: new Date(),
});
