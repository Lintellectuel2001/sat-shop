
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Send, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_sent: boolean | null;
}

const MarketingNotificationManager = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketing_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les notifications",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir le titre et le message",
      });
      return;
    }

    try {
      setSending(true);

      // First, create the notification in the marketing_notifications table
      const { data: notificationData, error: notificationError } = await supabase
        .from('marketing_notifications')
        .insert({
          title: title,
          message: message,
          type: 'admin_message',
          is_sent: true
        })
        .select();

      if (notificationError || !notificationData) {
        throw notificationError || new Error("Erreur lors de la création de la notification");
      }

      const notification = notificationData[0];

      // Next, get all users to assign the notification to them
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id');

      if (usersError) {
        throw usersError;
      }

      if (usersData && usersData.length > 0) {
        // Create user_notifications entries for each user
        const userNotificationsToInsert = usersData.map(user => ({
          user_id: user.id,
          notification_id: notification.id,
          is_read: false
        }));

        const { error: insertError } = await supabase
          .from('user_notifications')
          .insert(userNotificationsToInsert);

        if (insertError) {
          throw insertError;
        }
      }

      // Reset form
      setTitle('');
      setMessage('');
      
      // Update the notifications list
      await fetchNotifications();

      toast({
        title: "Succès",
        description: "Notification envoyée avec succès",
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la notification",
      });
    } finally {
      setSending(false);
    }
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setDialogOpen(true);
  };

  const handleUpdateNotification = async () => {
    if (!editingNotification) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('marketing_notifications')
        .update({
          title: editingNotification.title,
          message: editingNotification.message
        })
        .eq('id', editingNotification.id);

      if (error) {
        throw error;
      }

      await fetchNotifications();
      setDialogOpen(false);
      setEditingNotification(null);

      toast({
        title: "Succès",
        description: "Notification mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la notification",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) {
      return;
    }

    try {
      setLoading(true);
      
      // First, delete all user_notifications entries for this notification
      const { error: userNotificationsError } = await supabase
        .from('user_notifications')
        .delete()
        .eq('notification_id', id);

      if (userNotificationsError) {
        throw userNotificationsError;
      }

      // Then delete the notification itself
      const { error } = await supabase
        .from('marketing_notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchNotifications();

      toast({
        title: "Succès",
        description: "Notification supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la notification",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Titre
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la notification"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message à envoyer aux clients"
              className="w-full min-h-[150px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSendNotification} 
            disabled={sending || !title.trim() || !message.trim()}
            className="ml-auto"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer la notification
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucune notification envoyée
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Envoyé le: {new Date(notification.created_at).toLocaleDateString()} à {new Date(notification.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditClick(notification)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la notification</DialogTitle>
          </DialogHeader>
          {editingNotification && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
                  Titre
                </label>
                <Input
                  id="edit-title"
                  value={editingNotification.title}
                  onChange={(e) => setEditingNotification({
                    ...editingNotification,
                    title: e.target.value
                  })}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="edit-message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="edit-message"
                  value={editingNotification.message}
                  onChange={(e) => setEditingNotification({
                    ...editingNotification,
                    message: e.target.value
                  })}
                  className="w-full min-h-[150px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateNotification} 
              disabled={sending || !editingNotification?.title.trim() || !editingNotification?.message.trim()}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingNotificationManager;
