
import React, { useState, useEffect } from "react";
import { Teacher } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  GraduationCap, 
  Phone, 
  Mail,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2 // Added Building2 icon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherForm from "../components/teachers/TeacherForm";
import TeacherDetails from "../components/teachers/TeacherDetails";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all"); // New state for department filter
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Teacher.list();
      // Handle paginated response format
      const teachersData = response?.data?.results || response?.results || response?.data || response;
      if (!Array.isArray(teachersData)) {
        throw new Error("Invalid teacher data format");
      }
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error loading teachers:", error);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      await Teacher.create(teacherData);
      setShowAddDialog(false);
      loadTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
      setError("Failed to add teacher. Please try again.");
    }
  };

  const handleEditTeacher = async (teacherData) => {
    try {
      if (!editingTeacher?.id) throw new Error("No teacher selected for editing");
      await Teacher.update(editingTeacher.id, teacherData);
      setEditingTeacher(null);
      loadTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
      setError("Failed to update teacher. Please try again.");
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (confirm("Are you sure you want to delete this teacher's record?")) {
      try {
        await Teacher.delete(teacherId);
        loadTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
        setError("Failed to delete teacher. Please try again.");
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
    setCurrentPage(1);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const teacherName = `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim();
    const teacherEmail = teacher.user?.email || '';
    const matchesSearch = (
      teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacherEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
    const teacherSpecialization = teacher.specialization || '';
    const matchesSubject = selectedSubject === "all" || 
                          teacherSpecialization.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment;
    return matchesSearch && matchesSubject && matchesDepartment;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    const aValue = a[key] || "";
    const bValue = b[key] || "";

    // Handle string comparison for case-insensitivity
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.toLowerCase() > bValue.toLowerCase() ? direction : -direction;
    }
    // Handle other types if necessary, default to direct comparison
    return aValue > bValue ? direction : -direction;
  });

  const totalPages = Math.ceil(sortedTeachers.length / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedTeachers = sortedTeachers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = Number(e.target.value);
    if (newRecordsPerPage > 0) {
      setRecordsPerPage(newRecordsPerPage);
      setCurrentPage(1);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
      "On Leave": "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[status] || colors.Active;
  };

  // Extract departments from teacher data
  const departments = [...new Set(
    teachers.map(teacher => teacher.department).filter(Boolean)
  )].sort();

  // Extract subjects from teacher data (populated during registration)
  const subjects = [...new Set(
    teachers.map(teacher => teacher.specialization).filter(Boolean)
  )].sort();

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={loadTeachers}
            >
              Retry
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Teachers Management</h1>
            <p className="text-slate-600">Manage teacher profiles and information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                <TeacherForm 
                  onSubmit={handleAddTeacher}
                  onCancel={() => setShowAddDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, employee ID, or email..."
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Teachers {/* Changed trigger text */}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Filter Teachers</DialogTitle> {/* Changed dialog title */}
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Department Filter Section */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Department</h3>
                        {departments.length === 0 ? (
                          <p className="text-sm text-slate-500">No departments available. Please add teachers with departments.</p>
                        ) : (
                          <Select 
                            value={selectedDepartment} 
                            onValueChange={(value) => {
                              setSelectedDepartment(value);
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Departments</SelectItem>
                              {departments.map(department => (
                                <SelectItem key={department} value={department}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {department}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      {/* Subject Specialization Filter Section */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Subject Specialization</h3> {/* Changed label */}
                        {subjects.length === 0 ? (
                          <p className="text-sm text-slate-500">No subjects available. Please add teachers with subjects.</p>
                        ) : (
                          <Select 
                            value={selectedSubject} 
                            onValueChange={(value) => {
                              setSelectedSubject(value);
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subjects</SelectItem>
                              {subjects.map(subject => (
                                <SelectItem key={subject} value={subject} className="capitalize">
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedDepartment("all"); // Reset department filter
                            setSelectedSubject("all");
                            setCurrentPage(1);
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          onClick={() => setShowFilterDialog(false)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Teachers ({filteredTeachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Teacher Details
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead> {/* New table head for Department */}
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("department")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Department
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("designation")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Designation
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Status
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell> {/* Skeleton for new Department column */}
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4"> {/* Increased colspan */}
                        No teachers found matching the criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTeachers.map((teacher) => (
                      <TableRow key={teacher.id || `teacher-${Math.random()}`} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                              {teacher.user?.first_name?.charAt(0) || 'T'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{`${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() || 'N/A'}</p>
                              <p className="text-sm text-slate-500">{teacher.employee_id || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell> {/* New cell for Department */}
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="font-medium text-slate-900">{teacher.department || 'N/A'}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {teacher.specialization && (
                                  <Badge variant="outline" className="text-xs">
                                    {teacher.specialization}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Phone className="w-3 h-3" />
                              {teacher.user?.phone_number || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Mail className="w-3 h-3" />
                              {teacher.user?.email || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{teacher.designation || 'N/A'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(teacher.is_active ? 'Active' : 'Inactive')}>
                            {teacher.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTeacher(teacher)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTeacher(teacher)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={!teacher.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!loading && filteredTeachers.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="text-sm text-slate-600">Show</span>
                  <select
                    className="px-2 py-1 border rounded-lg bg-white text-sm"
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-600">records per page</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Teacher Details</DialogTitle>
            </DialogHeader>
            {selectedTeacher && <TeacherDetails teacher={selectedTeacher} />}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>
            {editingTeacher && (
              <TeacherForm 
                teacher={editingTeacher}
                onSubmit={handleEditTeacher}
                onCancel={() => setEditingTeacher(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
