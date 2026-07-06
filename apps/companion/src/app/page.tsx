import { redirect } from "next/navigation";
import { createClient } from "@repo/auth/server";
import { HomeClient } from "@/components/page/home/HomeClient";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect("/login");
  }

  return <HomeClient />;
}
