import { createClient } from "@repo/auth/server";
// import { useState } from "react";

export default async function Instruments() {
  const supabase = await createClient();

  const { data } = await supabase.from("prayers").select();

  return <pre> data :{JSON.stringify(data, null, 2)}</pre>;
}
