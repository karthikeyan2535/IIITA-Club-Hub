
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMyClubs() {
  return useQuery({
    queryKey: ["myClubs"],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("club_members")
        .select("clubs:club_id(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data?.map((row: any) => row.clubs) ?? [];
    },
  });
}
