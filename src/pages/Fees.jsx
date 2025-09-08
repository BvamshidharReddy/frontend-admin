import React, { useState, useEffect } from 'react';
import { Fee, Student, Class } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, DollarSign, Receipt, Search, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FeeForm from "../components/fees/FeeForm";
import PaymentForm from '../components/fees/PaymentForm';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [payingFee, setPayingFee] = useState(null);
  
  // Search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feesResponse, studentsResponse, classesResponse] = await Promise.all([
        Fee.list("-due_date").catch(() => ({ data: [] })),
        Student.list().catch(() => ({ data: [] })),
        Class.list().catch(() => ({ data: [] })),
      ]);
      setFees(feesResponse?.data || feesResponse || []);
      setStudents(studentsResponse?.data || studentsResponse || []);
      setClasses(classesResponse?.data || classesResponse || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setFees([]);
      setStudents([]);
      setClasses([]);
    }
    setLoading(false);
  };

  const handleAddFee = async (feeData) => {
    try {
      const finalAmount = feeData.amount - (feeData.amount * (feeData.discount_percent || 0) / 100);
      await Fee.create({ ...feeData, final_amount: finalAmount });
      setShowFeeDialog(false);
      await loadData();
    } catch (error) {
      console.error("Error creating fee:", error);
      // Show error message to user
    }
  };
  
  const handleRecordPayment = async (paymentData) => {
    try {
      await Fee.update(payingFee.id, {
          status: 'Paid',
          payment_date: paymentData.payment_date,
          payment_method: paymentData.payment_method,
          transaction_ref: paymentData.transaction_ref,
          receipt_no: paymentData.receipt_no
      });
      setPayingFee(null);
      await loadData();
    } catch (error) {
      console.error("Error updating fee payment:", error);
      // Show error message to user
    }
  };
  
  const getStudentInfo = (id) => students.find(s => s.id === id) || {};
  
  const getStatusBadge = (status) => {
    const colors = {
        Pending: "bg-yellow-100 text-yellow-800",
        Paid: "bg-green-100 text-green-800",
        Overdue: "bg-red-100 text-red-800",
        'Partially Paid': "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Filter and search logic
  const filteredFees = fees.filter(fee => {
    const student = getStudentInfo(fee.student_id);
    const searchMatch = searchTerm === '' || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || fee.status === statusFilter;
    const classMatch = classFilter === 'all' || student.class_id === classFilter;
    const sectionMatch = sectionFilter === 'all' || student.section_id === sectionFilter;
    
    return searchMatch && statusMatch && classMatch && sectionMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFees.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedFees = filteredFees.slice(startIndex, startIndex + recordsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, classFilter, sectionFilter]);

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredFees.map(fee => {
      const student = getStudentInfo(fee.student_id);
      return {
        'Student Name': student.name || 'N/A',
        'Admission No': student.admission_no || 'N/A',
        'Roll No': student.roll_no || 'N/A',
        'Fee Head': fee.fee_head,
        'Amount': fee.amount,
        'Final Amount': fee.final_amount,
        'Due Date': fee.due_date,
        'Status': fee.status,
        'Payment Date': fee.payment_date || 'N/A',
        'Payment Method': fee.payment_method || 'N/A',
        'Transaction Ref': fee.transaction_ref || 'N/A'
      };
    });

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get unique sections for selected class
  const sectionsForClass = classFilter === 'all' ? [] : 
    [...new Set(students.filter(s => s.class_id === classFilter).map(s => s.section_id))];

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Fee Management</h1>
              <p className="text-slate-600">Track invoices, payments, and dues</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Dialog open={showFeeDialog} onOpenChange={setShowFeeDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Create Invoice</span>
                    <span className="sm:hidden">New Invoice</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Create New Fee Invoice</DialogTitle></DialogHeader>
                  <FeeForm students={students} onSubmit={handleAddFee} onCancel={() => setShowFeeDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by student name, admission number, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={classFilter} onValueChange={(value) => {
                  setClassFilter(value);
                  setSectionFilter('all'); // Reset section when class changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Class/Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter} disabled={classFilter === 'all'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sectionsForClass.map(sectionId => (
                      <SelectItem key={sectionId} value={sectionId}>Section {sectionId}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Records per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Showing {filteredFees.length} of {fees.length} records</span>
                {(searchTerm || statusFilter !== 'all' || classFilter !== 'all' || sectionFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setClassFilter('all');
                      setSectionFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Fee Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Student</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Fee Head</TableHead>
                    <TableHead className="min-w-[100px]">Amount</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Due Date</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell className="hidden sm:table-cell"><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell className="hidden md:table-cell"><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-6 bg-slate-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-8 bg-slate-200 rounded animate-pulse ml-auto w-20"></div></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedFees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {filteredFees.length === 0 && fees.length > 0 ? (
                          <div>
                            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No records match your current filters.</p>
                          </div>
                        ) : (
                          <div>
                            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No fee records found.</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFees.map(fee => {
                      const student = getStudentInfo(fee.student_id);
                      return (
                        <TableRow key={fee.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm md:text-base">{student.name || 'N/A'}</p>
                              <div className="sm:hidden mt-1 flex flex-col gap-1">
                                <Badge variant="outline" className="text-xs w-fit">{fee.fee_head}</Badge>
                                <span className="text-xs text-slate-500">{new Date(fee.due_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm">{fee.fee_head}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-sm md:text-base">${fee.final_amount?.toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm">{new Date(fee.due_date).toLocaleDateString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(fee.status)} text-xs`}>{fee.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {fee.status !== 'Paid' && (
                              <Button variant="ghost" size="sm" onClick={() => setPayingFee(fee)} className="text-xs px-2">
                                <Receipt className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Record Payment</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {!loading && filteredFees.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-slate-200">
                <div className="text-sm text-slate-600 mb-2 sm:mb-0">
                  Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredFees.length)} of {filteredFees.length} records
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm px-3 py-1 bg-slate-100 rounded">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!payingFee} onOpenChange={() => setPayingFee(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          {payingFee && <PaymentForm fee={payingFee} onSubmit={handleRecordPayment} onCancel={() => setPayingFee(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}