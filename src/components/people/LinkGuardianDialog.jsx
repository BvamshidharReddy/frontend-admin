import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Link } from 'lucide-react';
import StudentForm from '../students/StudentForm'; // Re-using for parent details

export default function LinkGuardianDialog({ open, onOpenChange, student, allStudents, onLink }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGuardianForm, setShowNewGuardianForm] = useState(false);

  const potentialGuardians = allStudents.filter(s => 
    s.id !== student.id && (
      (s.parent_name && s.parent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.parent_phone && s.parent_phone.includes(searchTerm))
    ) && searchTerm
  ).reduce((acc, s) => {
    const key = s.parent_phone || s.parent_name;
    if (!acc.some(g => (g.parent_phone || g.parent_name) === key)) {
      acc.push(s);
    }
    return acc;
  }, []);

  const handleLink = (guardianData) => {
    onLink(student.id, {
      parent_name: guardianData.parent_name,
      parent_phone: guardianData.parent_phone,
      parent_email: guardianData.parent_email,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Guardian for {student?.name}</DialogTitle>
          <DialogDescription>
            Search for an existing guardian or add a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Search by guardian name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto space-y-2">
            {potentialGuardians.map(g => (
              <div key={g.id} className="flex justify-between items-center p-2 border rounded-lg">
                <div>
                  <p className="font-medium">{g.parent_name}</p>
                  <p className="text-sm text-slate-500">{g.parent_phone}</p>
                  <p className="text-xs text-slate-400">Guardian of {g.name}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleLink(g)}>
                  <Link className="w-4 h-4 mr-2" />
                  Link
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button variant="secondary" onClick={() => setShowNewGuardianForm(!showNewGuardianForm)}>
              <UserPlus className="w-4 h-4 mr-2" />
              {showNewGuardianForm ? 'Cancel' : 'Add New Guardian'}
            </Button>
          </div>
          {showNewGuardianForm && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">New Guardian Details</h3>
              <Input placeholder="Parent Name" id="parent_name" className="mb-2" />
              <Input placeholder="Parent Phone" id="parent_phone" className="mb-2" />
              <Input placeholder="Parent Email" id="parent_email" className="mb-2" />
              <Button className="w-full" onClick={() => {
                const newGuardian = {
                  parent_name: document.getElementById('parent_name').value,
                  parent_phone: document.getElementById('parent_phone').value,
                  parent_email: document.getElementById('parent_email').value,
                };
                handleLink(newGuardian);
              }}>Save & Link</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}