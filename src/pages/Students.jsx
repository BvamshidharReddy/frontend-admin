import React, { useState, useEffect } from "react";
import { Student, Class, Section } from "@/api/entities";
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
  Upload, 
  Users, 
  Phone, 
  Mail,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import StudentForm from "../components/students/StudentForm";
import StudentDetails from "../components/students/StudentDetails";
import BulkImport from "../components/students/BulkImport";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(["Active", "Inactive"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsResponse, classesResponse, sectionsResponse] = await Promise.all([
        Student.list(),
        Class.list(),
        Section.list()
      ]);
      
      // Handle paginated response format
      const studentsData = studentsResponse?.data?.results || studentsResponse?.results || studentsResponse?.data || studentsResponse;
      const classesData = classesResponse?.data?.results || classesResponse?.results || classesResponse?.data || classesResponse;
      const sectionsData = sectionsResponse?.data?.results || sectionsResponse?.results || sectionsResponse?.data || sectionsResponse;
      
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
    } catch (error) {
      console.error("Error loading students:", error);
    }
    setLoading(false);
  };

  const handleAddStudent = async (studentData) => {
    try {
      await Student.create(studentData);
      setShowAddDialog(false);
      loadData();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleEditStudent = async (studentData) => {
    try {
      await Student.update(editingStudent.id, studentData);
      setEditingStudent(null);
      loadData();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await Student.delete(studentId);
        loadData();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const getClassSectionName = (classId, sectionId) => {
    const classObj = classes.find(c => c.id === classId);
    const sectionObj = sections.find(s => s.id === sectionId);
    return `${classObj?.name || ""} - ${sectionObj?.name || ""}`;
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admission_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || student.class_id === selectedClass;
    const matchesStatus = selectedStatuses.includes(student.status);
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when records per page changes
  };

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
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Students Management</h1>
            <p className="text-slate-600">Manage student records and information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Import Students</DialogTitle>
                </DialogHeader>
                <BulkImport onComplete={() => { setShowBulkImport(false); loadData(); }} />
              </DialogContent>
            </Dialog>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <StudentForm 
                  classes={classes}
                  sections={sections}
                  onSubmit={handleAddStudent}
                  onCancel={() => setShowAddDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, admission number, or roll number..."
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select 
                  className="px-3 py-2 border rounded-lg bg-white text-sm"
                  value={selectedClass}
                  onChange={(e) => {setSelectedClass(e.target.value); setCurrentPage(1);}}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Filter Students</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <h3 className="text-sm font-medium">Status</h3>
                      <div className="space-y-2">
                        {["Active", "Inactive"].map(status => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() => handleStatusFilterChange(status)}
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="text-sm font-medium leading-none"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {setSelectedStatuses(["Active", "Inactive"]); setCurrentPage(1);}}
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

        {/* Students Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Student Details</TableHead>
                    <TableHead>Class & Section</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    paginatedStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {student.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{student.name}</p>
                              <p className="text-sm text-slate-500">
                                {student.admission_no} • Roll: {student.roll_no}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {getClassSectionName(student.class_id, student.section_id)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {student.phone && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Phone className="w-3 h-3" />
                                {student.phone}
                              </div>
                            )}
                            {student.email && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Mail className="w-3 h-3" />
                                {student.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(student.status)}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStudent(student)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-700"
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
            {/* Pagination Controls */}
            {!loading && filteredStudents.length > 0 && (
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

        {/* Student Details Dialog */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <StudentDetails 
                student={selectedStudent}
                classes={classes}
                sections={sections}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <StudentForm 
                student={editingStudent}
                classes={classes}
                sections={sections}
                onSubmit={handleEditStudent}
                onCancel={() => setEditingStudent(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}