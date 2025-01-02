import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().nullable(),
  address: z.string().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    async function getProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          navigate("/login", { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (mounted) {
          setProfile(data);
          form.reset({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
      setProfile({ ...profile!, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profil non trouvé</CardTitle>
            <CardDescription>
              Nous n'avons pas pu trouver votre profil. Veuillez vous connecter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            {isEditing ? "Modifiez vos informations personnelles" : "Gérez vos informations personnelles"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone (facultatif)</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse (facultatif)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              <div>
                <h3 className="font-medium text-sm">Nom complet</h3>
                <p className="text-gray-600">{profile.full_name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Email</h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <h3 className="font-medium text-sm">Téléphone</h3>
                  <p className="text-gray-600">{profile.phone}</p>
                </div>
              )}
              {profile.address && (
                <div>
                  <h3 className="font-medium text-sm">Adresse</h3>
                  <p className="text-gray-600">{profile.address}</p>
                </div>
              )}
              <Button 
                className="w-full mt-4"
                onClick={() => setIsEditing(true)}
              >
                Modifier le profil
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}