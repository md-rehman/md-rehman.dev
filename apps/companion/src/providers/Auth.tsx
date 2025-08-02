"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User, type AuthError } from "@supabase/supabase-js";
import { authenticated_user } from "@/constants/mock_auth_user";

export const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { NEXT_PUBLIC_MOCK_AUTH_USER } = process.env;
  const [data, setData] = useState<User | null>(
    NEXT_PUBLIC_MOCK_AUTH_USER ? authenticated_user : null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setData(user);
      } catch (err) {
        console.error("AuthError: ", err);
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    }
    if (data === null) fetchData();
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ user: data }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user } = useContext(AuthContext);
  return { user };
};
