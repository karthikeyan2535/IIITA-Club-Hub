
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/models";

// Fetch all events for a specific club
export function useClubEvents(clubId: string) {
  return useQuery({
    queryKey: ["clubEvents", clubId],
    queryFn: async () => {
      if (!clubId) {
        return [];
      }
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("club_id", clubId)
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clubId,
  });
}

// Create a new event
export function useCreateEvent() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");

        // Map the Event type properties to the database column names
        const { data, error } = await supabase
          .from("events")
          .insert({
            title: eventData.title,
            description: eventData.description,
            club_id: eventData.clubId,
            club_name: eventData.clubName || "", // Ensure club_name is always provided
            date: eventData.date || "",
            time: eventData.time || "",
            location: eventData.location || "",
            max_participants: eventData.maxParticipants,
            eligibility: eventData.eligibility,
            rules: eventData.rules,
            organizer_id: user.id,
            registered_participants: 0
          })
          .select('*')
          .single();
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error("Create event error:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubEvents", variables.clubId] });
      qc.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Update an event
export function useUpdateEvent() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: Partial<Event> }) => {
      // Map frontend properties to database column names
      const dbData: any = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location
      };
      
      // Only include properties that are actually provided
      if (data.maxParticipants !== undefined) dbData.max_participants = data.maxParticipants;
      if (data.eligibility !== undefined) dbData.eligibility = data.eligibility;
      if (data.rules !== undefined) dbData.rules = data.rules;
      
      const { error } = await supabase
        .from("events")
        .update(dbData)
        .eq("id", eventId);

      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubEvents", variables.data.clubId] });
      qc.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Delete an event
export function useDeleteEvent() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ eventId, clubId }: { eventId: string, clubId: string }) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubEvents", variables.clubId] });
      qc.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Get events that a student is registered for
export function useStudentEvents() {
  return useQuery({
    queryKey: ["studentEvents"],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");

      // Get the event IDs the student is registered for
      const { data: registrations, error: regError } = await supabase
        .from("event_participants")
        .select("event_id")
        .eq("user_id", user.id);
      
      if (regError) throw regError;
      
      if (!registrations || registrations.length === 0) {
        return [];
      }
      
      const eventIds = registrations.map(reg => reg.event_id);
      
      // Get the actual event details
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);
      
      if (eventsError) throw eventsError;
      
      return events || [];
    }
  });
}

// Get all upcoming events (for the Events page)
export function useAllUpcomingEvents() {
  return useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", today)
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
}
