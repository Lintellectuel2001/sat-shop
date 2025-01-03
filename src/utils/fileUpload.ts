import { supabase } from "@/integrations/supabase/client";

export const handleImageUpload = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // First, check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Vous devez être connecté pour uploader des images");
    }

    // Upload the file with proper metadata
    const { error: uploadError, data } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error("Impossible d'uploader l'image");
    }

    // Get the public URL after successful upload
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in handleImageUpload:', error);
    throw new Error("Une erreur est survenue lors de l'upload");
  }
};