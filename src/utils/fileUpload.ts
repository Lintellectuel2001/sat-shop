import { supabase } from "@/integrations/supabase/client";

export const handleImageUpload = async (file: File): Promise<string> => {
  try {
    console.log('Starting file upload process');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No session found');
      throw new Error("Vous devez être connecté pour uploader des images");
    }

    console.log('Checking admin rights');
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!adminData) {
      console.log('User is not admin:', session.user.id);
      throw new Error("Vous n'avez pas les droits d'administration");
    }

    console.log('Validating file');
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("L'image ne doit pas dépasser 5MB");
    }

    if (!file.type.startsWith('image/')) {
      throw new Error("Le fichier doit être une image");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading file to Supabase storage:', {
      bucket: 'lovable-uploads',
      filePath,
      fileType: file.type
    });

    const { error: uploadError, data } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error("Erreur lors de l'upload du fichier: " + uploadError.message);
    }

    console.log('File uploaded successfully, getting public URL');
    const { data: { publicUrl } } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in handleImageUpload:', error);
    throw error;
  }
};