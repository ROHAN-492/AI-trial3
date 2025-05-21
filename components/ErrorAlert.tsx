
import React from 'react';

interface ErrorAlertProps {
  message: string | null;
  onClose?: () => void;
}

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-red-400">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-3a1 1 0 112 0v1a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div 
        className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative animate-fade-in" 
        role="alert"
    >
        <div className="flex items-center">
            <ErrorIcon />
            <div className="ml-3">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-1">{message}</span>
            </div>
        </div>
      {onClose && (
        <button 
            onClick={onClose} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-400 hover:text-red-200 transition-colors"
            aria-label="Close error message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
