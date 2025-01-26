import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
});

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [cartData, setCartData] = React.useState<{
    product: any;
    paymentLink: string;
  } | null>(null);

  React.useEffect(() => {
    // On vérifie d'abord si nous avons les données nécessaires
    const hasValidData = location.state?.product && location.state?.paymentLink;
    
    if (!hasValidData) {
      console.log("Données manquantes:", location.state);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun produit sélectionné",
      });
      navigate('/', { replace: true });
      return;
    }

    // Si nous avons les données, on les stocke
    setCartData({
      product: location.state.product,
      paymentLink: location.state.paymentLink
    });
    setIsLoading(false);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!cartData) return;

    try {
      const { error } = await supabase.functions.invoke('send-order-email', {
        body: {
          ...values,
          productName: cartData.product?.name,
          productPrice: cartData.product?.price,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Erreur lors de l'envoi de l'email");
      }

      toast({
        title: "Commande enregistrée",
        description: "Vous allez être redirigé vers la page de paiement",
      });

      setTimeout(() => {
        window.location.href = cartData.paymentLink;
      }, 1500);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!cartData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
            </div>
            
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{cartData.product.name}</h3>
                  <p className="text-sm text-gray-600">{cartData.product.price}</p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
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
                        <Input placeholder="votre@email.com" type="email" {...field} />
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
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre numéro de téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
                >
                  Payer Maintenant
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;