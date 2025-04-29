
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export function useClubImageUpload() {
  const BUCKET = "club-images";

  async function uploadImage(file: File): Promise<{ url: string; error?: any }> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      console.log(`Uploading image ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB, type: ${file.type}`);

      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      console.log(`Generated file name: ${fileName}`);

      // Upload the file to club-images bucket
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { url: "", error: uploadError };
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      console.log('Public URL generated:', data.publicUrl);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return { url: "", error };
    }
  }

  return {
    uploadImage,
  };
}
