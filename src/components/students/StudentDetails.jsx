import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Hash,
  Users
} from "lucide-react";

export default function StudentDetails({ student, classes, sections }) {
  const classObj = classes.find(c => c.id === student.class_id);
  const sectionObj = sections.find(s => s.id === student.section_id);

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      Graduated: "bg-blue-100 text-blue-800 border-blue-200",
      Transferred: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[status] || colors.Active;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
          {student.name?.charAt(0) || 'S'}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{student.name}</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <Badge className={getStatusBadge(student.status)}>
              {student.status}
            </Badge>
            <Badge variant="outline">
              {classObj?.name} - {sectionObj?.name}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {student.admission_no}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Roll: {student.roll_no}
            </div>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {student.dob ? new Date(student.dob).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Gender</label>
                <p className="text-slate-900">{student.gender || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Address</label>
                <p className="text-slate-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>{student.address || 'Not provided'}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {student.phone && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone</label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {student.phone}
                  </p>
                </div>
              )}
              {student.email && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Parent/Guardian Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {student.parent_name && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <p className="text-slate-900">{student.parent_name}</p>
                </div>
              )}
              {student.parent_phone && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone</label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {student.parent_phone}
                  </p>
                </div>
              )}
              {student.parent_email && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {student.parent_email}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}