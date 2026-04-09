// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

// Export the context
export const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState("Normal");

  // TEMP username for testing cart
  const [username, setUsername] = useState("testuser");

  return (
    <UserContext.Provider value={{ userType, setUserType, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Optional hook
export const useUser = () => useContext(UserContext);