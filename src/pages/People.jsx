
import React, { useState, useEffect, useMemo } from "react";
import { Student, Teacher, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, GraduationCap, UserCheck, Search, Plus, Upload, AlertTriangle, Phone, Mail, MessageSquare, MessageCircle, Filter, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BulkImportDialog from "../components/people/BulkImportDialog";
import DuplicateFinderDialog from "../components/people/DuplicateFinderDialog";
import GuardianHealthCard from "../components/people/GuardianHealthCard";
import AddPersonDialog from "../components/people/AddPersonDialog";
import LinkGuardianDialog from "../components/people/LinkGuardianDialog";
import GenerateIDCardsDialog from "../components/people/GenerateIDCardsDialog";
import GenerateCertificateDialog from "../components/people/GenerateCertificateDialog";
import StudentForm from "../components/students/StudentForm";
import UpgradeTierDialog from "../components/people/UpgradeTierDialog";

// Helper function to export data to CSV
const exportToCsv = (filename, rows) => {
    if (!rows || !rows.length) {
        return;
    }
    const separator = ',';
    // Dynamically get headers from the first row object keys
    const keys = Object.keys(rows[0]);
    
    // Create CSV header row
    const csvHeader = keys.join(separator);

    // Create CSV data rows
    const csvContent = rows.map(row => {
        return keys.map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            // Handle Date objects
            cell = cell instanceof Date
                ? cell.toLocaleString()
                : String(cell).replace(/"/g, '""'); // Convert to string and escape double quotes
            
            // If cell contains commas, double quotes, or newlines, enclose in double quotes
            if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
            }
            return cell;
        }).join(separator);
    }).join('\n');

    const fullCsv = csvHeader + '\n' + csvContent;

    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            document.body.removeChild(link);
            link.click();
        }
    }
};

