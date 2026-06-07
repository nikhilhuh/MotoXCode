import React from 'react';

interface NotSignedInModalProps {
  message: string;
  onClose: () => void;
}

export const NotSignedInModal: React.FC<NotSignedInModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-lg shadow-2xl max-w-sm w-full text-center relative mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
        >
          ✕
        </button>
        <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-primary)] mb-4 uppercase tracking-wider">
          Access Restricted
        </h2>
        <p className="text-[var(--color-text-secondary)] font-[var(--font-body)] mb-6">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="btn-primary w-full py-3"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default NotSignedInModal;
