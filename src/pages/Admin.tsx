import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
}

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    category: '',
    image: '',
    payment_link: ''
  });
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({
    title: '',
    color: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchSlides();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits",
      });
      return;
    }
    
    setProducts(data);
  };

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('slides')
      .select('*');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les slides",
      });
      return;
    }
    
    setSlides(data);
  };

  const handleImageUpload = async (file: File, type: 'product' | 'slide') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'uploader l'image",
      });
      return null;
    }

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleProductCreate = async () => {
    // Check if all required fields are present
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image || !newProduct.payment_link) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([{
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        payment_link: newProduct.payment_link,
        description: newProduct.description,
        features: newProduct.features
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit créé avec succès",
    });
    
    fetchProducts();
    setNewProduct({
      name: '',
      price: '',
      category: '',
      image: '',
      payment_link: ''
    });
  };

  const handleProductUpdate = async (id: string) => {
    if (!editingProduct) return;

    // Check if all required fields are present
    if (!editingProduct.name || !editingProduct.price || !editingProduct.category || !editingProduct.image || !editingProduct.payment_link) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .update(editingProduct)
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit mis à jour avec succès",
    });
    
    fetchProducts();
    setEditingProduct(null);
  };

  const handleProductDelete = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit supprimé avec succès",
    });
    
    fetchProducts();
  };

  const handleSlideCreate = async () => {
    // Check if all required fields are present
    if (!newSlide.title || !newSlide.color || !newSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('slides')
      .insert([{
        title: newSlide.title,
        color: newSlide.color,
        image: newSlide.image,
        description: newSlide.description
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide créé avec succès",
    });
    
    fetchSlides();
    setNewSlide({
      title: '',
      color: '',
      image: ''
    });
  };

  const handleSlideUpdate = async (id: string) => {
    if (!editingSlide) return;

    // Check if all required fields are present
    if (!editingSlide.title || !editingSlide.color || !editingSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('slides')
      .update(editingSlide)
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide mis à jour avec succès",
    });
    
    fetchSlides();
    setEditingSlide(null);
  };

  const handleSlideDelete = async (id: string) => {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide supprimé avec succès",
    });
    
    fetchSlides();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="slides">Slides</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Produit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Produit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nom"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <Input
                    placeholder="Prix"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                  <Input
                    placeholder="Catégorie"
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                  <Input
                    placeholder="Lien de paiement"
                    value={newProduct.payment_link || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, payment_link: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                  <Input
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await handleImageUpload(e.target.files[0], 'product');
                        if (url) {
                          setNewProduct({ ...newProduct, image: url });
                        }
                      }
                    }}
                  />
                  <Button onClick={handleProductCreate}>Créer</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
                <h3 className="font-semibold">{product.name}</h3>
                <p>{product.price}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le Produit</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Nom"
                          value={editingProduct?.name || product.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                        <Input
                          placeholder="Prix"
                          value={editingProduct?.price || product.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        />
                        <Input
                          placeholder="Catégorie"
                          value={editingProduct?.category || product.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        />
                        <Input
                          placeholder="Lien de paiement"
                          value={editingProduct?.payment_link || product.payment_link}
                          onChange={(e) => setEditingProduct({ ...editingProduct, payment_link: e.target.value })}
                        />
                        <Textarea
                          placeholder="Description"
                          value={editingProduct?.description || product.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        />
                        <Input
                          type="file"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleImageUpload(e.target.files[0], 'product');
                              if (url) {
                                setEditingProduct({ ...editingProduct, image: url });
                              }
                            }
                          }}
                        />
                        <Button onClick={() => handleProductUpdate(product.id)}>Mettre à jour</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleProductDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="slides" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestion des Slides</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Slide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Slide</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Titre"
                    value={newSlide.title || ''}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newSlide.description || ''}
                    onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                  />
                  <Input
                    placeholder="Couleur (ex: #000000)"
                    value={newSlide.color || ''}
                    onChange={(e) => setNewSlide({ ...newSlide, color: e.target.value })}
                  />
                  <Input
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await handleImageUpload(e.target.files[0], 'slide');
                        if (url) {
                          setNewSlide({ ...newSlide, image: url });
                        }
                      }
                    }}
                  />
                  <Button onClick={handleSlideCreate}>Créer</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div key={slide.id} className="border rounded-lg p-4 space-y-4">
                <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover rounded" />
                <h3 className="font-semibold">{slide.title}</h3>
                <p>{slide.description}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le Slide</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Titre"
                          value={editingSlide?.title || slide.title}
                          onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        />
                        <Textarea
                          placeholder="Description"
                          value={editingSlide?.description || slide.description}
                          onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                        />
                        <Input
                          placeholder="Couleur (ex: #000000)"
                          value={editingSlide?.color || slide.color}
                          onChange={(e) => setEditingSlide({ ...editingSlide, color: e.target.value })}
                        />
                        <Input
                          type="file"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleImageUpload(e.target.files[0], 'slide');
                              if (url) {
                                setEditingSlide({ ...editingSlide, image: url });
                              }
                            }
                          }}
                        />
                        <Button onClick={() => handleSlideUpdate(slide.id)}>Mettre à jour</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleSlideDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
