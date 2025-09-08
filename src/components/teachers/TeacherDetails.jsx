
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Book,
  Briefcase,
  GraduationCap as QualificationIcon,
  Building2
} from "lucide-react";

export default function TeacherDetails({ teacher }) {
  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      "On Leave": "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[status] || colors.Active;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
          {teacher.user?.first_name?.charAt(0) || 'T'}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{`${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim()}</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <Badge className={getStatusBadge(teacher.is_active ? 'Active' : 'Inactive')}>
              {teacher.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{teacher.employee_id}</Badge>
            {teacher.department && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Building2 className="w-3 h-3 mr-1" />
                {teacher.department}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Phone</label>
                <p className="text-slate-900 flex items-center gap-2"><Phone className="w-4 h-4" />{teacher.user?.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4" />{teacher.user?.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Address</label>
                <p className="text-slate-900 flex items-start gap-2"><MapPin className="w-4 h-4 mt-1" /><span>{teacher.user?.address || 'Not provided'}</span></p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                <p className="text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4" />{teacher.date_of_birth ? new Date(teacher.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Professional Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Department</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {teacher.department || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Designation</label>
                <p className="text-slate-900">{teacher.designation || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Date of Joining</label>
                <p className="text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4" />{teacher.date_of_joining ? new Date(teacher.date_of_joining).toLocaleDateString() : 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Qualification</label>
                <p className="text-slate-900 flex items-center gap-2"><QualificationIcon className="w-4 h-4" />{teacher.qualification || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Experience</label>
                <p className="text-slate-900">{teacher.experience ? `${teacher.experience} years` : 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Class Teacher</label>
                <p className="text-slate-900">{teacher.is_class_teacher ? 'Yes' : 'No'}</p>
              </div>
              {teacher.remarks && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Remarks</label>
                  <p className="text-slate-900">{teacher.remarks}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Book className="w-4 h-4" />
              Subject Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.specialization ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">{teacher.specialization}</Badge>
              ) : (
                <p className="text-sm text-slate-500">No specialization listed.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
