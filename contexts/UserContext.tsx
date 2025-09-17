import React, { createContext, useState, useEffect, useContext } from "react";

type UserContextType = {
  user: {
    role: "AR" | "CD";
    name: string;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      role: "AR" | "CD";
      name: string;
    }>
  >;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    role: "AR" | "CD";
    name: string;
  }>({
    role: "AR",
    name: "김아티스트",
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
