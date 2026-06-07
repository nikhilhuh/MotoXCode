import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import toast from "react-hot-toast";
import NotSignedInModal from "../components/ui/NotSignedInModal";

interface FeedbackContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showNotSignedIn: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notSignedInMessage, setNotSignedInMessage] = useState<string>("");

  const showError = useCallback((message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: "var(--color-bg)",
        border: "1px solid var(--color-error, #ef4444)",
        color: "#f8fafc",
      },
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: "var(--color-bg)",
        border: "1px solid var(--color-success, #22c55e)",
        color: "#f8fafc",
      },
    });
  }, []);

  const showNotSignedIn = useCallback((message: string) => {
    setNotSignedInMessage(message);
  }, []);

  const handleCloseModal = useCallback(() => {
    setNotSignedInMessage("");
  }, []);

  return (
    <FeedbackContext.Provider value={{ showError, showSuccess, showNotSignedIn }}>
      {children}
      <NotSignedInModal message={notSignedInMessage} onClose={handleCloseModal} />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
