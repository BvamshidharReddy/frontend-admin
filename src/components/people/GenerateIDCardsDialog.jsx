
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X, User, GraduationCap, Crown, Sparkles } from 'lucide-react';

const IDCard = ({ person, type = 'student' }) => (
  <div className="w-64 h-96 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center border-2 border-blue-200 relative overflow-hidden break-inside-avoid">
    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500"></div>
    <div className="w-24 h-24 rounded-full bg-slate-200 mt-8 border-4 border-white shadow-md z-10 flex items-center justify-center">
      <User className="w-12 h-12 text-slate-500" />
    </div>
    <h2 className="text-xl font-bold mt-4 text-slate-800 text-center">{person.name}</h2>
    <p className="text-sm text-slate-500 capitalize">{type}</p>
    
    <div className="text-left w-full mt-6 space-y-2">
      <p className="text-xs text-slate-600">
        <strong>ID:</strong> {person.admission_no || person.employee_id}
      </p>
      {type === 'student' && (
        <p className="text-xs text-slate-600">
          <strong>Class:</strong> {person.grade} - {person.section}
        </p>
      )}
       {type === 'teacher' && (
        <p className="text-xs text-slate-600">
          <strong>Department:</strong> {person.department}
        </p>
      )}
       {type === 'staff' && (
        <p className="text-xs text-slate-600">
          <strong>Role:</strong> {person.role}
        </p>
      )}
      <p className="text-xs text-slate-600">
        <strong>Contact:</strong> {person.parent_phone || person.phone}
      </p>
    </div>
    
    <div className="mt-auto text-center">
        <GraduationCap className="w-8 h-8 text-blue-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-700 mt-1">MedhaShaala School</p>
        <p className="text-xs text-slate-500">Academic Year 2024-25</p>
    </div>
  </div>
);

const UpgradePrompt = ({ onUpgrade, onCancel }) => (
  <div className="text-center p-8">
    <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-amber-600" />
    </div>
    <h3 className="font-semibold text-slate-900 mb-2 text-lg">Unlock Premium ID Cards</h3>
    <p className="text-sm text-slate-600 mb-4">
        Generate professional, customizable ID cards with QR codes and multiple templates by upgrading your plan.
    </p>
    <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>Maybe Later</Button>
        <Button onClick={onUpgrade} className="bg-gradient-to-r from-amber-500 to-orange-500">
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade Now
        </Button>
    </div>
  </div>
);

export default function GenerateIDCardsDialog({ open, onOpenChange, selectedPeople, type = 'student', currentPlan = 'basic' }) {
  const handlePrint = () => {
    const printContent = document.getElementById('id-cards-container').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print ID Cards</title>');
    printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } .break-inside-avoid { page-break-inside: avoid; } }</style>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<div class="p-4 grid grid-cols-2 gap-4">');
    printWindow.document.write(printContent);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
  };
  
  const showUpgrade = currentPlan === 'basic';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate ID Cards</DialogTitle>
           {!showUpgrade && <DialogDescription>
            Preview and print ID cards for the selected {type}s.
          </DialogDescription>}
        </DialogHeader>

        {showUpgrade ? (
          <UpgradePrompt onCancel={() => onOpenChange(false)} onUpgrade={() => alert('Redirecting to upgrade page!')} />
        ) : (
          <>
            <div id="id-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto p-4 bg-slate-50 rounded-lg">
                {selectedPeople.map(person => (
                <IDCard key={person.id} person={person} type={type} />
                ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
                </Button>
                <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print ID Cards
                </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
