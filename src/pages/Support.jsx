import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle, AlertTriangle, User, Calendar, Mail, MessageCircle as ChatIcon, Phone } from 'lucide-react';

const initialTickets = [
  {
    id: 'T001',
    title: 'Transport timing issue',
    description: 'Bus is consistently late by 15 minutes',
    category: 'Transport',
    priority: 'High',
    status: 'Open',
    created_by: 'Parent - Raj Sharma',
    created_date: '2024-01-15',
    responses: 2
  },
  {
    id: 'T002',
    title: 'Fee payment portal not working',
    description: 'Unable to make online fee payment',
    category: 'Technical',
    priority: 'Medium',
    status: 'In Progress',
    created_by: 'Parent - Priya Singh',
    created_date: '2024-01-14',
    responses: 1
  },
  {
    id: 'T003',
    title: 'Canteen food quality concern',
    description: 'Food served yesterday was not fresh',
    category: 'Facilities',
    priority: 'Low',
    status: 'Resolved',
    created_by: 'Teacher - Ms. Johnson',
    created_date: '2024-01-13',
    responses: 3
  }
];

export default function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });

  const currentPlan = 'standard'; // Can be 'basic', 'standard', or 'premium'

  const handleCreateTicket = () => {
    if (!newTicketData.title || !newTicketData.description || !newTicketData.category) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTicket = {
      id: `T${(tickets.length + 1).toString().padStart(3, '0')}`,
      ...newTicketData,
      status: 'Open',
      created_by: 'Admin - Current User',
      created_date: new Date().toISOString().split('T')[0],
      responses: 0
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketData({ title: '', description: '', category: '', priority: 'Medium' });
    setIsCreateTicketOpen(false);
  };

  const handleViewTicket = (ticket) => {
    setViewingTicket(ticket);
    setIsViewTicketOpen(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Open': 'bg-red-100 text-red-800 border-red-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors['Open'];
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors['Medium'];
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Open': return <AlertTriangle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const planHasAccess = (feature) => {
    const planHierarchy = { basic: 1, standard: 2, premium: 3 };
    const featureHierarchy = { mail: 1, chat: 2, call: 3 };
    return planHierarchy[currentPlan] >= featureHierarchy[feature];
  };

  const handleSendEmail = () => {
    alert('Redirecting to email support...');
  };

  const handleStartChat = () => {
    if (planHasAccess('chat')) {
      alert('Starting live chat support...');
    } else {
      alert('Live chat is available in Standard and Premium plans. Please upgrade your subscription.');
    }
  };

  const handleRequestCall = () => {
    if (planHasAccess('call')) {
      alert('Call request has been submitted. Our support team will call you within 30 minutes.');
    } else {
      alert('Phone support is available in Premium plan only. Please upgrade your subscription.');
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <LifeBuoy className="w-6 h-6 md:w-8 md:h-8" />
              Support & Tickets
            </h1>
            <p className="text-sm md:text-base text-slate-600">Manage support requests and resolve issues efficiently.</p>
          </div>

          {/* Support Options */}
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Support</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSendEmail}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                  <Badge className="bg-blue-100 text-blue-800 text-xs">All Plans</Badge>
                </Button>
                
                <Button 
                  onClick={handleStartChat}
                  variant="outline" 
                  className={`flex items-center gap-2 ${!planHasAccess('chat') ? 'opacity-50' : ''}`}
                  disabled={!planHasAccess('chat')}
                >
                  <ChatIcon className="w-4 h-4" />
                  Live Chat
                  {planHasAccess('chat') ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 text-xs">Standard+</Badge>
                  )}
                </Button>
                
                <Button 
                  onClick={handleRequestCall}
                  variant="outline" 
                  className={`flex items-center gap-2 ${!planHasAccess('call') ? 'opacity-50' : ''}`}
                  disabled={!planHasAccess('call')}
                >
                  <Phone className="w-4 h-4" />
                  Request Call
                  {planHasAccess('call') ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 text-xs">Premium</Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Ticket Button */}
          <div className="flex justify-end">
            <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      value={newTicketData.title}
                      onChange={(e) => setNewTicketData({...newTicketData, title: e.target.value})}
                      placeholder="Brief description of the issue"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newTicketData.category} onValueChange={(value) => setNewTicketData({...newTicketData, category: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical Issues</SelectItem>
                        <SelectItem value="Transport">Transport & Bus</SelectItem>
                        <SelectItem value="Facilities">School Facilities</SelectItem>
                        <SelectItem value="Academic">Academic Concerns</SelectItem>
                        <SelectItem value="Fee">Fee & Payment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTicketData.priority} onValueChange={(value) => setNewTicketData({...newTicketData, priority: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newTicketData.description}
                      onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})}
                      placeholder="Detailed description of the issue"
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateTicketOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTicket} className="w-full sm:w-auto">
                      Create Ticket
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{tickets.filter(t => t.status === 'Open').length}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{tickets.filter(t => t.status === 'In Progress').length}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{tickets.filter(t => t.status === 'Resolved').length}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4 md:w-5 md:h-5 text-blue-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{tickets.length}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="space-y-3">
              {tickets.map(ticket => (
                <Card key={ticket.id} className="p-3 md:p-4 hover:bg-slate-50 transition-colors border-slate-200 shadow-sm cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(ticket.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm md:text-base text-slate-900 truncate">{ticket.title}</h3>
                          <div className="flex flex-wrap gap-1">
                            <Badge className={`${getStatusBadge(ticket.status)} text-xs`}>
                              {ticket.status}
                            </Badge>
                            <Badge className={`${getPriorityBadge(ticket.priority)} text-xs`}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 mb-2 line-clamp-2">{ticket.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ticket.created_by}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {ticket.created_date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{ticket.responses} responses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Ticket Dialog */}
        <Dialog open={isViewTicketOpen} onOpenChange={setIsViewTicketOpen}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5" />
                Ticket Details
              </DialogTitle>
            </DialogHeader>
            {viewingTicket && (
              <div className="space-y-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{viewingTicket.title}</h2>
                    <p className="text-sm text-slate-600">Ticket ID: {viewingTicket.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusBadge(viewingTicket.status)}>
                      {viewingTicket.status}
                    </Badge>
                    <Badge className={getPriorityBadge(viewingTicket.priority)}>
                      {viewingTicket.priority} Priority
                    </Badge>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-slate-700">{viewingTicket.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {viewingTicket.category}
                  </div>
                  <div>
                    <span className="font-medium">Created by:</span> {viewingTicket.created_by}
                  </div>
                  <div>
                    <span className="font-medium">Created date:</span> {viewingTicket.created_date}
                  </div>
                  <div>
                    <span className="font-medium">Responses:</span> {viewingTicket.responses}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewTicketOpen(false)} className="w-full sm:w-auto">
                    Close
                  </Button>
                  <Button className="w-full sm:w-auto">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Response
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}