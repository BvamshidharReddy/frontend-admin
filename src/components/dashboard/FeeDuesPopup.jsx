import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, AlertTriangle, Clock, Receipt } from 'lucide-react';
import { Fee } from '@/api/entities';

export default function FeeDuesPopup({ open, onOpenChange, dueCount }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadFees();
    }
  }, [open]);

  const loadFees = async () => {
    setLoading(true);
    try {
      const feesResponse = await Fee.list("-due_date").catch(() => ({ data: [] }));
      setFees(feesResponse?.data || feesResponse || []);
    } catch (error) {
      console.error("Error loading fees:", error);
      setFees([]);
    }
    setLoading(false);
  };

  const pendingFees = fees.filter(f => f?.status === "Pending");
  const overdueFees = fees.filter(f => f?.status === "Overdue");
  const partiallyPaidFees = fees.filter(f => f?.status === "Partially Paid");

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Overdue: "bg-red-100 text-red-800",
      "Partially Paid": "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const FeeTable = ({ fees, title }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title} ({fees.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {fees.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {fees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Student ID: {fee.student_id}</p>
                  <p className="text-sm text-slate-600">{fee.fee_head}</p>
                  <p className="text-xs text-slate-500">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${fee.final_amount?.toFixed(2)}</p>
                  <Badge className={getStatusBadge(fee.status)}>{fee.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm py-4 text-center">No {title.toLowerCase()} found</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Fee Dues Management
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="pending" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Pending ({pendingFees.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Overdue ({overdueFees.length})
            </TabsTrigger>
            <TabsTrigger value="partial" className="text-xs sm:text-sm">
              <Receipt className="w-4 h-4 mr-1" />
              Partial ({partiallyPaidFees.length})
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[50vh]">
            <TabsContent value="pending" className="mt-0">
              <FeeTable fees={pendingFees} title="Pending Fees" />
            </TabsContent>
            
            <TabsContent value="overdue" className="mt-0">
              <FeeTable fees={overdueFees} title="Overdue Fees" />
            </TabsContent>
            
            <TabsContent value="partial" className="mt-0">
              <FeeTable fees={partiallyPaidFees} title="Partially Paid Fees" />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}