import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X } from "lucide-react";

export default function StudentForm({ student, classes, sections, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    // User fields
    first_name: student?.user?.first_name || "",
    last_name: student?.user?.last_name || "",
    email: student?.user?.email || "",
    phone_number: student?.user?.phone_number || "",
    address: student?.user?.address || "",
    // Student specific fields
    admission_number: student?.admission_number || "",
    roll_number: student?.roll_number || "",
    date_of_birth: student?.date_of_birth || "",
    gender: student?.gender || "",
    blood_group: student?.blood_group || "",
    current_class: student?.current_class || "",
    current_section: student?.current_section || "",
    parent_name: student?.parent_name || "",
    parent_phone: student?.parent_phone || "",
    parent_email: student?.parent_email || "",
    is_active: student?.is_active !== undefined ? student.is_active : true,
    previous_school: student?.previous_school || "",
    remarks: student?.remarks || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transform form data to match API structure
      const studentData = {
        admission_number: formData.admission_number,
        roll_number: formData.roll_number,
        date_of_admission: new Date().toISOString().split('T')[0], // Today's date
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        blood_group: formData.blood_group,
        parent_name: formData.parent_name,
        parent_phone: formData.parent_phone,
        parent_email: formData.parent_email,
        is_active: formData.is_active,
        current_class: formData.current_class,
        current_section: formData.current_section,
        previous_school: formData.previous_school,
        remarks: formData.remarks,
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          user_type: "student"
        }
      };
      await onSubmit(studentData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredSections = sections.filter(section => section.class_id === formData.class_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-4">Student Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admission_number">Admission Number *</Label>
              <Input
                id="admission_number"
                value={formData.admission_number}
                onChange={(e) => handleChange('admission_number', e.target.value)}
                placeholder="Enter admission number"
                required
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Enter first name"
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
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Student email address"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select value={formData.blood_group} onValueChange={(value) => handleChange('blood_group', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="Student phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current_class">Class</Label>
              <Select value={formData.current_class} onValueChange={(value) => handleChange('current_class', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="current_section">Section</Label>
              <Input
                id="current_section"
                value={formData.current_section}
                onChange={(e) => handleChange('current_section', e.target.value)}
                placeholder="Section (e.g., A, B, C)"
              />
            </div>
            <div>
              <Label htmlFor="roll_number">Roll Number</Label>
              <Input
                id="roll_number"
                value={formData.roll_number}
                onChange={(e) => handleChange('roll_number', e.target.value)}
                placeholder="Roll number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter residential address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
          
          <div>
            <Label htmlFor="previous_school">Previous School</Label>
            <Input
              id="previous_school"
              value={formData.previous_school}
              onChange={(e) => handleChange('previous_school', e.target.value)}
              placeholder="Previous school name (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent_name">Parent/Guardian Name</Label>
              <Input
                id="parent_name"
                value={formData.parent_name}
                onChange={(e) => handleChange('parent_name', e.target.value)}
                placeholder="Parent or guardian name"
              />
            </div>
            <div>
              <Label htmlFor="parent_phone">Parent/Guardian Phone</Label>
              <Input
                id="parent_phone"
                value={formData.parent_phone}
                onChange={(e) => handleChange('parent_phone', e.target.value)}
                placeholder="Parent or guardian phone"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parent_email">Parent/Guardian Email</Label>
            <Input
              id="parent_email"
              type="email"
              value={formData.parent_email}
              onChange={(e) => handleChange('parent_email', e.target.value)}
              placeholder="Parent or guardian email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Additional notes (optional)"
              />
            </div>
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
          {loading ? "Saving..." : "Save Student"}
        </Button>
      </div>
    </form>
  );
}