const FilterPopover = ({ 
  tab, 
  onApply,
  filters,
  setters,
  uniqueValues,
}) => {
    const [tempStatus, setTempStatus] = useState('');
    const [tempGrade, setTempGrade] = useState('');
    const [tempSection, setTempSection] = useState('');
    const [tempChildrenCount, setTempChildrenCount] = useState('');
    const [tempSubject, setTempSubject] = useState('');
    const [tempRole, setTempRole] = useState('');

    useEffect(() => {
      if (tab === 'students') {
        setTempStatus(filters.studentFilterStatus);
        setTempGrade(filters.studentFilterGrade);
        setTempSection(filters.studentFilterSection);
      } else if (tab === 'parents') {
        setTempStatus(filters.parentFilterStatus);
        setTempChildrenCount(filters.parentFilterChildrenCount);
      } else if (tab === 'teachers') {
        setTempSubject(filters.teacherFilterSubject);
      } else if (tab === 'staff') {
        setTempRole(filters.staffFilterRole);
      }
    }, [tab, filters]);

    const handleApply = () => {
      if (tab === 'students') {
        setters.setStudentFilterStatus(tempStatus);
        setters.setStudentFilterGrade(tempGrade);
        setters.setStudentFilterSection(tempSection);
        setters.setStudentPage(1);
      } else if (tab === 'parents') {
        setters.setParentFilterStatus(tempStatus);
        setters.setParentFilterChildrenCount(tempChildrenCount);
        setters.setParentPage(1);
      } else if (tab === 'teachers') {
        setters.setTeacherFilterSubject(tempSubject);
        setters.setTeacherPage(1);
      } else if (tab === 'staff') {
        setters.setStaffFilterRole(tempRole);
        setters.setStaffPage(1);
      }
      onApply();
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-4">
            {tab === 'students' && (
              <>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={tempStatus} onValueChange={setTempStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Grade</label>
                  <Select value={tempGrade} onValueChange={setTempGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueValues.uniqueGrades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Section</label>
                  <Select value={tempSection} onValueChange={setTempSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueValues.uniqueSections.map(section => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {tab === 'parents' && (
              <>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={tempStatus} onValueChange={setTempStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Children Count</label>
                  <Select value={tempChildrenCount} onValueChange={setTempChildrenCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="single">Single Child</SelectItem>
                      <SelectItem value="double">Two Children</SelectItem>
                      <SelectItem value="multiple">More than Two</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {tab === 'teachers' && (
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select value={tempSubject} onValueChange={setTempSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueValues.uniqueSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {tab === 'staff' && (
              <>
                <div>
                  <label className="text-sm font-medium">Role/Designation</label>
                  <Select value={tempRole} onValueChange={setTempRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueValues.uniqueRoles?.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {uniqueValues.uniqueDepartments?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Select value={tempRole} onValueChange={setTempRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {uniqueValues.uniqueDepartments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            <Button onClick={handleApply}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
};

export default function People() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showDuplicateFinder, setShowDuplicateFinder] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('students');

  // New states for added functionality
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [showEditStudentDialog, setShowEditStudentDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showLinkGuardianDialog, setShowLinkGuardianDialog] = useState(false);
  const [linkingStudent, setLinkingStudent] = useState(null);
  const [showGenerateIDCardsDialog, setShowGenerateIDCardsDialog] = useState(false);
  const [idCardGenerationConfig, setIdCardGenerationConfig] = useState({ type: 'student', people: [] });
  const [showGenerateCertificateDialog, setShowGenerateCertificateDialog] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);


  // Filter and pagination states for students
  const [studentFilterStatus, setStudentFilterStatus] = useState('all');
  const [studentFilterGrade, setStudentFilterGrade] = useState('all');
  const [studentFilterSection, setStudentFilterSection] = useState('all');
  const [studentPage, setStudentPage] = useState(1);

  // Filter and pagination states for parents (guardians)
  const [parentFilterStatus, setParentFilterStatus] = useState('all');
  const [parentFilterChildrenCount, setParentFilterChildrenCount] = useState('all');
  const [parentPage, setParentPage] = useState(1);

  // Filter and pagination states for teachers
  const [teacherFilterSubject, setTeacherFilterSubject] = useState('all');
  const [teacherPage, setTeacherPage] = useState(1);

  // Filter and pagination states for staff
  const [staffFilterRole, setStaffFilterRole] = useState('all');
  const [staffPage, setStaffPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    // Delay the initial load to prevent conflicts
    const loadTimer = setTimeout(() => {
      loadData();
      findDuplicates();
    }, 1000);

    // Handle URL parameters for direct navigation from dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['students', 'parents', 'teachers', 'staff'].includes(tab)) {
      setActiveTab(tab);
    }

    return () => clearTimeout(loadTimer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsResponse, teachersResponse, staffResponse] = await Promise.all([
        Student.list().catch(() => ({ data: [] })),
        Teacher.list().catch(() => ({ data: [] })),
        User.list().catch(() => ({ data: [] }))
      ]);
      
      // Handle response format
      const studentsData = studentsResponse?.data?.results || studentsResponse?.data || [];
      const teachersData = teachersResponse?.data?.results || teachersResponse?.data || [];
      const staffData = staffResponse?.data?.results || staffResponse?.data || [];
      
      // Process students data to match display format
      const processedStudents = studentsData.map(student => ({
        ...student,
        name: student.user ? `${student.user.first_name} ${student.user.last_name}` : 'N/A',
        grade: student.current_section ? student.current_section.split('-')[0] || 'N/A' : 'N/A',
        section: student.current_section ? student.current_section.split('-')[1] || 'N/A' : 'N/A',
        status: student.is_active ? 'Active' : 'Inactive',
        phone: student.user?.phone_number || 'N/A',
        email: student.user?.email || 'N/A',
        admission_no: student.admission_no || 'N/A'
      }));
      
      // Process teachers data to match display format
      const processedTeachers = teachersData.map(teacher => ({
        ...teacher,
        name: teacher.user ? `${teacher.user.first_name} ${teacher.user.last_name}` : 'N/A',
        phone: teacher.user?.phone_number || 'N/A',
        email: teacher.user?.email || 'N/A',
        status: teacher.is_active ? 'Active' : 'Inactive',
        subject_specializations: teacher.specialization ? [teacher.specialization] : []
      }));
      
      // Filter staff from users (those with admin user_type)
      const processedStaff = staffData
        .filter(user => user.user_type === 'admin')
        .map(staff => ({
          ...staff,
          name: `${staff.first_name} ${staff.last_name}`,
          phone: staff.phone_number || 'N/A',
          status: 'Active', // Default for now
          employee_id: staff.employee_id || `EMP${staff.id}`,
          designation: staff.designation || 'Staff',
          department: staff.department || 'General'
        }));
      
      setStudents(processedStudents);
      setTeachers(processedTeachers);
      setStaff(processedStaff);
    } catch (error) {
      console.error("Error loading people data:", error);
      setStudents([]);
      setTeachers([]);
      setStaff([]);
    }
    setLoading(false);
  };

  const findDuplicates = async () => {
    try {
      // Add delay before finding duplicates
      await new Promise(resolve => setTimeout(resolve, 2000));
      const studentsData = await Student.list().catch(() => []);
      const potentialDuplicates = [];
      for (let i = 0; i < studentsData.length; i++) {
        for (let j = i + 1; j < studentsData.length; j++) {
          const student1 = studentsData[i];
          const student2 = studentsData[j];
          const nameSimilarity = student1.name?.toLowerCase() === student2.name?.toLowerCase();
          const phoneSimilarity = student1.parent_phone === student2.parent_phone;
          if (nameSimilarity || phoneSimilarity) {
            potentialDuplicates.push({
              id: `dup-${i}-${j}`,
              student1,
              student2,
              reason: nameSimilarity && phoneSimilarity ? 'Same name and parent phone' : nameSimilarity ? 'Same name' : 'Same parent phone',
              confidence: nameSimilarity && phoneSimilarity ? 'High' : 'Medium'
            });
          }
        }
      }
      setDuplicates(potentialDuplicates);
    } catch (error) {
      console.error("Error finding duplicates:", error);
    }
  };

  const handleAddPerson = async (data, type) => {
    try {
      if (type === 'student') {
        await Student.create(data);
      } else if (type === 'teacher') {
        await Teacher.create(data);
      } else if (type === 'staff') {
        // For staff, we create a User with admin type and staff role
        const staffData = {
          ...data,
          password: 'defaultpassword123', // You might want to generate this or ask user
          password_confirm: 'defaultpassword123'
        };
        await User.create(staffData);
      }
      setShowAddPersonDialog(false);
      loadData(); // Reload data after adding
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to add ${type}: ${errorMessage}. Please check the form data and try again.`);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowEditStudentDialog(true);
  };
  
  const handleUpdateStudent = async (data) => {
    if (!editingStudent) return;
    try {
      await Student.update(editingStudent.id, data);
      setEditingStudent(null);
      setShowEditStudentDialog(false);
      loadData(); // Reload data after updating
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleLinkGuardianClick = (student) => {
    setLinkingStudent(student);
    setShowLinkGuardianDialog(true);
  };

  const handleLinkGuardian = async (studentId, guardianData) => {
    try {
      await Student.update(studentId, guardianData); // Assuming update supports linking guardian data
      setShowLinkGuardianDialog(false);
      loadData(); // Reload data after linking
    } catch(error) {
      console.error("Error linking guardian:", error);
    }
  };

  const handleExportStudentsCsv = () => {
    // Only export visible columns with cleaned data for CSV
    const studentsToExport = filteredStudents.map(s => ({
        id: s.id,
        name: s.name,
        admission_no: s.admission_no,
        grade: s.grade,
        section: s.section,
        parent_name: s.parent_name,
        parent_phone: s.parent_phone,
        parent_email: s.parent_email,
        status: s.status,
    }));
    exportToCsv('students.csv', studentsToExport);
  };
  
  const handleExportParentsCsv = () => {
    const parentsToExport = filteredParents.map(p => ({
        parent_name: p.parent_name,
        parent_phone: p.parent_phone,
        parent_email: p.parent_email,
        children_count: p.children_count,
        children_names: p.children_names,
    }));
    exportToCsv('parents.csv', parentsToExport);
  };

  const handleExportTeachersCsv = () => {
    const teachersToExport = filteredTeachers.map(t => ({
        employee_id: t.employee_id,
        name: t.name,
        subjects: t.subject_specializations?.join(', '),
        contact: t.phone,
        status: t.status,
    }));
    exportToCsv('teachers.csv', teachersToExport);
  };

  const handleExportStaffCsv = () => {
    const staffToExport = filteredStaff.map(s => ({
        employee_id: s.employee_id,
        name: s.name,
        role: s.role,
        contact: s.phone,
        status: s.status,
    }));
    exportToCsv('staff.csv', staffToExport);
  };

  const handleGenerateIdCards = (type) => {
    let selectedPeople = [];
    if (type === 'student') {
        selectedPeople = students.filter(s => selectedStudentIds.includes(s.id));
    } else if (type === 'teacher') {
        selectedPeople = teachers.filter(t => selectedTeacherIds.includes(t.id));
    } else if (type === 'staff') {
        selectedPeople = staff.filter(s => selectedStaffIds.includes(s.id));
    }
    
    if (selectedPeople.length === 0) {
      alert(`Please select at least one ${type} to generate ID cards.`);
      return;
    }
    setIdCardGenerationConfig({ type, people: selectedPeople });
    setShowGenerateIDCardsDialog(true);
  };
  
  const handleSelectStudent = (studentId, checked) => {
    setSelectedStudentIds(prev => 
      checked ? [...prev, studentId] : prev.filter(id => id !== studentId)
    );
  };

  const handleSelectAllStudents = (checked) => {
    setSelectedStudentIds(checked ? paginatedStudents.map(s => s.id) : []);
  };

  const handleSelectTeacher = (teacherId, checked) => {
    setSelectedTeacherIds(prev =>
      checked ? [...prev, teacherId] : prev.filter(id => id !== teacherId)
    );
  };

  const handleSelectAllTeachers = (checked) => {
    setSelectedTeacherIds(checked ? paginatedTeachers.map(t => t.id) : []);
  };

  const handleSelectStaff = (staffId, checked) => {
    setSelectedStaffIds(prev =>
      checked ? [...prev, staffId] : prev.filter(id => id !== staffId)
    );
  };

  const handleSelectAllStaff = (checked) => {
    setSelectedStaffIds(checked ? paginatedStaff.map(s => s.id) : []);
  };
  
  const selectedStudentsForCerts = useMemo(() => 
    students.filter(s => selectedStudentIds.includes(s.id)), 
    [selectedStudentIds, students]
  );

  // Students unique values
  const uniqueGrades = useMemo(() => {
    const grades = [...new Set(students.map(s => s.grade).filter(g => g && g !== 'N/A'))];
    return grades.sort((a, b) => {
      if (a === 'Kindergarten') return -1;
      if (b === 'Kindergarten') return 1;
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [students]);
  
  const uniqueSections = useMemo(() => {
    return [...new Set(students.map(s => s.section).filter(s => s && s !== 'N/A'))].sort();
  }, [students]);

  // Teachers unique subjects
  const uniqueSubjects = useMemo(() => {
    return [...new Set(teachers.flatMap(t => t.subject_specializations || []).filter(s => s))].sort();
  }, [teachers]);

  // Staff unique roles and departments
  const uniqueRoles = useMemo(() => {
    return [...new Set(staff.map(s => s.designation).filter(r => r))].sort();
  }, [staff]);
  
  const uniqueDepartments = useMemo(() => {
    return [...new Set(staff.map(s => s.department).filter(d => d))].sort();
  }, [staff]);

  // Students filtering, pagination
  const filteredStudents = students.filter(s => 
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (studentFilterStatus === 'all' || s.status?.toLowerCase() === studentFilterStatus) &&
    (studentFilterGrade === 'all' || s.grade === studentFilterGrade) &&
    (studentFilterSection === 'all' || s.section === studentFilterSection)
  );
  const studentTotalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage);

  // Parents (guardians) filtering, pagination - properly map from student data
  const searchedParents = students.filter(s => 
    s.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parent_phone?.includes(searchTerm.toLowerCase()) ||
    s.parent_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group students by parent using phone and email as unique identifiers
  const parentGroups = {};
  searchedParents.forEach(student => {
    if (student.parent_name || student.parent_phone || student.parent_email) {
      // Create a unique key for each parent based on phone and email
      const key = `${student.parent_phone || 'no_phone'}-${student.parent_email || 'no_email'}-${student.parent_name || 'no_name'}`;
      if (!parentGroups[key]) {
        parentGroups[key] = {
          parent_name: student.parent_name,
          parent_phone: student.parent_phone,
          parent_email: student.parent_email,
          children: []
        };
      }
      parentGroups[key].children.push(student);
    }
  });
  
  // Transform parentGroups into an array of parent objects for filtering and display
  const parentList = Object.values(parentGroups).map(parentGroup => {
    return {
      id: `${parentGroup.parent_phone || ''}-${parentGroup.parent_email || ''}-${parentGroup.parent_name || ''}`,
      parent_name: parentGroup.parent_name || 'N/A',
      parent_phone: parentGroup.parent_phone || 'N/A',
      parent_email: parentGroup.parent_email || 'N/A',
      children_count: parentGroup.children.length,
      children_names: parentGroup.children.map(c => c.name).join(', '),
      children_grades: parentGroup.children.map(c => `${c.name} (${c.grade}-${c.section})`).join(', '),
      status: (parentGroup.parent_email && parentGroup.parent_phone && parentGroup.parent_email !== 'N/A' && parentGroup.parent_phone !== 'N/A') ? 'active' : 'inactive'
    };
  });

  const filteredParents = parentList.filter(parent => {
    const statusMatch = parentFilterStatus === 'all' || parentFilterStatus === parent.status;
    let countMatch = true;
    if (parentFilterChildrenCount === 'single') countMatch = parent.children_count === 1;
    else if (parentFilterChildrenCount === 'double') countMatch = parent.children_count === 2;
    else if (parentFilterChildrenCount === 'multiple') countMatch = parent.children_count > 2;
    return statusMatch && countMatch;
  });

  const parentTotalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const paginatedParents = filteredParents.slice((parentPage - 1) * itemsPerPage, parentPage * itemsPerPage);


  // Teachers filtering, pagination
  const filteredTeachers = teachers.filter(t => 
    (t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (teacherFilterSubject === 'all' || t.subject_specializations?.includes(teacherFilterSubject))
  );
  const teacherTotalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice((teacherPage - 1) * itemsPerPage, teacherPage * itemsPerPage);

  // Staff filtering, pagination
  const filteredStaff = staff.filter(s => 
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (staffFilterRole === 'all' || s.designation === staffFilterRole || s.department === staffFilterRole)
  );
  const staffTotalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice((staffPage - 1) * itemsPerPage, staffPage * itemsPerPage);

  const guardianStats = {
    total: students.length,
    verified: students.filter(s => s.parent_email && s.parent_phone).length,
    unverified: students.filter(s => !s.parent_email || !s.parent_phone).length,
    optedOut: Math.floor(students.length * 0.02)
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">People Management</h1>
              <p className="text-slate-600">Manage students, teachers, parents, and staff records</p>
            </div>
          </div>

          {duplicates.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Found {duplicates.length} potential duplicate records. 
                <Button variant="link" className="p-0 ml-2" onClick={() => setShowDuplicateFinder(true)}>
                  Review now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <GuardianHealthCard stats={guardianStats} />

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search people by name, ID, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto h-auto">
              <TabsTrigger value="students" className="flex-col sm:flex-row gap-1 sm:gap-2 p-2 sm:p-3">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Students ({students.length})</span>
              </TabsTrigger>
              <TabsTrigger value="parents" className="flex-col sm:flex-row gap-1 sm:gap-2 p-2 sm:p-3">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Parents ({filteredParents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex-col sm:flex-row gap-1 sm:gap-2 p-2 sm:p-3">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Teachers ({teachers.length})</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex-col sm:flex-row gap-1 sm:gap-2 p-2 sm:p-3">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Staff ({staff.length})</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowDuplicateFinder(true)} className="flex-1 sm:flex-none">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Find Duplicates</span>
                <span className="sm:hidden">Duplicates</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowBulkImport(true)} className="flex-1 sm:flex-none">
                <Upload className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Bulk Import</span>
                <span className="sm:hidden">Import</span>
              </Button>
              <Button size="sm" onClick={() => setShowAddPersonDialog(true)} className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Person</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <CardTitle className="text-lg md:text-xl">Students Directory</CardTitle>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                            if (selectedStudentIds.length === 0) {
                                alert("Please select at least one student to generate a certificate.");
                                return;
                            }
                            setShowGenerateCertificateDialog(true);
                        }}
                        className="flex-1 sm:flex-none"
                    >
                        <Award className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Generate Certificate</span>
                        <span className="sm:hidden">Certificate</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleGenerateIdCards('student')} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Generate ID Cards</span>
                        <span className="sm:hidden">ID Cards</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportStudentsCsv} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </Button>
                    <FilterPopover 
                      tab="students" 
                      onApply={() => {}}
                      filters={{ studentFilterStatus, studentFilterGrade, studentFilterSection }}
                      setters={{ setStudentFilterStatus, setStudentFilterGrade, setStudentFilterSection, setStudentPage }}
                      uniqueValues={{ uniqueGrades, uniqueSections }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={paginatedStudents.length > 0 && selectedStudentIds.length === paginatedStudents.length}
                              onCheckedChange={handleSelectAllStudents}
                            />
                          </TableHead>
                          <TableHead className="min-w-[150px]">Student</TableHead>
                          <TableHead className="min-w-[120px] hidden sm:table-cell">Class & Section</TableHead>
                          <TableHead className="min-w-[140px] hidden md:table-cell">Parent Contact</TableHead>
                          <TableHead className="min-w-[120px] hidden lg:table-cell">Guardian Status</TableHead>
                          <TableHead className="min-w-[80px]">Status</TableHead>
                          <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedStudents.map(student => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedStudentIds.includes(student.id)}
                                onCheckedChange={(checked) => handleSelectStudent(student.id, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm md:text-base">{student.name}</p>
                                <p className="text-xs md:text-sm text-slate-500">{student.admission_no}</p>
                                <div className="sm:hidden mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {student.grade === 'Kindergarten' ? 'Kindergarten' : `Grade ${student.grade}`} - {student.section}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-sm">{student.grade === 'Kindergarten' ? 'Kindergarten' : `Grade ${student.grade}`} - {student.section}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>
                                <p className="text-sm">{student.parent_phone}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[120px]">{student.parent_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge className={student.parent_email && student.parent_phone 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"}>
                                {student.parent_email && student.parent_phone ? 'Verified' : 'Incomplete'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 text-xs">{student.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleLinkGuardianClick(student)} className="text-xs px-2">
                                  <span className="hidden sm:inline">Link Guardian</span>
                                  <span className="sm:hidden">Link</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEditStudent(student)} className="text-xs px-2">Edit</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
                <Pagination currentPage={studentPage} totalPages={studentTotalPages} onPageChange={setStudentPage} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parents Tab */}
          <TabsContent value="parents" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <CardTitle className="text-lg md:text-xl">Parents & Guardians Directory</CardTitle>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handleExportParentsCsv} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </Button>
                    <FilterPopover 
                      tab="parents" 
                      onApply={() => {}}
                      filters={{ parentFilterStatus, parentFilterChildrenCount }}
                      setters={{ setParentFilterStatus, setParentFilterChildrenCount, setParentPage }}
                      uniqueValues={{}}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Guardian Name</TableHead>
                          <TableHead className="min-w-[200px] hidden sm:table-cell">Children</TableHead>
                          <TableHead className="min-w-[140px] hidden md:table-cell">Contact</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedParents.map(parent => (
                          <TableRow key={parent.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm md:text-base">{parent.parent_name || 'N/A'}</p>
                                <p className="text-xs md:text-sm text-slate-500">{parent.children_count} {parent.children_count === 1 ? 'child' : 'children'}</p>
                                <div className="sm:hidden mt-1 text-xs text-slate-600 truncate max-w-[150px]">
                                  {parent.children_names}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <p className="text-sm text-slate-600">{parent.children_names}</p>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-500">{parent.parent_phone || 'N/A'}</span>
                                <span className="text-xs text-slate-500 truncate max-w-[120px]">{parent.parent_email || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={parent.parent_email ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                <span className="hidden sm:inline">{parent.parent_email ? 'Communication OK' : 'No Email'}</span>
                                <span className="sm:hidden">{parent.parent_email ? 'OK' : 'No Email'}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-xs">Contact</Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Contact {parent.parent_name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {parent.parent_phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-slate-600" />
                                            <a href={`tel:${parent.parent_phone}`} className="text-blue-600 hover:underline">
                                                Call: {parent.parent_phone}
                                            </a>
                                        </div>
                                    )}
                                    {parent.parent_phone && (
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-slate-600" />
                                            <a href={`sms:${parent.parent_phone}`} className="text-blue-600 hover:underline">
                                                Send SMS
                                            </a>
                                        </div>
                                    )}
                                    {parent.parent_phone && (
                                        <div className="flex items-center gap-3">
                                            <MessageCircle className="w-5 h-5 text-slate-600" />
                                            <a href={`https://wa.me/${parent.parent_phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                                WhatsApp
                                            </a>
                                        </div>
                                    )}
                                    {parent.parent_email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-slate-600" />
                                            <a href={`mailto:${parent.parent_email}`} className="text-blue-600 hover:underline break-all">
                                                {parent.parent_email}
                                            </a>
                                        </div>
                                    )}
                                    {!parent.parent_phone && !parent.parent_email && (
                                        <p className="text-sm text-slate-500">No contact information available.</p>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
                <Pagination currentPage={parentPage} totalPages={parentTotalPages} onPageChange={setParentPage} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <CardTitle className="text-lg md:text-xl">Teachers Directory</CardTitle>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                     <Button variant="outline" size="sm" onClick={() => handleGenerateIdCards('teacher')} className="flex-1 sm:flex-none">
                         <span className="hidden sm:inline">Generate ID Cards</span>
                         <span className="sm:hidden">ID Cards</span>
                     </Button>
                    <Button variant="outline" size="sm" onClick={handleExportTeachersCsv} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </Button>
                    <FilterPopover 
                      tab="teachers" 
                      onApply={() => {}}
                      filters={{ teacherFilterSubject }}
                      setters={{ setTeacherFilterSubject, setTeacherPage }}
                      uniqueValues={{ uniqueSubjects }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                 <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                           <TableHead className="w-12">
                            <Checkbox
                              checked={paginatedTeachers.length > 0 && selectedTeacherIds.length === paginatedTeachers.length}
                              onCheckedChange={handleSelectAllTeachers}
                            />
                          </TableHead>
                          <TableHead className="min-w-[150px]">Teacher</TableHead>
                          <TableHead className="min-w-[120px] hidden sm:table-cell">Subjects</TableHead>
                          <TableHead className="min-w-[120px] hidden md:table-cell">Contact</TableHead>
                          <TableHead className="min-w-[80px]">Status</TableHead>
                          <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTeachers.map(teacher => (
                          <TableRow key={teacher.id}>
                             <TableCell>
                              <Checkbox
                                checked={selectedTeacherIds.includes(teacher.id)}
                                onCheckedChange={(checked) => handleSelectTeacher(teacher.id, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm md:text-base">{teacher.name}</p>
                                <p className="text-xs md:text-sm text-slate-500">{teacher.employee_id}</p>
                                <div className="sm:hidden mt-1 flex gap-1 flex-wrap">
                                  {teacher.subject_specializations?.slice(0, 2).map(subject => (
                                    <Badge key={subject} variant="outline" className="text-xs">{subject}</Badge>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex gap-1 flex-wrap">
                                {teacher.subject_specializations?.slice(0, 2).map(subject => (
                                  <Badge key={subject} variant="outline" className="text-xs">{subject}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">{teacher.phone}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 text-xs">{teacher.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <span className="hidden sm:inline">View Profile</span>
                                    <span className="sm:hidden">View</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>{teacher.name}'s Profile</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p><strong>ID:</strong> {teacher.employee_id}</p>
                                    <p><strong>Status:</strong> {teacher.status}</p>
                                    <p><strong>Subjects:</strong> {teacher.subject_specializations?.join(", ")}</p>
                                    <div className="flex items-center gap-3">
                                      <Phone className="w-5 h-5 text-slate-600" />
                                      <a href={`tel:${teacher.phone}`} className="text-blue-600 hover:underline">
                                        Call: {teacher.phone}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <MessageSquare className="w-5 h-5 text-slate-600" />
                                      <a href={`sms:${teacher.phone}`} className="text-blue-600 hover:underline">
                                        Send SMS
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <MessageCircle className="w-5 h-5 text-slate-600" />
                                      <a href={`https://wa.me/${teacher.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                        WhatsApp
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="w-5 h-5 text-slate-600" />
                                      <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:underline break-all">
                                        {teacher.email}
                                      </a>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
                <Pagination currentPage={teacherPage} totalPages={teacherTotalPages} onPageChange={setTeacherPage} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <CardTitle className="text-lg md:text-xl">Staff Directory</CardTitle>
                   <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateIdCards('staff')} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Generate ID Cards</span>
                        <span className="sm:hidden">ID Cards</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportStaffCsv} className="flex-1 sm:flex-none">
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </Button>
                    <FilterPopover 
                      tab="staff" 
                      onApply={() => {}}
                      filters={{ staffFilterRole }}
                      setters={{ setStaffFilterRole, setStaffPage }}
                      uniqueValues={{ uniqueRoles, uniqueDepartments }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={paginatedStaff.length > 0 && selectedStaffIds.length === paginatedStaff.length}
                              onCheckedChange={handleSelectAllStaff}
                            />
                          </TableHead>
                          <TableHead className="min-w-[150px]">Staff</TableHead>
                          <TableHead className="min-w-[100px] hidden sm:table-cell">Role</TableHead>
                          <TableHead className="min-w-[120px] hidden md:table-cell">Contact</TableHead>
                          <TableHead className="min-w-[80px]">Status</TableHead>
                          <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedStaff.map(s => (
                          <TableRow key={s.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedStaffIds.includes(s.id)}
                                onCheckedChange={(checked) => handleSelectStaff(s.id, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm md:text-base">{s.name}</p>
                                <p className="text-xs md:text-sm text-slate-500">{s.employee_id}</p>
                                <div className="sm:hidden mt-1">
                                  <Badge variant="outline" className="text-xs">{s.role}</Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-sm">{s.role}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">{s.phone}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 text-xs">{s.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
                <Pagination currentPage={staffPage} totalPages={staffTotalPages} onPageChange={setStaffPage} />
                <div className="mt-4 text-center">
                  <UserCheck className="w-16 h-16 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-slate-600 mb-4">Staff management module is available in standard tier as well.</p>
                  <Button variant="default" size="sm" onClick={() => setShowUpgradeDialog(true)}>Upgrade to Standard Tier</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Bulk Import Dialog */}
        <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
          <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Bulk Import People</DialogTitle>
              <DialogDescription>
                Import multiple records at once using a CSV file.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[70vh] px-1">
              <BulkImportDialog open={true} onOpenChange={() => {}} embedded={true} />
            </div>
          </DialogContent>
        </Dialog>

        <DuplicateFinderDialog 
          open={showDuplicateFinder} 
          onOpenChange={setShowDuplicateFinder}
          duplicates={duplicates}
          onMerge={() => {
            findDuplicates();
          }}
        />
        <AddPersonDialog 
          open={showAddPersonDialog}
          onOpenChange={setShowAddPersonDialog}
          onAdd={handleAddPerson}
        />
        {editingStudent && (
          <Dialog open={showEditStudentDialog} onOpenChange={setShowEditStudentDialog}>
            <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Student: {editingStudent.name}</DialogTitle>
              </DialogHeader>
              <StudentForm 
                student={editingStudent}
                onSubmit={handleUpdateStudent}
                onCancel={() => setShowEditStudentDialog(false)}
                classes={uniqueGrades.map(g => ({id: g, name: g}))} 
                sections={uniqueSections.map(s => ({id: s, name: s, class_id: editingStudent.grade}))}
              />
            </DialogContent>
          </Dialog>
        )}
        {linkingStudent && (
          <LinkGuardianDialog
            open={showLinkGuardianDialog}
            onOpenChange={setShowLinkGuardianDialog}
            student={linkingStudent}
            allStudents={students}
            onLink={handleLinkGuardian}
          />
        )}
        <GenerateIDCardsDialog 
          open={showGenerateIDCardsDialog}
          onOpenChange={setShowGenerateIDCardsDialog}
          selectedPeople={idCardGenerationConfig.people}
          type={idCardGenerationConfig.type}
        />
        <GenerateCertificateDialog
            open={showGenerateCertificateDialog}
            onOpenChange={setShowGenerateCertificateDialog}
            selectedStudents={selectedStudentsForCerts}
        />
        <UpgradeTierDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
        />
      </div>
    </div>
  );
}
