import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function ClassForm({ classData, teachers, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    stream: classData?.stream || '',
    academic_year: classData?.academic_year || '2024-25',
    class_teacher_id: classData?.class_teacher_id || '',
    status: classData?.status || 'Active',
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
        <Label htmlFor="name">Class Name *</Label>
        <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="stream">Stream/Board</Label>
        <Input id="stream" value={formData.stream} onChange={e => handleChange('stream', e.target.value)} />
      </div>
      <div>
        <Label htmlFor="academic_year">Academic Year *</Label>
        <Input id="academic_year" value={formData.academic_year} onChange={e => handleChange('academic_year', e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="class_teacher_id">Class Teacher</Label>
        <Select value={formData.class_teacher_id} onValueChange={value => handleChange('class_teacher_id', value)}>
          <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
          <SelectContent>
            {teachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
        <Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save Class'}</Button>
      </div>
    </form>
  );
}