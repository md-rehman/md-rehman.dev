"use server";

import { createClient } from "@/utils/supabase/server";
import type { IPrayers_Strict_Group_By_Date } from "@/constants/mock_prayers_strict";
import { type User } from "@supabase/supabase-js";
// import {} from "@/constants/mock_auth_user";

type IInitialRenderDataType = {
  user: User | null;
  prayers: IPrayers_Strict_Group_By_Date;
};
export async function getInitialRenderData(): Promise<IInitialRenderDataType> {
  const supabase = await createClient();
  let prayers = null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase.rpc("get_prayers_by_date", {
      target_user_id: user?.id,
    });
    prayers = data;
  }

  return {
    user,
    prayers,
  };
}
