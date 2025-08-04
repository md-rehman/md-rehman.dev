import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User, type AuthError } from "@supabase/supabase-js";
import type { I_PRAYER_STATUS, I_PRAYER_TIME } from "@/types/fundamental";

interface IPrayerType {
  user_id: string;
  time: string;
  status: string;
  date: string;
}

type IPrayerStrictType = { [K in I_PRAYER_TIME]?: I_PRAYER_STATUS } & {
  user_id: string;
  date: string;
  id: number;
};

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
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  async function addPrayer(prayer: IPrayerStrictType) {
    try {
      setLoading(true);
      const response = await supabase
        .from("prayers_strict")
        .upsert(prayer)
        .select();

      setData(response?.data[0]);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      console.log("MYLOG: tseting: ");
      setLoading(false);
    }
  }

  console.log("MYLOG: usePrayersStrictAPI data: ", data, loading, error);

  return { data, loading, error, addPrayer };
};
