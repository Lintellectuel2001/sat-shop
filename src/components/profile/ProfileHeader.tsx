import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ProfileHeader({ isEditing }: { isEditing: boolean }) {
  return (
    <CardHeader>
      <CardTitle>Mon Profil</CardTitle>
      <CardDescription>
        {isEditing ? "Modifiez vos informations personnelles" : "Gérez vos informations personnelles"}
      </CardDescription>
    </CardHeader>
  );
}