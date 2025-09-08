
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Crown } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const initialEvents = [
    {
      id: 1,
      title: "Mid-term Exams Begin",
      date: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 8), 'yyyy-MM-dd'),
      type: "exam",
      color: "bg-red-100 text-red-800 border border-red-200"
    },
    {
      id: 2,
      title: "Sports Day",
      date: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), 'yyyy-MM-dd'),
      type: "event",
      color: "bg-blue-100 text-blue-800 border border-blue-200"
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 22), 'yyyy-MM-dd'),
      type: "meeting",
      color: "bg-green-100 text-green-800 border border-green-200"
    },
    {
      id: 4,
      title: "School Holiday",
      date: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 26), 'yyyy-MM-dd'),
      type: "holiday",
      color: "bg-purple-100 text-purple-800 border border-purple-200"
    },
    {
      id: 5,
      title: "School Holiday",
      date: format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 'yyyy-MM-dd'),
      type: "event",
      color: "bg-red-100 text-red-800 border border-red-200"
    }
  ];

  const [events, setEvents] = useState(initialEvents);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({ title: '', date: '', type: 'event' });

  // State for editing events
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date === format(date, 'yyyy-MM-dd')
    );
  };

  const colorsMap = {
    exam: "bg-red-100 text-red-800 border border-red-200",
    event: "bg-blue-100 text-blue-800 border border-blue-200",
    meeting: "bg-green-100 text-green-800 border border-green-200",
    holiday: "bg-purple-100 text-purple-800 border border-purple-200",
  };

  const handleAddEvent = () => {
    if (!newEventData.title || !newEventData.date) {
      alert("Event Title and Date are required.");
      return;
    }
    
    const newEvent = {
      id: Date.now(),
      ...newEventData,
      color: colorsMap[newEventData.type],
    };
    setEvents([...events, newEvent]);
    setNewEventData({ title: '', date: '', type: 'event' });
    setIsAddEventDialogOpen(false);
  };
  
  const handleEditClick = (event) => {
    setEditingEvent({ ...event }); // Create a copy to avoid direct state modification
    setIsEditEventDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent.title || !editingEvent.date) {
      alert("Event Title and Date are required.");
      return;
    }
    setEvents(events.map(event => 
      event.id === editingEvent.id 
        ? { ...editingEvent, color: colorsMap[editingEvent.type] } 
        : event
    ));
    setIsEditEventDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteClick = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };


  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              Calendar & Events
              <Badge className="bg-purple-100 text-purple-800">
                <Crown className="w-3 h-3 mr-1" />
                Standard
              </Badge>
            </h1>
            <p className="text-slate-600">Academic calendar and event management</p>
          </div>
          <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input id="eventTitle" value={newEventData.title} onChange={e => setNewEventData({...newEventData, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="eventDate">Date</Label>
                  <Input id="eventDate" type="date" value={newEventData.date} onChange={e => setNewEventData({...newEventData, date: e.target.value})} />
                </div>
                <div>
                  <Label>Event Type</Label>
                  <Select value={newEventData.type} onValueChange={v => setNewEventData({...newEventData, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center font-medium text-slate-600 p-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 gap-1">
                  {days.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    return (
                      <div key={day.toString()} className={`min-h-[100px] p-2 border rounded-lg transition-colors duration-200 ${format(day, 'M') !== format(currentDate, 'M') ? 'bg-slate-50/50 text-slate-400' : 'bg-white hover:bg-slate-50'}`}>
                        <div className="font-medium text-sm mb-1">
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map(event => (
                            <div key={event.id} className={`text-xs p-1 rounded-md truncate ${event.color}`}>
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.slice().sort((a,b) => new Date(a.date) - new Date(b.date)).map(event => (
                  <div key={event.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-slate-600">{format(new Date(event.date.replace(/-/g, '\/')), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(event)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteClick(event.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm">Examinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Sports & Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Holidays</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Edit Event Dialog */}
      <Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader>
          {editingEvent && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editEventTitle">Event Title</Label>
                <Input id="editEventTitle" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="editEventDate">Date</Label>
                <Input id="editEventDate" type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} />
              </div>
              <div>
                <Label>Event Type</Label>
                <Select value={editingEvent.type} onValueChange={v => setEditingEvent({...editingEvent, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditEventDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateEvent}>Update Event</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
