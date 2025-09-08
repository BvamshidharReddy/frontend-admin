import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCard({ title, value, subtitle, icon: Icon, color, loading, clickable }) {
  if (!title || !Icon) {
    return null;
  }

  const cardClasses = `h-full border-0 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 ${
      clickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
    }`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-4 sm:p-6 flex items-center gap-4 h-full">
        {Icon && (
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${color || 'from-slate-500 to-slate-600'} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            value && (
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            )
          )}
          {loading ? (
            <Skeleton className="h-4 w-24 mt-1" />
          ) : (
            subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}