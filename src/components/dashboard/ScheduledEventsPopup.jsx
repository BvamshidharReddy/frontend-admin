import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ScheduledEventsPopup({ open, onOpenChange, examCount, eventCount }) {
  // Mock today's data
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaysExams = [
    {
      id: 1,
      name: "Mathematics Unit Test",
      class: "Grade 10-A",
      time: "10:00 AM",
      duration: "1.5 hours"
    },
    {
      id: 2,
      name: "Science Practical",
      class: "Grade 9-B", 
      time: "2:00 PM",
      duration: "2 hours"
    }
  ].slice(0, examCount);

  const todaysEvents = [
    {
      id: 1,
      name: "Parent-Teacher Meeting",
      location: "Main Hall",
      time: "3:00 PM",
      attendees: "Grade 8 Parents"
    },
    {
      id: 2,
      name: "Sports Practice",
      location: "Playground",
      time: "4:30 PM", 
      attendees: "Soccer Team"
    }
  ].slice(0, eventCount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Today's Exams */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Exams ({examCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysExams.length > 0 ? todaysExams.map((exam) => (
                <div key={exam.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{exam.name}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      {exam.class}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-slate-700">{exam.time}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exam.duration}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 text-sm py-4 text-center">No exams scheduled for today</p>
              )}
            </CardContent>
          </Card>

          {/* Today's Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Events ({eventCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEvents.length > 0 ? todaysEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{event.name}</p>
                    <p className="text-sm text-slate-600">{event.location}</p>
                    <p className="text-xs text-slate-500 mt-1">{event.attendees}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-700 text-sm">{event.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 text-sm py-4 text-center">No events scheduled for today</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}