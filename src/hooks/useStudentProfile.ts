
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// View own profile
export function useStudentProfile() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

// Edit own profile (name)
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase
        .from("profiles")
        .update({ name: profile.name })
        .eq("id", user.id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
