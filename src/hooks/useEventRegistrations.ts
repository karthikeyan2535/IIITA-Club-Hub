import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventRegistrations(clubId: string) {
  return useQuery({
    queryKey: ["eventRegistrations", clubId],
    queryFn: async () => {
      if (!clubId) return [];

      const { data, error } = await supabase
        .from("event_participants")
        .select(`
            id,
            event_id,
            user_id,
            registered_at,
            events ( title ),
            profiles ( name, email )
          `)
          .eq("events.club_id", clubId)
          

      if (error) throw error;
      return data || [];
    },
    enabled: !!clubId,
  });
}
