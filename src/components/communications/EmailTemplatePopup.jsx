
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Send, Mail, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const templates = [
  { id: 't1', name: 'Fee Reminder', subject: 'Gentle Reminder: Fee Payment Due', content: 'Dear [Parent Name], this is a reminder that the school fee for [Student Name] is due on [Due Date]. Please pay at your earliest convenience.' },
  { id: 't2', name: 'Exam Schedule', subject: 'Upcoming Exam Schedule', content: 'Dear Parent, the exam schedule for the upcoming term has been published. Please find the details on the school portal.' },
  { id: 't3', name: 'Holiday Notification', subject: 'School Holiday Announcement', content: 'Dear All, the school will remain closed on [Date] on account of [Occasion].' },
];

export default function EmailTemplatePopup({ open, onOpenChange, classes, students, onSend }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [targetAudience, setTargetAudience] = useState('All');
  const [targetClasses, setTargetClasses] = useState([]);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState('');

  const handleSend = () => {
    if (!selectedTemplate) {
      alert('Please select a template.');
      return;
    }
    onSend({
      ...selectedTemplate,
      target_audience: targetAudience,
      target_classes: targetClasses
    });
    onOpenChange(false);
  };
  
  const handleRequestTemplate = () => {
    if(!requestDetails.trim()) {
      alert("Please provide details for your template request.");
      return;
    }
    console.log("Template request submitted:", requestDetails);
    alert("Your request has been submitted to the super admin for review. You will be notified upon approval.");
    setIsRequestDialogOpen(false);
    setRequestDetails('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Mail /> Send Email from Template</DialogTitle>
            <DialogDescription>Select a pre-defined template to send emails quickly.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 flex-1 overflow-y-auto">
            <div className="md:col-span-1 space-y-4">
              <h3 className="font-semibold">Select Template</h3>
              <div className="space-y-2">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer ${selectedTemplate?.id === template.id ? 'border-blue-500 shadow-lg' : ''}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-slate-600 truncate">{template.subject}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setIsRequestDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" /> Request Custom Template
              </Button>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold">Preview & Targeting</h3>
              <Card className="flex-1">
                <CardContent className="p-4 space-y-3">
                  {selectedTemplate ? (
                    <>
                      <div>
                        <Label>Subject</Label>
                        <Input value={selectedTemplate.subject} readOnly />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea value={selectedTemplate.content} readOnly rows={8} />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">Select a template to see a preview.</div>
                  )}
                </CardContent>
              </Card>
              <div>
                <Label>Target Audience</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Parents">Parents</SelectItem>
                    <SelectItem value="Teachers">Teachers</SelectItem>
                    <SelectItem value="Specific Classes">Specific Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSend} disabled={!selectedTemplate}><Send className="w-4 h-4 mr-2"/> Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a New Template</DialogTitle>
            <DialogDescription>Describe the template you need. The admin will review your request.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="requestDetails">Template Details</Label>
            <Textarea
              id="requestDetails"
              value={requestDetails}
              onChange={e => setRequestDetails(e.target.value)}
              placeholder="e.g., A template for announcing winner of a competition, with placeholders for student name, competition name, and rank."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestTemplate}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
