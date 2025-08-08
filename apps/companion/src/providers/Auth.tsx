"use client";

import { createContext, useContext } from "react";
import { type User } from "@supabase/supabase-js";
import { authenticated_user } from "@/constants/mock_auth_user";

export const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  user: User | null;
  mock?: boolean;
}> = ({ children, user, mock }) => {
  return (
    <AuthContext.Provider value={{ user: mock ? authenticated_user : user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user } = useContext(AuthContext);
  return { user };
};
