import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Crown, Edit, Eye, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialEmployees = [
  { id: 1, name: 'Dr. Sarah Johnson', position: 'Principal', department: 'Administration', salary: 95000, status: 'Active', joinDate: '2020-01-15' },
  { id: 2, name: 'Mr. Raj Patel', position: 'Math Teacher', department: 'Mathematics', salary: 65000, status: 'Active', joinDate: '2021-03-10' },
  { id: 3, name: 'Ms. Priya Singh', position: 'English Teacher', department: 'English', salary: 62000, status: 'Active', joinDate: '2021-07-22' },
  { id: 4, name: 'Mr. John Smith', position: 'Lab Assistant', department: 'Science', salary: 35000, status: 'Active', joinDate: '2022-01-05' },
];

export default function HR() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    status: 'Active',
    joinDate: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.position || !newEmployeeData.department) {
      alert("Name, Position, and Department are required.");
      return;
    }
    const newEmployee = {
      id: employees.length + 1,
      ...newEmployeeData,
      salary: parseFloat(newEmployeeData.salary) || 0,
    };
    setEmployees([...employees, newEmployee]);
    setNewEmployeeData({ name: '', position: '', department: '', salary: '', status: 'Active', joinDate: '' });
    setIsAddEmployeeOpen(false);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee.name || !editingEmployee.position || !editingEmployee.department) {
      alert("Name, Position, and Department are required.");
      return;
    }
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id 
        ? { ...editingEmployee, salary: parseFloat(editingEmployee.salary) || 0 }
        : emp
    ));
    setIsEditEmployeeOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              HR & Payroll
              <Badge className="bg-purple-100 text-purple-800">
                <Crown className="w-3 h-3 mr-1" />
                Standard
              </Badge>
            </h1>
            <p className="text-slate-600">Manage employee records, payroll, and performance tracking.</p>
          </div>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="empName">Employee Name</Label>
                  <Input id="empName" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})} placeholder="Full name"/>
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" value={newEmployeeData.position} onChange={(e) => setNewEmployeeData({...newEmployeeData, position: e.target.value})} placeholder="Job title"/>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newEmployeeData.department} onValueChange={(value) => setNewEmployeeData({...newEmployeeData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Support Staff">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Annual Salary</Label>
                  <Input id="salary" type="number" value={newEmployeeData.salary} onChange={(e) => setNewEmployeeData({...newEmployeeData, salary: e.target.value})} placeholder="Annual salary"/>
                </div>
                <div>
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input id="joinDate" type="date" value={newEmployeeData.joinDate} onChange={(e) => setNewEmployeeData({...newEmployeeData, joinDate: e.target.value})}/>
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>Cancel</Button>
                   <Button onClick={handleAddEmployee}>Add Employee</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-sm text-slate-600">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Total Payroll</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-slate-600">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-yellow-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{employees.filter(emp => emp.status === 'Active').length}</p>
                  <p className="text-sm text-slate-600">Active Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map(employee => (
                <Card key={employee.id} className="p-4 hover:bg-slate-50 transition-colors border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                        <p className="text-sm text-slate-600">{employee.position} • {employee.department}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className="bg-green-100 text-green-800">₹{employee.salary.toLocaleString()}/year</Badge>
                          <Badge className={employee.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                            {employee.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditClick(employee)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Edit Details</span>
                        <span className="sm:hidden">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">View Profile</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee Details</DialogTitle>
            </DialogHeader>
            {editingEmployee && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="editName">Employee Name</Label>
                  <Input 
                    id="editName" 
                    value={editingEmployee.name} 
                    onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})} 
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="editPosition">Position</Label>
                  <Input 
                    id="editPosition" 
                    value={editingEmployee.position} 
                    onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})} 
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <Label htmlFor="editDepartment">Department</Label>
                  <Select 
                    value={editingEmployee.department} 
                    onValueChange={(value) => setEditingEmployee({...editingEmployee, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Support Staff">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editSalary">Annual Salary</Label>
                  <Input 
                    id="editSalary" 
                    type="number" 
                    value={editingEmployee.salary} 
                    onChange={(e) => setEditingEmployee({...editingEmployee, salary: e.target.value})} 
                    placeholder="Annual salary"
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select 
                    value={editingEmployee.status} 
                    onValueChange={(value) => setEditingEmployee({...editingEmployee, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editJoinDate">Join Date</Label>
                  <Input 
                    id="editJoinDate" 
                    type="date" 
                    value={editingEmployee.joinDate} 
                    onChange={(e) => setEditingEmployee({...editingEmployee, joinDate: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>Cancel</Button>
                   <Button onClick={handleUpdateEmployee}>Update Employee</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}