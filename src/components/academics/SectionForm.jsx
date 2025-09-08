import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

export default function SectionForm({ sectionData, classId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: sectionData?.name || '',
    capacity: sectionData?.capacity || '',
    room_no: sectionData?.room_no || '',
    status: sectionData?.status || 'Active',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="name">Section Name *</Label>
        <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required placeholder="e.g., A, B, Bluebells" />
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input id="capacity" type="number" value={formData.capacity} onChange={e => handleChange('capacity', e.target.value)} />
      </div>
      <div>
        <Label htmlFor="room_no">Room Number</Label>
        <Input id="room_no" value={formData.room_no} onChange={e => handleChange('room_no', e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
        <Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save Section'}</Button>
      </div>
    </form>
  );
}