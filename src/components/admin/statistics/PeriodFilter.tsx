import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, CalendarIcon, CalendarClock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
interface PeriodFilterProps {
  viewMode: 'daily' | 'weekly' | 'monthly';
  setViewMode: (mode: 'daily' | 'weekly' | 'monthly') => void;
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
}
const PeriodFilter = ({
  viewMode,
  setViewMode,
  dateRange,
  setDateRange
}: PeriodFilterProps) => {
  return <div className="flex items-center gap-4 self-end md:self-auto">
      <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
        <Button variant={viewMode === 'daily' ? 'default' : 'ghost'} size="sm" className={`flex items-center gap-2 ${viewMode === 'daily' ? 'bg-white text-accent' : ''}`} onClick={() => setViewMode('daily')}>
          <CalendarDays className="h-4 w-4" />
          Jour
        </Button>
        <Button variant={viewMode === 'weekly' ? 'default' : 'ghost'} size="sm" className={`flex items-center gap-2 ${viewMode === 'weekly' ? 'bg-white text-accent' : ''}`} onClick={() => setViewMode('weekly')}>
          <Calendar className="h-4 w-4" />
          Semaine
        </Button>
        <Button variant={viewMode === 'monthly' ? 'default' : 'ghost'} size="sm" className={`flex items-center gap-2 ${viewMode === 'monthly' ? 'bg-white text-accent' : ''}`} onClick={() => setViewMode('monthly')}>
          <CalendarClock className="h-4 w-4" />
          Mois
        </Button>
      </div>
      
      {setDateRange && <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-accent/20 hover:bg-accent/5">
              <CalendarIcon className="h-4 w-4" />
              {dateRange?.from ? dateRange.to ? <>
                    {format(dateRange.from, 'd MMM', {
              locale: fr
            })} - {format(dateRange.to, 'd MMM', {
              locale: fr
            })}
                  </> : format(dateRange.from, 'd MMMM yyyy', {
            locale: fr
          }) : "Période personnalisée"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} locale={fr} className="bg-gray-50 rounded-full" />
          </PopoverContent>
        </Popover>}
    </div>;
};
export default PeriodFilter;