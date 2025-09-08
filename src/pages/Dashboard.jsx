
import React, { useState, useEffect } from "react";
import { Student } from '@/api/entities';
import { Teacher } from '@/api/entities';
import { Class } from '@/api/entities';
import { Attendance } from '@/api/entities';
import { Fee } from '@/api/entities';
import { Exam } from '@/api/entities';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  DollarSign,
  FileText,
  Play,
  Send,
  UserCheck,
  Calendar,
  Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import RiskRadar from "../components/dashboard/RiskRadar";
import ActionQueue from "../components/dashboard/ActionQueue";
import SchoolDetailsPopup from "../components/dashboard/SchoolDetailsPopup";
import ScheduledEventsPopup from "../components/dashboard/ScheduledEventsPopup";
import FeeDuesPopup from "../components/dashboard/FeeDuesPopup";
import SalaryDuesPopup from "../components/dashboard/SalaryDuesPopup";
import AICard from "../components/dashboard/AICard";

// shadcn Select
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    attendance: 0,
    fees: 0,
    exams: 0,
    tickets: 0,
    parents: 0,
    staff: 0,
    todayEvents: 0,
    salaryDues: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const academicYears = ["2023-24", "2024-25", "2025-26"];

  // This would typically come from user data or tenant settings
  const [currentPlan, setCurrentPlan] = useState("basic"); // 'basic', 'standard', or 'premium'

  // Popup states
  const [showSchoolDetailsPopup, setShowSchoolDetailsPopup] = useState(false);
  const [showScheduledEventsPopup, setShowScheduledEventsPopup] = useState(false);
  const [showFeeDuesPopup, setShowFeeDuesPopup] = useState(false);
  const [showSalaryDuesPopup, setShowSalaryDuesPopup] = useState(false);

  useEffect(() => {
    loadDashboardData(academicYear);
  }, [academicYear]);

  const loadDashboardData = async (year) => {
    setLoading(true);
    setLoadingError(false);
    
    try {
      // Load data with error handling
      const studentsResponse = await Student.list().catch((error) => {
        console.warn('Failed to load students:', error);
        return { data: [] };
      });
      const students = studentsResponse?.data?.results || studentsResponse?.results || studentsResponse?.data || studentsResponse || [];
      
      const teachersResponse = await Teacher.list().catch((error) => {
        console.warn('Failed to load teachers:', error);
        return { data: [] };
      });
      const teachers = teachersResponse?.data?.results || teachersResponse?.results || teachersResponse?.data || teachersResponse || [];
      
      const classesResponse = await Class.list().catch((error) => {
        console.warn('Failed to load classes:', error);
        return { data: [] };
      });
      const classes = classesResponse?.data?.results || classesResponse?.results || classesResponse?.data || classesResponse || [];
      
      const attendanceResponse = await Attendance.list().catch((error) => {
        console.warn('Failed to load attendance:', error);
        return { data: [] };
      });
      const attendance = attendanceResponse?.data?.results || attendanceResponse?.results || attendanceResponse?.data || attendanceResponse || [];
      
      const fees = await Fee.list().catch((error) => {
        console.warn('Failed to load fees:', error);
        return { data: [] };
      });
      
      const examsResponse = await Exam.list().catch((error) => {
        console.warn('Failed to load exams:', error);
        return { data: [] };
      });
      const exams = examsResponse?.data?.results || examsResponse?.results || examsResponse?.data || examsResponse || [];

      // Calculate today's attendance percentage with null checks
      const today = new Date().toISOString().split("T")[0];
      const todayAttendance = (attendance || []).filter((a) => a?.date === today);
      const presentToday = todayAttendance.filter(
        (a) => a?.status === "present"
      ).length;
      const attendancePercentage =
        todayAttendance.length > 0
          ? Math.round((presentToday / todayAttendance.length) * 100)
          : 85;

      // Calculate pending fees with null checks
      const feesData = fees?.data || fees || [];
      const pendingFees = feesData.filter(
        (f) => f?.status === "pending" || f?.status === "overdue"
      ).length;

      // Calculate today's exams with null checks
      const todayExams = (exams || []).filter((e) => {
        if (!e?.date) return false;
        const examDate = new Date(e.date);
        const todayDate = new Date();
        return examDate.toDateString() === todayDate.toDateString();
      }).length;

      // Calculate parents from unique parent contacts
      const uniqueParents = new Set();
      (students || []).forEach(s => {
        if (s?.parent_phone || s?.parent_name) {
          uniqueParents.add(`${s.parent_phone || ''}-${s.parent_name || ''}`);
        }
      });

      // Mock today's events
      const todayEvents = 2;

      // Mock salary dues (would come from HR/Payroll system)
      const salaryDues = 3;

      setStats({
        students: students?.length || 0,
        teachers: teachers?.length || 0,
        parents: uniqueParents.size,
        staff: 15, // Mock data
        classes: classes?.length || 0,
        attendance: attendancePercentage,
        fees: pendingFees,
        exams: todayExams,
        todayEvents: todayEvents,
        salaryDues: salaryDues
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoadingError(true);
      setStats({
        students: 0,
        teachers: 0,
        parents: 0,
        staff: 0,
        classes: 0,
        attendance: 0,
        fees: 0,
        exams: 0,
        todayEvents: 0,
        salaryDues: 0
      });
    }
    setLoading(false);
  };

  const quickActions = [
    {
      title: "Add Student",
      description: "Register new student",
      icon: Users,
      link: createPageUrl("Students"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Schedule Exam",
      description: "Create examination",
      icon: FileText,
      link: createPageUrl("Examinations"),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Send Notice",
      description: "Broadcast announcement",
      icon: Send,
      link: createPageUrl("Communications"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Start Event",
      description: "Begin live streaming",
      icon: Play,
      link: createPageUrl("Events"),
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Show error message if data loading failed
  if (loadingError) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Dashboard</h2>
              <p className="text-slate-600 mb-4">There was an issue loading the dashboard data. This might be due to network connectivity or server issues.</p>
              <Button onClick={() => loadDashboardData(academicYear)}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              School Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Welcome to MedhaShaala Admin Panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-blue-700" />
            <Select value={academicYear} onValueChange={(val) => setAcademicYear(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards - Updated layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 auto-rows-fr">
          <div onClick={() => setShowSchoolDetailsPopup(true)} className="cursor-pointer h-full">
            <StatsCard
              title="School Details"
              icon={Users}
              color="from-blue-500 to-blue-600"
              loading={loading}
              clickable={true}
            />
          </div>
          <Link to={createPageUrl("Attendance")} className="h-full">
            <StatsCard
              title="Attendance"
              value={`${stats.attendance}%`}
              subtitle="Today"
              icon={ClipboardCheck}
              color="from-emerald-500 to-emerald-600"
              loading={loading}
              clickable={true}
            />
          </Link>
          <div onClick={() => setShowScheduledEventsPopup(true)} className="cursor-pointer h-full">
            <StatsCard
              title="Scheduled Events"
              value={stats.exams + stats.todayEvents}
              subtitle="Today's Schedule"
              icon={Calendar}
              color="from-purple-500 to-purple-600"
              loading={loading}
              clickable={true}
            />
          </div>
          <div onClick={() => setShowFeeDuesPopup(true)} className="cursor-pointer h-full">
            <StatsCard
              title="Fee Dues"
              value={stats.fees}
              subtitle="Pending"
              icon={DollarSign}
              color="from-orange-500 to-orange-600"
              loading={loading}
              clickable={true}
            />
          </div>
          <div onClick={() => setShowSalaryDuesPopup(true)} className="cursor-pointer h-full">
            <StatsCard
              title="Salary Dues"
              value={stats.salaryDues}
              subtitle="Pending"
              icon={Wallet}
              color="from-red-500 to-red-600"
              loading={loading}
              clickable={true}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.link}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {action.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* AI Card */}
        <div className="mb-8">
            <AICard currentPlan={currentPlan} />
        </div>

        {/* Risk Radar & Action Queue */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <RiskRadar />
          <ActionQueue />
        </div>

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Popups */}
        <SchoolDetailsPopup 
          open={showSchoolDetailsPopup} 
          onOpenChange={setShowSchoolDetailsPopup}
          stats={stats}
        />
        <ScheduledEventsPopup 
          open={showScheduledEventsPopup} 
          onOpenChange={setShowScheduledEventsPopup}
          examCount={stats.exams}
          eventCount={stats.todayEvents}
        />
        <FeeDuesPopup 
          open={showFeeDuesPopup} 
          onOpenChange={setShowFeeDuesPopup}
          dueCount={stats.fees}
        />
        <SalaryDuesPopup 
          open={showSalaryDuesPopup} 
          onOpenChange={setShowSalaryDuesPopup}
          dueCount={stats.salaryDues}
        />
      </div>
    </div>
  );
}
