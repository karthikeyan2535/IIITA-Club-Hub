
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch all upcoming events for the user's joined clubs
export function useClubEvents() {
  return useQuery({
    queryKey: ["myEvents"],
    queryFn: async () => {
      // Get joined clubs
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { data: memberships, error: mErr } = await supabase
        .from("club_members")
        .select("club_id")
        .eq("user_id", user.id);
      if (mErr) throw mErr;
      const clubIds = memberships?.map((m: any) => m.club_id) ?? [];
      if (clubIds.length === 0) return [];
      // Get events from those clubs
      const { data: events, error: evErr } = await supabase
        .from("events")
        .select("*")
        .in("club_id", clubIds)
        .order("date", { ascending: true });
      if (evErr) throw evErr;
      return events ?? [];
    },
  });
}
