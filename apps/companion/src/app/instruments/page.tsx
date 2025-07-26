import { createClient } from "@/utils/supabase/server";
// import { useState } from "react";

export default async function Instruments() {
  const supabase = await createClient();
  console.log("MYLOG: supabase: ", supabase);

  const { data: instruments } = await supabase.from("instruments").select();

  console.log("MYLOG: instruments: ", instruments);

  return <pre> instruments :{JSON.stringify(instruments, null, 2)}</pre>;
}
