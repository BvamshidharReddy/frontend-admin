import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, UserCheck, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SchoolDetailsPopup({ open, onOpenChange, stats }) {
  const peopleData = [
    {
      title: "Students",
      count: stats.students,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      link: createPageUrl("People") + "?tab=students"
    },
    {
      title: "Teachers", 
      count: stats.teachers,
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      link: createPageUrl("People") + "?tab=teachers"
    },
    {
      title: "Parents",
      count: stats.parents,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      link: createPageUrl("People") + "?tab=parents"
    },
    {
      title: "Staff",
      count: stats.staff,
      icon: Briefcase,
      color: "from-orange-500 to-orange-600",
      link: createPageUrl("People") + "?tab=staff"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            School Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {peopleData.map((item) => (
            <Link key={item.title} to={item.link} onClick={() => onOpenChange(false)}>
              <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}