import { supabase } from "@/integrations/supabase/client";

export const handleImageUpload = async (file: File): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Vous devez être connecté pour uploader des images");
    }

    // Vérifier si l'utilisateur est un admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!adminData) {
      throw new Error("Vous n'avez pas les droits d'administration");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error("Erreur lors de l'upload du fichier");
    }

    const { data: { publicUrl } } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in handleImageUpload:', error);
    throw new Error("Une erreur est survenue lors de l'upload");
  }
};