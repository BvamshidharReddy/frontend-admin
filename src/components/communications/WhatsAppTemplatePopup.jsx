
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Send, MessageCircle, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const templates = [
  { id: 'w1', name: 'Event Invitation', message: '🎉 You are invited to the Annual Sports Day on [Date] at [Time]. Join us for a day of fun and games! View details: [Link]' },
  { id: 'w2', name: 'Digital Marksheet', message: 'Dear Parent, the marksheet for the recent exams is available. Click here to view and download: [Link]' },
];

export default function WhatsAppTemplatePopup({ open, onOpenChange, classes, students, onSend }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [targetAudience, setTargetAudience] = useState('All');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState('');

  const handleSend = () => {
    if (!selectedTemplate) {
      alert('Please select a template.');
      return;
    }
    onSend({
      title: `WhatsApp: ${selectedTemplate.name}`,
      content: selectedTemplate.message,
      target_audience: targetAudience,
    });
    onOpenChange(false);
  };
  
  const handleRequestTemplate = () => {
    if(!requestDetails.trim()) {
      alert("Please provide details for your template request.");
      return;
    }
    console.log("Template request submitted:", requestDetails);
    alert("Your request has been submitted to the super admin for review.");
    setIsRequestDialogOpen(false);
    setRequestDetails('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageCircle /> Send WhatsApp from Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-1 overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2">Select Template</h3>
              <div className="space-y-2">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer ${selectedTemplate?.id === template.id ? 'border-blue-500' : ''}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <p className="font-medium">{template.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setIsRequestDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" /> Request Custom Template
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Preview & Targeting</h3>
              <Card className="flex-1 bg-green-50/50">
                <CardContent className="p-4">
                  {selectedTemplate ? (
                    <Textarea value={selectedTemplate.message} readOnly rows={5} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">Select a template to preview.</div>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSend} disabled={!selectedTemplate}><Send className="w-4 h-4 mr-2"/> Send WhatsApp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a New WhatsApp Template</DialogTitle>
            <DialogDescription>Describe the WhatsApp template you need.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="requestDetailsWhatsapp">Template Details</Label>
            <Textarea id="requestDetailsWhatsapp" value={requestDetails} onChange={e => setRequestDetails(e.target.value)} rows={5} />
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
