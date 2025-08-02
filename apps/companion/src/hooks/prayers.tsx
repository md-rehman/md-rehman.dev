import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User, type AuthError } from "@supabase/supabase-js";

interface IPrayerType {
  user_id: string;
  time: string;
  status: string;
  date: string;
}

export const usePrayersAPI = () => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  async function addPrayer(data: IPrayerType) {
    try {
      setLoading(true);
      const response = await supabase.from("prayers").insert(data).select();
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, addPrayer };
};

export const usePrayersStrictAPI = () => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  async function addPrayer(data: IPrayerType) {
    try {
      setLoading(true);
      const response = await supabase
        .from("prayers_strict")
        .insert(data)
        .select();
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, addPrayer };
};
