
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";

interface UserStatisticsProps {
  totalUsers: number;
  newUsers: number;
  averageSessionTime: string;
  registrationRate: number;
  isLoading?: boolean;
}

const UserStatistics = ({ 
  totalUsers, 
  newUsers, 
  averageSessionTime,
  registrationRate,
  isLoading = false
}: UserStatisticsProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-elegant space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Statistiques Utilisateurs</h3>
          <p className="text-sm text-muted-foreground">Performance et engagement</p>
        </div>
        <div className="p-3 rounded-full bg-subtle text-accent">
          <Users className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
              <Users className="h-4 w-4 text-accent" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-primary">{totalUsers}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Nouveaux utilisateurs</p>
              <Calendar className="h-4 w-4 text-accent" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-primary">+{newUsers}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Temps de session</p>
              <Clock className="h-4 w-4 text-accent" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-primary">{averageSessionTime}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Taux d'inscription</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-primary">{registrationRate}%</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserStatistics;
