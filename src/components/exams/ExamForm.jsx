import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export default function ExamForm({ exam, classes = [], subjects = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Unit Test",
    class_id: "",
    subject_name: "", // Changed from subject_id to subject_name for manual entry
    date: "",
    duration_minutes: "",
    max_marks: "",
    pass_marks: "",
    academic_year: "2024-25",
    term: "Term 1",
    status: "Scheduled"
  });

  useEffect(() => {
    if (exam) {
      setFormData({
        ...exam,
        subject_name: exam.subject_name || "" // Handle existing data
      });
    }
  }, [exam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.class_id || !formData.subject_name || !formData.date || !formData.max_marks) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="examName">Exam Name *</Label>
              <Input
                id="examName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Mid Term Mathematics"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="examType">Exam Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit Test">Unit Test</SelectItem>
                  <SelectItem value="Mid Term">Mid Term</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class">Class *</Label>
              <Select value={formData.class_id} onValueChange={(value) => handleInputChange('class_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject Name *</Label>
              <Input
                id="subject"
                value={formData.subject_name}
                onChange={(e) => handleInputChange('subject_name', e.target.value)}
                placeholder="Enter subject name (e.g., Mathematics, Science, English)"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Exam Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(new Date(formData.date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) => handleInputChange('date', date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="duration">Duration (Minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                placeholder="e.g., 90"
              />
            </div>

            <div>
              <Label htmlFor="maxMarks">Maximum Marks *</Label>
              <Input
                id="maxMarks"
                type="number"
                value={formData.max_marks}
                onChange={(e) => handleInputChange('max_marks', e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>

            <div>
              <Label htmlFor="passMarks">Passing Marks</Label>
              <Input
                id="passMarks"
                type="number"
                value={formData.pass_marks}
                onChange={(e) => handleInputChange('pass_marks', e.target.value)}
                placeholder="e.g., 35"
              />
            </div>

            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select value={formData.academic_year} onValueChange={(value) => handleInputChange('academic_year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="term">Term</Label>
              <Select value={formData.term} onValueChange={(value) => handleInputChange('term', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {exam ? 'Update Exam' : 'Schedule Exam'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}