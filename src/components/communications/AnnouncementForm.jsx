import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Send } from "lucide-react";

export default function AnnouncementForm({ announcement, onSubmit, onCancel, classes, students }) {
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    content: announcement?.content || "",
    target_audience: announcement?.target_audience || "All",
    target_classes: announcement?.target_classes || [],
    priority: announcement?.priority || "Normal",
    channel: announcement?.channel || ["Email"],
    scheduled_at: announcement?.scheduled_at || "",
    status: announcement?.status || "Draft"
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting announcement:", error);
    }
    setLoading(false);
  };

  const handleChannelChange = (channel, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        channel: [...prev.channel, channel]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        channel: prev.channel.filter(c => c !== channel)
      }));
    }
  };

  const handleSelectAllChannels = (checked) => {
    setFormData(prev => ({
      ...prev,
      channel: checked ? ["Email", "SMS", "WhatsApp", "Push"] : ["Email"]
    }));
  };

  const allChannelsSelected = formData.channel.length === 4;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Message Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter your announcement message..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Audience</Label>
              <Select value={formData.target_audience} onValueChange={(value) => setFormData({...formData, target_audience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Teachers">Teachers</SelectItem>
                  <SelectItem value="Parents">Parents</SelectItem>
                  <SelectItem value="Students">Students</SelectItem>
                  <SelectItem value="Specific Classes">Specific Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.target_audience === "Specific Classes" && (
            <div>
              <Label>Select Classes</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                {classes.map(cls => (
                  <div key={cls.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cls.id}
                      checked={formData.target_classes.includes(cls.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({...prev, target_classes: [...prev.target_classes, cls.id]}));
                        } else {
                          setFormData(prev => ({...prev, target_classes: prev.target_classes.filter(c => c !== cls.id)}));
                        }
                      }}
                    />
                    <Label htmlFor={cls.id} className="text-sm">{cls.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Communication Channels</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <Checkbox
                  id="select-all-channels"
                  checked={allChannelsSelected}
                  onCheckedChange={handleSelectAllChannels}
                />
                <Label htmlFor="select-all-channels" className="font-medium">Select All Channels</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Email', label: 'Email', icon: '📧' },
                  { id: 'SMS', label: 'SMS', icon: '💬' },
                  { id: 'WhatsApp', label: 'WhatsApp', icon: '🟢' },
                  { id: 'Push', label: 'App Notification', icon: '🔔' }
                ].map(channel => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.id}
                      checked={formData.channel.includes(channel.id)}
                      onCheckedChange={(checked) => handleChannelChange(channel.id, checked)}
                    />
                    <Label htmlFor={channel.id} className="text-sm flex items-center gap-1">
                      <span>{channel.icon}</span>
                      {channel.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="scheduled_at">Schedule Send Time (Optional)</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Send className="w-4 h-4 mr-2" />
          {loading ? "Sending..." : formData.scheduled_at ? "Schedule" : "Send Now"}
        </Button>
      </div>
    </form>
  );
}