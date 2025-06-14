
-- Activer RLS sur la table orders si ce n'est pas déjà fait
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs connectés de voir leurs propres commandes
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs connectés de créer leurs propres commandes
CREATE POLICY "Users can create their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux invités de créer des commandes (sans user_id)
CREATE POLICY "Guests can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (user_id IS NULL AND guest_email IS NOT NULL);

-- Politique pour permettre aux invités de voir leurs commandes via token ou email
CREATE POLICY "Guests can view orders by token or email" 
  ON public.orders 
  FOR SELECT 
  USING (user_id IS NULL AND (guest_email IS NOT NULL OR order_token IS NOT NULL));

-- Politique pour permettre aux administrateurs de voir toutes les commandes
CREATE POLICY "Admins can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (public.is_admin());

-- Politique pour permettre aux administrateurs de modifier toutes les commandes
CREATE POLICY "Admins can update all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (public.is_admin());

-- Politique pour permettre aux administrateurs de supprimer toutes les commandes
CREATE POLICY "Admins can delete all orders" 
  ON public.orders 
  FOR DELETE 
  USING (public.is_admin());
