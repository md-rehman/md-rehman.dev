import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppProvider } from "@/providers/App";
import { AuthProvider } from "@/providers/Auth";
import { createClient } from "@/utils/supabase/server";
import { getInitialRenderData } from "@/actions/root";

export const AppLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, prayers } = await getInitialRenderData();

  return (
    <AuthProvider user={user}>
      <AppProvider prayers={prayers}>
        <Header />
        {children}
        <Footer />
      </AppProvider>
    </AuthProvider>
  );
};
