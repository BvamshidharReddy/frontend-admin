import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X } from "lucide-react";

const DEPARTMENTS = [
  "Mathematics",
  "Science", 
  "English",
  "Social Studies",
  "Physical Education",
  "Arts",
  "Music",
  "Computer Science",
  "Languages",
  "Special Education",
  "Administration"
];

const SUBJECT_OPTIONS = {
  "Mathematics": ["Algebra", "Geometry", "Calculus", "Statistics", "Applied Mathematics"],
  "Science": ["Physics", "Chemistry", "Biology", "General Science", "Environmental Science"],
  "English": ["English Literature", "English Grammar", "Creative Writing", "Communication Skills"],
  "Social Studies": ["History", "Geography", "Civics", "Economics", "Political Science"],
  "Physical Education": ["Sports", "Physical Training", "Health Education", "Yoga"],
  "Arts": ["Drawing", "Painting", "Craft", "Visual Arts", "Fine Arts"],
  "Music": ["Vocal Music", "Instrumental Music", "Music Theory", "Classical Music"],
  "Computer Science": ["Programming", "Computer Applications", "Information Technology", "Web Development"],
  "Languages": ["Hindi", "Sanskrit", "French", "German", "Spanish", "Regional Languages"],
  "Special Education": ["Learning Disabilities", "Autism Support", "Counseling", "Remedial Teaching"],
  "Administration": ["Principal", "Vice Principal", "Administrative Coordinator", "Academic Coordinator"]
};

export default function TeacherForm({ teacher, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    employee_id: teacher?.employee_id || "",
    first_name: teacher?.user?.first_name || "",
    last_name: teacher?.user?.last_name || "",
    phone_number: teacher?.user?.phone_number || "",
    email: teacher?.user?.email || "",
    address: teacher?.user?.address || "",
    department: teacher?.department || "",
    designation: teacher?.designation || "",
    qualification: teacher?.qualification || "",
    date_of_joining: teacher?.date_of_joining || "",
    date_of_birth: teacher?.date_of_birth || "",
    gender: teacher?.gender || "",
    experience: teacher?.experience || "",
    specialization: teacher?.specialization || "",
    is_active: teacher?.is_active !== undefined ? teacher.is_active : true,
    is_class_teacher: teacher?.is_class_teacher || false,
    remarks: teacher?.remarks || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Transform form data to match API structure
    const teacherData = {
      employee_id: formData.employee_id,
      department: formData.department,
      designation: formData.designation,
      qualification: formData.qualification,
      date_of_joining: formData.date_of_joining,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      experience: parseInt(formData.experience) || 0,
      specialization: formData.specialization,
      is_active: formData.is_active,
      is_class_teacher: formData.is_class_teacher,
      remarks: formData.remarks,
      user: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        user_type: "teacher"
      }
    };
    
    try {
      await onSubmit(teacherData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({ 
      ...prev, 
      specialization: subject
    }));
  };

  const availableSubjects = formData.department ? SUBJECT_OPTIONS[formData.department] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="Unique Employee ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="First name"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="Contact number"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Residential address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-4">Professional Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => {
                handleChange('department', value);
                // Reset subject specializations when department changes
                handleChange('subject_specializations', []);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="e.g., Senior Teacher, Head of Department"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                placeholder="e.g., M.Sc, B.Ed"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="Years of experience"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_of_joining">Date of Joining</Label>
              <Input
                id="date_of_joining"
                type="date"
                value={formData.date_of_joining}
                onChange={(e) => handleChange('date_of_joining', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="is_class_teacher">Class Teacher</Label>
              <Select value={formData.is_class_teacher.toString()} onValueChange={(value) => handleChange('is_class_teacher', value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="Is class teacher?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialization">Subject Specialization</Label>
              {formData.department ? (
                <Select 
                  value={formData.specialization} 
                  onValueChange={(value) => handleSubjectChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject from your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  placeholder="Select department first, then choose subject"
                  disabled
                />
              )}
              <p className="text-xs text-slate-500 mt-1">
                {formData.department ? "Choose from department-specific subjects" : "Please select a department first"}
              </p>
            </div>
            <div>
              <Label htmlFor="is_active">Status</Label>
              <Select value={formData.is_active.toString()} onValueChange={(value) => handleChange('is_active', value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Additional notes or remarks"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Teacher"}
        </Button>
      </div>
    </form>
  );
}