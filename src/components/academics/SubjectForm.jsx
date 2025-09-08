import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function SubjectForm({ subject, classes, teachers, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    code: subject?.code || '',
    class_id: subject?.class_id || '',
    teacher_id: subject?.teacher_id || '',
    type: subject?.type || 'Core',
    max_marks: subject?.max_marks || 100,
    pass_marks: subject?.pass_marks || 33,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Subject Name *</Label>
          <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="code">Subject Code *</Label>
          <Input id="code" value={formData.code} onChange={e => handleChange('code', e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="class_id">Class *</Label>
        <Select value={formData.class_id} onValueChange={value => handleChange('class_id', value)} required>
          <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
          <SelectContent>
            {classes.map(cls => (
              <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="teacher_id">Assigned Teacher</Label>
        <Select value={formData.teacher_id} onValueChange={value => handleChange('teacher_id', value)}>
          <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
          <SelectContent>
            {teachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="type">Subject Type</Label>
        <Select value={formData.type} onValueChange={value => handleChange('type', value)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Core">Core</SelectItem>
            <SelectItem value="Elective">Elective</SelectItem>
            <SelectItem value="Co-curricular">Co-curricular</SelectItem>
          </SelectContent>
        </Select>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="max_marks">Max Marks</Label>
          <Input id="max_marks" type="number" value={formData.max_marks} onChange={e => handleChange('max_marks', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pass_marks">Pass Marks</Label>
          <Input id="pass_marks" type="number" value={formData.pass_marks} onChange={e => handleChange('pass_marks', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
        <Button type="submit" disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save Subject'}</Button>
      </div>
    </form>
  );
}