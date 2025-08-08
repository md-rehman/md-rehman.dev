import { createClient } from "@/utils/supabase/server";
import { Container } from "@/components/page/prayers/Container";

export default async function Prayers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: prayers } = await supabase.from("prayers").select();

  return <pre> prayers :{JSON.stringify(prayers, null, 2)}</pre>;
  return <Container />;
}
