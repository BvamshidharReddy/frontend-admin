import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, User, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function SalaryDuesPopup({ open, onOpenChange, dueCount }) {
  // Mock salary dues data
  const salaryDues = [
    {
      id: 1,
      employee_id: "T001",
      name: "Dr. Sarah Johnson",
      role: "Principal",
      salary: 85000,
      dueDate: "2024-01-31",
      status: "Pending",
      department: "Administration"
    },
    {
      id: 2,
      employee_id: "T002", 
      name: "Mr. David Wilson",
      role: "Math Teacher",
      salary: 65000,
      dueDate: "2024-01-31",
      status: "Overdue",
      department: "Mathematics"
    },
    {
      id: 3,
      employee_id: "S001",
      name: "Ms. Lisa Chen",
      role: "Librarian",
      salary: 45000,
      dueDate: "2024-02-05",
      status: "Pending",
      department: "Library"
    }
  ].slice(0, dueCount);

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Overdue: "bg-red-100 text-red-800",
      Paid: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const totalDueAmount = salaryDues.reduce((sum, salary) => sum + salary.salary, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Salary Dues
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Summary Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{salaryDues.length}</p>
                  <p className="text-sm text-slate-600">Pending Salaries</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">₹{(totalDueAmount / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-slate-600">Total Due Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Dues List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Salary Due Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {salaryDues.map((salary) => (
                  <div key={salary.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{salary.name}</p>
                        <p className="text-sm text-slate-600">{salary.role} • {salary.department}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Due: {format(new Date(salary.dueDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{(salary.salary / 1000).toFixed(0)}K</p>
                      <Badge className={getStatusBadge(salary.status)}>
                        {salary.status === 'Overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {salary.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {salaryDues.length === 0 && (
                <p className="text-slate-500 text-sm py-8 text-center">No pending salary dues</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}