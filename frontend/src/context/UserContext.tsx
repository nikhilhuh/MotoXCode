import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/user";

interface UserContextType {
  userDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  isInitialized: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from localStorage
  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
          setUserDetails(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("userDetails");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, []);

  // Synchronize state with localStorage
  useEffect(() => {
    if (isInitialized) {
      if (userDetails) {
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
      } else {
        localStorage.removeItem("userDetails");
      }
    }
  }, [userDetails, isInitialized]);

  // Synchronize across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userDetails") {
        if (event.newValue) {
          try {
            setUserDetails(JSON.parse(event.newValue));
          } catch (e) {
            console.error("Error parsing userDetails from storage event", e);
          }
        } else {
          setUserDetails(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ userDetails, setUserDetails, isInitialized }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
