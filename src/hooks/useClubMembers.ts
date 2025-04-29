
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useClubMembers(clubId: string) {
  return useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      if (!clubId) return [];
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!clubId,
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      clubId,
      userId,
    }: {
      clubId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from("club_members")
        .delete()
        .eq("club_id", clubId)
        .eq("user_id", userId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return true;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clubMembers", variables.clubId] });
      qc.invalidateQueries({ queryKey: ["clubs"] });
      qc.invalidateQueries({ queryKey: ["myClubs"] });
    },
  });
}
