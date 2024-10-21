import React, { createContext, useState, useContext, ReactNode } from "react";

interface UserContextType {
  userAttributes: any;
  setUserAttributes: (attributes: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAttributes, setUserAttributes] = useState({});

  return (
    <UserContext.Provider value={{ userAttributes, setUserAttributes }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
