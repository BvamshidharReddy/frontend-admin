import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function FeeForm({ fee, students, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    student_id: fee?.student_id || "",
    fee_head: fee?.fee_head || "Tuition",
    amount: fee?.amount || "",
    due_date: fee?.due_date || "",
    academic_year: fee?.academic_year || "2024-25",
    term: fee?.term || "Term 1",
    discount_percent: fee?.discount_percent || 0,
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
      <div><Label>Student *</Label>
        <Select value={formData.student_id} onValueChange={(v) => handleChange("student_id", v)} required>
            <SelectTrigger><SelectValue placeholder="Select student"/></SelectTrigger>
            <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.admission_no})</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Fee Head</Label>
        <Select value={formData.fee_head} onValueChange={(v) => handleChange("fee_head", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
                <SelectItem value="Tuition">Tuition</SelectItem><SelectItem value="Transport">Transport</SelectItem><SelectItem value="Library">Library</SelectItem>
                <SelectItem value="Laboratory">Laboratory</SelectItem><SelectItem value="Sports">Sports</SelectItem><SelectItem value="Examination">Examination</SelectItem><SelectItem value="Other">Other</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Amount *</Label><Input type="number" value={formData.amount} onChange={e => handleChange("amount", e.target.value)} required/></div>
        <div><Label>Discount (%)</Label><Input type="number" value={formData.discount_percent} onChange={e => handleChange("discount_percent", e.target.value)} /></div>
      </div>
      <div><Label>Due Date *</Label><Input type="date" value={formData.due_date} onChange={e => handleChange("due_date", e.target.value)} required/></div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
        <Button type="submit"><Save className="w-4 h-4 mr-2" />Create Invoice</Button>
      </div>
    </form>
  );
}