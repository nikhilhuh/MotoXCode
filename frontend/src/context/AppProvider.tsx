import React from "react";
import { UserProvider } from "./UserContext";
import { FeedbackProvider } from "./FeedbackContext";
import { Toaster } from "react-hot-toast";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <FeedbackProvider>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </FeedbackProvider>
    </UserProvider>
  );
};
