import { redirect } from "next/navigation";
import { createClient } from "@repo/auth/server";
import { HomeClient } from "@/components/page/home/HomeClient";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: prayers, error: prayersError } = await supabase
    .from("prayers")
    .select("*")
    .eq("user_id", data.user.id);

  if (prayersError) {
    console.error("Error fetching prayers:", prayersError);
  }

  return <HomeClient prayers={prayers || []} />;
}
