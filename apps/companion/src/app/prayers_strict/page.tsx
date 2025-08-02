import { createClient } from "@/utils/supabase/server";
import { Container } from "@/components/page/prayers_strict/Container";
import {
  prayers_strict,
  prayer_strict_group_by_date,
  IPrayers_Strict,
} from "@/constants/mock_prayers_strict";

export default async function Prayers() {
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // const { data: prayers } = await supabase.from("prayers_strict").select();
  // .eq(user_id === user.id);

  // return <pre> prayers :{JSON.stringify(prayers, null, 2)}</pre>;
  return <Container prayers={prayer_strict_group_by_date} />;
}
