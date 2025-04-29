
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch event registrations for logged in user
export function useMyEventRegistrations() {
  return useQuery({
    queryKey: ["myEventRegistrations"],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("event_participants")
        .select("event_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data?.map((row: any) => row.event_id) ?? [];
    },
  });
}

// Register for an event
export function useRegisterEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: { eventId: string; name: string; email: string }) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase
        .from("event_participants")
        .insert({
          event_id: event.eventId,
          user_id: user.id,
          name: event.name,
          email: event.email,
        });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myEventRegistrations"] });
      qc.invalidateQueries({ queryKey: ["myEvents"] });
    },
  });
}

// Unregister from an event
export function useUnregisterEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myEventRegistrations"] });
      qc.invalidateQueries({ queryKey: ["myEvents"] });
    },
  });
}
