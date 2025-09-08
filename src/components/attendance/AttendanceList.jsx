import React, { useState, useEffect, useMemo } from "react";
import { Attendance, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Save, MoreVertical, Check, X, Clock, CalendarOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  Present: { icon: Check, color: "bg-green-100 text-green-800 border-green-200", buttonColor: "bg-green-500 hover:bg-green-600" },
  Absent: { icon: X, color: "bg-red-100 text-red-800 border-red-200", buttonColor: "bg-red-500 hover:bg-red-600" },
  Late: { icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-200", buttonColor: "bg-yellow-500 hover:bg-yellow-600" },
  Leave: { icon: CalendarOff, color: "bg-blue-100 text-blue-800 border-blue-200", buttonColor: "bg-blue-500 hover:bg-blue-600" },
};

export default function AttendanceList({ people, date, role, classId, sectionId }) {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      // We can only fetch attendance for students as per the entity schema
      if (role !== 'student' || !classId || !sectionId) {
        // For non-students, initialize with a default status.
        const newRecords = {};
        people.forEach(person => {
          newRecords[person.id] = {
            person_id: person.id,
            status: "Present", // Default to Present for staff/teachers
            remarks: "",
          };
        });
        setAttendanceRecords(newRecords);
        setLoading(false);
        return;
      }
      
      try {
        const studentIds = people.map(p => p.id);
        const existingRecords = await Attendance.filter({
          date: date,
          student_id: { $in: studentIds },
        });

        const existingMap = new Map(existingRecords.map(r => [r.student_id, r]));
        
        const newRecords = {};
        people.forEach(person => {
          const existing = existingMap.get(person.id);
          newRecords[person.id] = existing || {
            student_id: person.id,
            status: "Absent", // Default to Absent for students
            remarks: "",
          };
        });
        setAttendanceRecords(newRecords);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [people, date, role, classId, sectionId]);

  const handleStatusChange = (personId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [personId]: { ...prev[personId], status: status },
    }));
  };
  
  const handlePrimaryClick = (personId) => {
    const currentStatus = attendanceRecords[personId]?.status;
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    handleStatusChange(personId, newStatus);
  };

  const handleSaveAttendance = async () => {
    if (role !== 'student') {
        alert("Saving attendance for non-students is not yet supported.");
        return;
    }
    setSaving(true);
    try {
      const user = await User.me();
      const recordsToUpdate = [];
      const recordsToCreate = [];

      for (const personId in attendanceRecords) {
        const record = attendanceRecords[personId];
        if (record.id) {
            recordsToUpdate.push({
              id: record.id,
              data: { status: record.status, remarks: record.remarks },
            });
        } else {
            recordsToCreate.push({
              student_id: personId,
              status: record.status,
              remarks: record.remarks,
              date,
              class_id: classId,
              section_id: sectionId,
              marked_by: user.email,
            });
        }
      }

      if (recordsToCreate.length > 0) {
        await Attendance.bulkCreate(recordsToCreate);
      }
      for (const { id, data } of recordsToUpdate) {
        await Attendance.update(id, data);
      }
      
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Error saving attendance.");
    } finally {
      setSaving(false);
    }
  };
  
  const summary = Object.values(attendanceRecords).reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
  }, {});
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(people.length || 12).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-6 bg-slate-50/50">
        <CardHeader className="p-4">
            <CardTitle className="text-base">Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
                {Object.entries(summary).map(([status, count]) => {
                  const config = statusConfig[status];
                  if (!config) return null;
                  return (
                    <Badge key={status} className={`${config.color} text-sm`}>
                      <config.icon className="w-4 h-4 mr-1.5" />
                      {status}: {count}
                    </Badge>
                  )
                })}
            </div>
        </CardContent>
      </Card>
  
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {people.sort((a, b) => (a.roll_no || a.employee_id || a.name).localeCompare(b.roll_no || b.employee_id || b.name)).map(person => {
          const record = attendanceRecords[person.id];
          if (!record) return null;
          const config = statusConfig[record.status] || statusConfig.Absent;
          
          return (
            <div key={person.id} className="relative">
              <Button
                variant="outline"
                className={`h-28 w-full flex flex-col justify-center items-center gap-2 p-2 whitespace-normal text-white transition-all duration-200 border-2 ${config.buttonColor}`}
                onClick={() => handlePrimaryClick(person.id)}
              >
                <span className="text-xl font-bold">{person.roll_no || person.employee_id?.slice(-4)}</span>
                <span className="text-xs text-center font-medium leading-tight">{person.name}</span>
                <Badge variant="secondary" className="absolute top-1 left-1 h-5 px-1.5 text-xs bg-black/20 text-white border-0">
                  <config.icon className="w-3 h-3 mr-1" />
                  {record.status}
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8 bg-black/20 hover:bg-black/40 text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'Present')}>
                    <Check className="w-4 h-4 mr-2 text-green-500" /> Mark Present
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'Absent')}>
                    <X className="w-4 h-4 mr-2 text-red-500" /> Mark Absent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'Late')}>
                    <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Mark Late
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'Leave')}>
                    <CalendarOff className="w-4 h-4 mr-2 text-blue-500" /> Mark as on Leave
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveAttendance} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
}