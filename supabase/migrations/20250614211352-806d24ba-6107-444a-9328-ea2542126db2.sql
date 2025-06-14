
-- Supprimer d'abord toutes les références dans les tables liées
-- 1. Supprimer les commandes de livraison
DELETE FROM public.delivery_orders 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

-- 2. Supprimer les commandes normales
DELETE FROM public.orders 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

-- 3. Supprimer les autres références possibles
DELETE FROM public.saved_carts 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

DELETE FROM public.wishlists 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

DELETE FROM public.product_tags 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

DELETE FROM public.stock_history 
WHERE product_id = (
  SELECT id FROM public.products 
  WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%'
  LIMIT 1
);

-- 4. Enfin, supprimer le produit
DELETE FROM public.products 
WHERE LOWER(name) LIKE '%telecommande%' OR LOWER(name) LIKE '%télécommande%';
