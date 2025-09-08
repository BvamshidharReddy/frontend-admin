import React, { useState, useEffect } from 'react';
import { Announcement, Class, Student } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, MessageSquare, Send, Search, Mail, MessageCircle, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnnouncementForm from "../components/communications/AnnouncementForm";
import EmailTemplatePopup from "../components/communications/EmailTemplatePopup";
import SMSTemplatePopup from "../components/communications/SMSTemplatePopup";
import WhatsAppTemplatePopup from "../components/communications/WhatsAppTemplatePopup";

export default function Communications() {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  
  // Channel popup states
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showSMSPopup, setShowSMSPopup] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [showAllChannelsPopup, setShowAllChannelsPopup] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [announcementsData, classesData, studentsData] = await Promise.all([
      Announcement.list("-created_date"),
      Class.list(),
      Student.list()
    ]);
    setAnnouncements(announcementsData);
    setClasses(classesData);
    setStudents(studentsData);
    setLoading(false);
  };
  
  const handleAddAnnouncement = async (data) => {
    await Announcement.create(data);
    setShowDialog(false);
    setEditingAnnouncement(null);
    await loadData();
  };

  const handleEditAnnouncement = async (data) => {
    await Announcement.update(editingAnnouncement.id, data);
    setEditingAnnouncement(null);
    setShowDialog(false);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this announcement?")) {
      await Announcement.delete(id);
      await loadData();
    }
  };

  const handleChannelSend = async (channel, templateData) => {
    // Create announcement with the template data
    const announcementData = {
      title: templateData.subject || templateData.title,
      content: templateData.content || templateData.message,
      target_audience: templateData.target_audience,
      target_classes: templateData.target_classes || [],
      channel: [channel],
      status: "Sent"
    };
    
    await Announcement.create(announcementData);
    await loadData();
    
    // Close all popups
    setShowEmailPopup(false);
    setShowSMSPopup(false);
    setShowWhatsAppPopup(false);
    setShowAllChannelsPopup(false);
  };

  const handleAllChannelsSend = async (templateData) => {
    // Create announcement with all channels
    const announcementData = {
      title: templateData.subject || templateData.title,
      content: templateData.content || templateData.message,
      target_audience: templateData.target_audience,
      target_classes: templateData.target_classes || [],
      channel: ["Email", "SMS", "WhatsApp"],
      status: "Sent"
    };
    
    await Announcement.create(announcementData);
    await loadData();
    setShowAllChannelsPopup(false);
  };

  // Filter announcements based on search
  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.target_audience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-800",
      Sent: "bg-green-100 text-green-800",
      Scheduled: "bg-blue-100 text-blue-800"
    };
    return colors[status] || colors.Draft;
  };

  const getTargetBadge = (target) => {
    const colors = {
      All: "bg-purple-100 text-purple-800",
      Teachers: "bg-blue-100 text-blue-800",
      Parents: "bg-orange-100 text-orange-800",
      Students: "bg-green-100 text-green-800",
      "Specific Classes": "bg-indigo-100 text-indigo-800"
    };
    return colors[target] || colors.All;
  };
  
  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Communications</h1>
            <p className="text-slate-600">Send announcements and manage school communications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Dialog open={showDialog} onOpenChange={(isOpen) => {
              setShowDialog(isOpen);
              if (!isOpen) {
                setEditingAnnouncement(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => setEditingAnnouncement(null)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
                  <DialogDescription>
                    Send announcements via multiple channels to your target audience.
                  </DialogDescription>
                </DialogHeader>
                <AnnouncementForm 
                  announcement={editingAnnouncement}
                  onSubmit={editingAnnouncement ? handleEditAnnouncement : handleAddAnnouncement}
                  onCancel={() => {
                    setShowDialog(false);
                    setEditingAnnouncement(null);
                  }}
                  classes={classes}
                  students={students}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Channel Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all cursor-pointer" onClick={() => setShowEmailPopup(true)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Email</p>
                <p className="text-xs text-slate-500">Send via email</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all cursor-pointer" onClick={() => setShowSMSPopup(true)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">SMS</p>
                <p className="text-xs text-slate-500">Send via SMS</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all cursor-pointer" onClick={() => setShowWhatsAppPopup(true)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">WhatsApp</p>
                <p className="text-xs text-slate-500">Send via WhatsApp</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200" onClick={() => setShowAllChannelsPopup(true)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Select All</p>
                <p className="text-xs text-slate-500">All channels</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg md:text-xl">Announcements</CardTitle>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Target</TableHead>
                    <TableHead className="min-w-[140px] hidden md:table-cell">Channels</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell className="hidden sm:table-cell"><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell className="hidden md:table-cell"><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-6 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-8 bg-slate-200 rounded animate-pulse ml-auto w-20"></div></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedAnnouncements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No announcements found matching your search.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAnnouncements.map(announcement => (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm md:text-base">{announcement.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{announcement.content}</p>
                            <div className="sm:hidden mt-1 flex gap-1 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${getTargetBadge(announcement.target_audience)}`}>
                                {announcement.target_audience}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getTargetBadge(announcement.target_audience)}>
                            {announcement.target_audience}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {(announcement.channel || []).map(channel => (
                              <Badge key={channel} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(announcement.status)}>
                            {announcement.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setEditingAnnouncement(announcement);
                                setShowDialog(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(announcement.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {!loading && filteredAnnouncements.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 pb-4">
                <p className="text-sm text-slate-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm px-3 py-1 bg-slate-100 rounded">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Popups */}
        <EmailTemplatePopup 
          open={showEmailPopup}
          onOpenChange={setShowEmailPopup}
          onSend={(templateData) => handleChannelSend('Email', templateData)}
          classes={classes}
          students={students}
        />
        
        <SMSTemplatePopup 
          open={showSMSPopup}
          onOpenChange={setShowSMSPopup}
          onSend={(templateData) => handleChannelSend('SMS', templateData)}
          classes={classes}
          students={students}
        />
        
        <WhatsAppTemplatePopup 
          open={showWhatsAppPopup}
          onOpenChange={setShowWhatsAppPopup}
          onSend={(templateData) => handleChannelSend('WhatsApp', templateData)}
          classes={classes}
          students={students}
        />

        {/* Select All Channels Popup */}
        <Dialog open={showAllChannelsPopup} onOpenChange={setShowAllChannelsPopup}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                Send to All Channels
              </DialogTitle>
              <DialogDescription>
                Send your message via Email, SMS, and WhatsApp simultaneously.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-900">Broadcasting to All Channels</h3>
                </div>
                <p className="text-sm text-indigo-700">Your message will be sent via:</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">📧 Email</Badge>
                  <Badge className="bg-purple-100 text-purple-800">💬 SMS</Badge>
                  <Badge className="bg-green-100 text-green-800">🟢 WhatsApp</Badge>
                </div>
              </div>
              <AnnouncementForm 
                onSubmit={handleAllChannelsSend}
                onCancel={() => setShowAllChannelsPopup(false)}
                classes={classes}
                students={students}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}