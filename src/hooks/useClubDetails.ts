import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "@/hooks/useClubs";
import { Club } from "@/types/models";
import { getClubById } from "@/services/dataService";

interface ClubDetailsOptions {
  enabled?: boolean;
  fallbackToMock?: boolean;
}

export function useClubDetails(clubId: string | null | undefined, options: ClubDetailsOptions = {}) {
  const { enabled = true, fallbackToMock = true } = options;
  
  return useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      if (!clubId) {
        return null;
      }
      
      if (!isValidUUID(clubId)) {
        return null;
      }
      
      try {
        // Try to fetch from Supabase first
        const { data: clubData, error } = await supabase
          .from("clubs")
          .select("*")
          .eq("id", clubId)
          .single();
        
        if (error) {
          console.warn("Club not found in Supabase:", clubId);
          
          // Fall back to mock data service if enabled
          if (fallbackToMock) {
            const mockClubData = await getClubById(clubId);
            if (!mockClubData) {
              return null;
            }
            return mockClubData;
          }
          
          return null;
        }
        
        // Format the Supabase data to match our Club model
        const formattedClub: Club = {
          id: clubData.id,
          name: clubData.name,
          description: clubData.description,
          category: clubData.category,
          vision: clubData.vision || undefined,
          memberCount: clubData.member_count || 0,
          eventCount: clubData.event_count || 0,
          imageUrl: clubData.image_url || "",
          leads: clubData.leads || [],
          ongoingActivities: clubData.ongoing_activities || [],
          followers: clubData.followers || 0
        };
        
        return formattedClub;
      } catch (error) {
        console.warn("Failed to fetch club details:", error);
        return null;
      }
    },
    enabled: enabled && Boolean(clubId),
  });
}

// Add a hook to fetch club announcements
export function useClubDetailsWithAnnouncements(clubId: string | null | undefined, options: ClubDetailsOptions = {}) {
  const clubDetails = useClubDetails(clubId, options);
  
  const announcements = useQuery({
    queryKey: ["clubAnnouncements", clubId],
    queryFn: async () => {
      if (!clubId) return [];
      
      const { data, error } = await supabase
        .from("club_announcements")
        .select("*")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false });
      
      if (error) return [];
      return data || [];
    },
    enabled: Boolean(clubId) && options.enabled !== false,
  });
  
  return {
    clubDetails,
    announcements,
  };
}