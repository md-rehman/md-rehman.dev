import { createClient } from "@/utils/supabase/server";
// import { useState } from "react";

export default async function Instruments() {
  const supabase = await createClient();

  const { data } = await supabase.from("prayers").select();

  return <pre> data :{JSON.stringify(data, null, 2)}</pre>;
}
