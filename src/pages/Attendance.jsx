
import React, { useState, useEffect, useMemo } from 'react';
import { Student, Teacher, Staff, Class, Section, Attendance } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, GraduationCap, Briefcase, Calendar as CalendarIcon, CalendarCheck, Search, UserCheck, UserX, Clock, CalendarOff } from 'lucide-react';
import { format } from "date-fns";
import AttendanceList from "../components/attendance/AttendanceList";
import ProvideAttendancePopup from "../components/attendance/ProvideAttendancePopup";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  STAFF: 'staff',
};

const STATIC_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export default function AttendancePage() {
  const [role, setRole] = useState('');
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProvideAttendancePopup, setShowProvideAttendancePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [showAttendanceStats, setShowAttendanceStats] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(null);

  // Today's attendance statistics
  const [todayAttendanceStats, setTodayAttendanceStats] = useState({
    students: { present: 0, absent: 0, total: 0, percentage: 0 },
    staff: { present: 0, absent: 0, total: 0, percentage: 0 }
  });

  useEffect(() => {
    loadData();
    loadTodayAttendance();
  }, []);

  useEffect(() => {
    setSelectedClass("");
    setSelectedSection("");
    setSearchTerm(''); // Clear search term on role change
    setShowAttendanceStats(false); // Hide stats on role change
    setAttendanceStats(null); // Clear stats on role change
  }, [role]);

  useEffect(() => {
    setShowAttendanceStats(false); // Hide stats on class/section/date change
    setAttendanceStats(null); // Clear stats on class/section/date change
  }, [selectedClass, selectedSection, dateRange]);
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const studentsData = await Student.list().catch(() => []);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const teachersData = await Teacher.list().catch(() => []);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const classesData = await Class.list().catch(() => []);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const attendanceData = await Attendance.list().catch(() => []);

      setAllStudents(studentsData);
      setAllTeachers(teachersData);
      setClasses(classesData);
      setAttendanceRecords(attendanceData);
    } catch (err) {
      console.error("Failed to load attendance data:", err);
      setError("Failed to load data. Please try again.");
    }
    setIsLoading(false);
  };

  const loadTodayAttendance = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = await Attendance.filter({ date: today }).catch(() => []);
      
      // Calculate student attendance
      const studentAttendance = todayAttendance.filter(record => {
        // Assuming we can identify student records (vs staff) by presence of student_id
        return record.student_id;
      });
      
      const studentsPresent = studentAttendance.filter(record => 
        record.status === 'Present' || record.status === 'Late'
      ).length;
      const studentsAbsent = studentAttendance.filter(record => 
        record.status === 'Absent'
      ).length;
      const totalStudentRecords = studentAttendance.length;
      const studentPercentage = totalStudentRecords > 0 ? Math.round((studentsPresent / totalStudentRecords) * 100) : 0;

      // Mock staff attendance (in a real app, you'd have staff attendance records)
      const mockStaffTotal = 25; // Total staff members
      const mockStaffPresent = 22; // Present staff
      const mockStaffAbsent = 3; // Absent staff
      const staffPercentage = Math.round((mockStaffPresent / mockStaffTotal) * 100);

      setTodayAttendanceStats({
        students: {
          present: studentsPresent,
          absent: studentsAbsent,
          total: totalStudentRecords,
          percentage: studentPercentage
        },
        staff: {
          present: mockStaffPresent,
          absent: mockStaffAbsent,
          total: mockStaffTotal,
          percentage: staffPercentage
        }
      });
    } catch (error) {
      console.error("Failed to load today's attendance:", error);
    }
  };
  
  const peopleToDisplay = useMemo(() => {
    let list = [];
    if (role === ROLES.STUDENT) {
      if (selectedClass && selectedSection && selectedSection !== 'all') {
        list = allStudents.filter(s => s.class_id === selectedClass && s.section_id === selectedSection);
      } else if (selectedClass && selectedSection === 'all') {
        list = allStudents.filter(s => s.class_id === selectedClass);
      }
    } else if (role === ROLES.TEACHER) {
       if (selectedClass) {
          list = allTeachers.filter(t => t.class_id === selectedClass);
       } else {
         list = allTeachers;
       }
    } else if (role === ROLES.STAFF) {
      list = []; 
    }

    if (searchTerm) {
      list = list.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.roll_no && person.roll_no.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.employee_id && person.employee_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return list;
  }, [role, selectedClass, selectedSection, allStudents, allTeachers, searchTerm]);

  const startDateFormatted = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const endDateFormatted = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : startDateFormatted;

  const handleViewAttendance = async () => {
    if (!role || !selectedClass || !selectedSection || selectedSection === 'all') {
      alert('Please select role, class, and a specific section (not "All Sections") to view attendance statistics.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : startDate;
      
      // Get students for the selected class and section
      const studentsInSection = allStudents.filter(s => 
        s.class_id === selectedClass && s.section_id === selectedSection
      );
      
      if (studentsInSection.length === 0) {
        setAttendanceStats({
          totalStudents: 0,
          totalRecords: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          leaveCount: 0,
          attendancePercentage: 0,
          dateRange: { startDate, endDate }
        });
        setShowAttendanceStats(true);
        setIsLoading(false);
        return;
      }

      // Fetch attendance records for the date range
      // Assuming Attendance.filter can take query parameters like $in, $gte, $lte
      const studentIds = studentsInSection.map(s => s.id);
      const filteredAttendanceRecords = await Attendance.filter({
        student_id: { $in: studentIds },
        date: { $gte: startDate, $lte: endDate },
        class_id: selectedClass,
        section_id: selectedSection
      });

      // Calculate statistics
      const presentCount = filteredAttendanceRecords.filter(r => r.status === 'Present').length;
      const absentCount = filteredAttendanceRecords.filter(r => r.status === 'Absent').length;
      const lateCount = filteredAttendanceRecords.filter(r => r.status === 'Late').length;
      const leaveCount = filteredAttendanceRecords.filter(r => r.status === 'Leave').length;
      
      const totalRecords = presentCount + absentCount + lateCount + leaveCount;
      const attendancePercentage = totalRecords > 0 
        ? Math.round(((presentCount + lateCount) / totalRecords) * 100) 
        : 0;

      setAttendanceStats({
        totalStudents: studentsInSection.length,
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        leaveCount,
        attendancePercentage,
        dateRange: { startDate, endDate }
      });
      
      setShowAttendanceStats(true);
    } catch (error) {
      console.error("Error fetching attendance statistics:", error);
      setError("Error fetching attendance data. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance</h1>
            <p className="text-slate-600">Mark and review attendance</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-1/2 md:w-1/3"
            />
          </div>
        </div>

        {/* Today's Attendance Overview */}
        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Today's Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students Attendance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-slate-900">Students</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200 p-4">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-700">{todayAttendanceStats.students.present}</p>
                        <p className="text-sm text-green-600">Present ({todayAttendanceStats.students.percentage}%)</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-red-50 border-red-200 p-4">
                    <div className="flex items-center gap-3">
                      <UserX className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-700">{todayAttendanceStats.students.absent}</p>
                        <p className="text-sm text-red-600">Absent ({100 - todayAttendanceStats.students.percentage}%)</p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="text-center text-sm text-slate-600">
                  Total Records: {todayAttendanceStats.students.total}
                </div>
              </div>

              {/* Staff Attendance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Staff & Teachers</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200 p-4">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-700">{todayAttendanceStats.staff.present}</p>
                        <p className="text-sm text-green-600">Present ({todayAttendanceStats.staff.percentage}%)</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-red-50 border-red-200 p-4">
                    <div className="flex items-center gap-3">
                      <UserX className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-700">{todayAttendanceStats.staff.absent}</p>
                        <p className="text-sm text-red-600">Absent ({100 - todayAttendanceStats.staff.percentage}%)</p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="text-center text-sm text-slate-600">
                  Total Staff: {todayAttendanceStats.staff.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <CardTitle>View Attendance</CardTitle>
            {isLoading && (
              <div className="text-sm text-slate-500 flex items-center mt-2 md:mt-0">
                <span className="animate-spin mr-2">⏳</span> Loading data...
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-600">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLES.STUDENT}><Users className="w-4 h-4 mr-2 inline-block"/>Student</SelectItem>
                    <SelectItem value={ROLES.TEACHER}><GraduationCap className="w-4 h-4 mr-2 inline-block"/>Teacher</SelectItem>
                    <SelectItem value={ROLES.STAFF}><Briefcase className="w-4 h-4 mr-2 inline-block"/>Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              { (role === ROLES.STUDENT || role === ROLES.TEACHER) && (
                 <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-600">Class</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              )}

              {role === ROLES.STUDENT && (
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-600">Section</label>
                    <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {STATIC_SECTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            Section {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <div className="space-y-1 flex-grow">
                  <label className="text-xs font-medium text-slate-600">Date Range</label>
                  <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                      <div className="p-3 border-t">
                        <Button onClick={() => setIsDatePopoverOpen(false)} className="w-full">
                          OK
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* View Attendance Button */}
            {role && selectedClass && selectedSection && selectedSection !== 'all' && (
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={handleViewAttendance}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  View Attendance Statistics
                </Button>
              </div>
            )}

            {/* Attendance Statistics Display */}
            {showAttendanceStats && attendanceStats && (
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Attendance Statistics</CardTitle>
                  <p className="text-sm text-blue-700">
                    From {format(new Date(attendanceStats.dateRange.startDate), 'PPP')} 
                    to {format(new Date(attendanceStats.dateRange.endDate), 'PPP')}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{attendanceStats.attendancePercentage}%</div>
                      <div className="text-sm text-slate-600">Overall Attendance</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">{attendanceStats.presentCount}</div>
                      <div className="text-sm text-slate-600">Present</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">{attendanceStats.absentCount}</div>
                      <div className="text-sm text-slate-600">Absent</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateCount}</div>
                      <div className="text-sm text-slate-600">Late</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-600">
                      Total Records: {attendanceStats.totalRecords} | Total Students in Section: {attendanceStats.totalStudents}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {role && selectedClass && selectedSection === 'all' && (
              <div className="text-center py-6">
                <Button onClick={() => setShowProvideAttendancePopup(true)}>
                  Provide Attendance
                </Button>
                <p className="mt-2 text-sm text-slate-500">
                  Attendance history for 'All Sections' cannot be displayed directly here. Select a specific section to view attendance details or statistics.
                </p>
              </div>
            )}

            {/* Conditional rendering for AttendanceList or messages */}
            {role ? (
              (selectedSection && selectedSection !== 'all') ? (
                peopleToDisplay.length > 0 ? (
                  <AttendanceList
                    key={`${role}-${selectedClass}-${selectedSection}-${startDateFormatted}`}
                    people={peopleToDisplay}
                    date={startDateFormatted} // This seems to be for a single date, consider dateRange.from if multi-day is needed here
                    role={role}
                    classId={selectedClass}
                    sectionId={selectedSection}
                  />
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    {isLoading ? <p>Loading people...</p> : <p>No records found for the selected criteria. Please adjust your selections or provide attendance for this section.</p>}
                  </div>
                )
              ) : (role && selectedSection !== 'all') ? (
                <div className="text-center py-10 text-slate-500">
                  {isLoading ? <p>Loading people...</p> : <p>Please complete your class and specific section selections to view history, or select 'All Sections' to provide attendance for the entire class.</p>}
                </div>
              ) : null
            ) : (
              <div className="text-center py-10 text-slate-500">
                <p>Please select a role to begin.</p>
                <Button onClick={loadData} className="mt-4" disabled={isLoading}>
                    <CalendarCheck className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {showProvideAttendancePopup && (
          <ProvideAttendancePopup
            open={showProvideAttendancePopup}
            onOpenChange={setShowProvideAttendancePopup}
            role={role}
            classId={selectedClass}
            startDate={startDateFormatted}
            endDate={endDateFormatted}
            allStudents={allStudents}
            allTeachers={allTeachers}
          />
        )}
      </div>
    </div>
  );
}
