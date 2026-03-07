import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
