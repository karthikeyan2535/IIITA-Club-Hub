
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Announcement {
  id: string;
  club_id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
}

// Fetch announcements for a specific club
export function useClubAnnouncements(clubId: string) {
  return useQuery({
    queryKey: ["clubAnnouncements", clubId],
    queryFn: async () => {
      if (!clubId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("club_announcements")
        .select("*")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Announcement[] || [];
    },
    enabled: !!clubId,
  });
}

// Create a new announcement
export function useCreateAnnouncement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (announcement: { 
      clubId: string; 
      title: string; 
      content: string;
    }) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");
        
        const { data, error } = await supabase
          .from("club_announcements")
          .insert({
            club_id: announcement.clubId,
            title: announcement.title,
            content: announcement.content,
            created_by: user.id
          })
          .select('*')
          .single();
        
        if (error) {
          console.error("Create announcement error:", error);
          toast({
            title: "Error creating announcement",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Announcement created successfully!",
        });
        
        return data;
      } catch (error) {
        console.error("Create announcement error:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubAnnouncements", variables.clubId] });
    },
  });
}

// Delete an announcement
export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ announcementId, clubId }: { announcementId: string, clubId: string }) => {
      try {
        const { error } = await supabase
          .from("club_announcements")
          .delete()
          .eq("id", announcementId);
        
        if (error) {
          console.error("Delete announcement error:", error);
          toast({
            title: "Error deleting announcement",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Announcement deleted successfully!",
        });
        
        return true;
      } catch (error) {
        console.error("Delete announcement error:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubAnnouncements", variables.clubId] });
    },
  });
}
