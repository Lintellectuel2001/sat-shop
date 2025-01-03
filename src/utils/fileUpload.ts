import { supabase } from "@/integrations/supabase/client";

export const handleImageUpload = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error("Impossible d'uploader l'image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in handleImageUpload:', error);
    throw new Error("Une erreur est survenue lors de l'upload");
  }
};