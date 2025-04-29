
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useClubs() {
  // Fetch all clubs
  const query = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
  return query;
}

// Create a new club
export function useCreateClub() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (clubData: {
      name: string;
      description: string;
      category: string;
      image_url?: string;
      organizer_id: string;
    }) => {
      try {
        console.log("Creating club with data:", clubData);
        
        const { data, error } = await supabase
          .from("clubs")
          .insert({
            name: clubData.name,
            description: clubData.description,
            category: clubData.category,
            image_url: clubData.image_url || null,
            organizer_id: clubData.organizer_id,
            member_count: 0,
            event_count: 0,
            followers: 0
          })
          .select('*')
          .single();
        
        if (error) {
          console.error("Create club error:", error);
          toast({
            title: "Error creating club",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        console.log("Club created successfully:", data);
        toast({
          title: "Success",
          description: "Club created successfully!",
        });
        
        return data;
      } catch (error) {
        console.error("Create club error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}

// Join a club
export function useJoinClub() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (clubId: string) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");
        
        // Validate UUID format
        if (!isValidUUID(clubId)) {
          console.error("Invalid UUID format:", clubId);
          toast({
            title: "Error",
            description: "Invalid club ID format. Please try again or contact support.",
            variant: "destructive",
          });
          throw new Error("Invalid club ID format. Must be a valid UUID.");
        }
        
        const { data, error } = await supabase
          .from("club_members")
          .insert({
            club_id: clubId,
            user_id: user.id,
            name: user.user_metadata?.name || "",
            email: user.email,
            role: "member",
          });
        
        if (error) {
          console.error("Join club error:", error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Join club error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
      qc.invalidateQueries({ queryKey: ["myClubs"] });
    },
  });
}

// Leave a club
export function useLeaveClub() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (clubId: string) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");
        
        // Validate UUID format
        if (!isValidUUID(clubId)) {
          console.error("Invalid UUID format:", clubId);
          toast({
            title: "Error",
            description: "Invalid club ID format. Please try again or contact support.",
            variant: "destructive",
          });
          throw new Error("Invalid club ID format. Must be a valid UUID.");
        }
        
        const { error } = await supabase
          .from("club_members")
          .delete()
          .eq("user_id", user.id)
          .eq("club_id", clubId);
          
        if (error) {
          console.error("Leave club error:", error);
          throw error;
        }
        
        return true;
      } catch (error) {
        console.error("Leave club error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
      qc.invalidateQueries({ queryKey: ["myClubs"] });
    },
  });
}

// Follow a club
export function useFollowClub() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (clubId: string) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");
        
        // Validate UUID format
        if (!isValidUUID(clubId)) {
          toast({
            title: "Error",
            description: "Invalid club ID format. Please try again or contact support.",
            variant: "destructive",
          });
          throw new Error("Invalid club ID format. Must be a valid UUID.");
        }
        
        // Insert into club_followers table
        const { error } = await supabase
          .from("club_followers")
          .insert({
            club_id: clubId,
            user_id: user.id
          });
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Follow club error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
      qc.invalidateQueries({ queryKey: ["followedClubs"] });
    },
  });
}

// Unfollow a club
export function useUnfollowClub() {
  const qc = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (clubId: string) => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not logged in");
        
        // Validate UUID format
        if (!isValidUUID(clubId)) {
          toast({
            title: "Error",
            description: "Invalid club ID format. Please try again or contact support.",
            variant: "destructive",
          });
          throw new Error("Invalid club ID format. Must be a valid UUID.");
        }
        
        // Delete from club_followers table
        const { error } = await supabase
          .from("club_followers")
          .delete()
          .eq("user_id", user.id)
          .eq("club_id", clubId);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Unfollow club error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
      qc.invalidateQueries({ queryKey: ["followedClubs"] });
    },
  });
}

// Helper function to validate UUID format - improved version
export function isValidUUID(uuid: string | null | undefined): boolean {
  // Early return for null/undefined
  if (!uuid) {
    console.error("UUID is undefined or null");
    return false;
  }
  
  if (typeof uuid !== 'string') {
    console.error("UUID is not a string:", typeof uuid);
    return false;
  }
  
  // UUID regex pattern - strict validation for version 1-5 UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  const isValid = uuidRegex.test(uuid);
  
  if (!isValid) {
    console.error(`Invalid UUID format: ${uuid}`);
  }
  
  return isValid;
}
