import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { format } from "date-fns";

export default function PaymentForm({ fee, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: "Cash",
    transaction_ref: "",
    receipt_no: `R${Date.now()}`
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <p>Recording payment for invoice of <strong>${fee.final_amount?.toFixed(2)}</strong>.</p>
      <div><Label>Payment Date</Label><Input type="date" value={formData.payment_date} onChange={e => handleChange('payment_date', e.target.value)} /></div>
      <div><Label>Payment Method</Label>
        <Select value={formData.payment_method} onValueChange={v => handleChange('payment_method', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem><SelectItem value="Card">Card</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Cheque">Cheque</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div><Label>Transaction Reference</Label><Input value={formData.transaction_ref} onChange={e => handleChange('transaction_ref', e.target.value)} /></div>
      <div><Label>Receipt Number</Label><Input value={formData.receipt_no} onChange={e => handleChange('receipt_no', e.target.value)} /></div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
        <Button type="submit"><Save className="w-4 h-4 mr-2" />Record Payment</Button>
      </div>
    </form>
  );
}