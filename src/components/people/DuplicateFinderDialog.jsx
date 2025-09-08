import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Phone, Mail, EyeOff, UserX } from 'lucide-react';
import { Student } from "@/api/entities";

export default function DuplicateFinderDialog({ open, onOpenChange, duplicates = [], onMerge }) {
  const [ignoredDuplicates, setIgnoredDuplicates] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIgnoreConfirm, setShowIgnoreConfirm] = useState(false);
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);

  const handleIgnoreClick = (duplicate) => {
    setSelectedDuplicate(duplicate);
    setShowIgnoreConfirm(true);
  };

  const confirmIgnore = () => {
    if (selectedDuplicate) {
      setIgnoredDuplicates(prev => [...prev, selectedDuplicate.id]);
      setShowIgnoreConfirm(false);
      setSelectedDuplicate(null);
    }
  };

  const handleMergeClick = (duplicate) => {
    setSelectedDuplicate(duplicate);
    setShowMergeConfirm(true);
  };

  const confirmMerge = async () => {
    if (!selectedDuplicate) return;
    
    setIsProcessing(true);
    setShowMergeConfirm(false);
    
    try {
      // Merge student2 data into student1 and delete student2
      const mergedData = {
        ...selectedDuplicate.student1,
        // Keep the most complete information
        phone: selectedDuplicate.student1.phone || selectedDuplicate.student2.phone,
        email: selectedDuplicate.student1.email || selectedDuplicate.student2.email,
        parent_phone: selectedDuplicate.student1.parent_phone || selectedDuplicate.student2.parent_phone,
        parent_email: selectedDuplicate.student1.parent_email || selectedDuplicate.student2.parent_email,
        address: selectedDuplicate.student1.address || selectedDuplicate.student2.address,
        // Keep the most recent data for other fields
        updated_date: new Date().toISOString()
      };

      // Update the primary student record
      await Student.update(selectedDuplicate.student1.id, mergedData);
      
      // Delete the duplicate student record
      await Student.delete(selectedDuplicate.student2.id);
      
      // Mark as ignored to remove from list
      setIgnoredDuplicates(prev => [...prev, selectedDuplicate.id]);
      
      // Callback to refresh the parent component
      if (onMerge) {
        onMerge();
      }
      
      alert(`Successfully merged student records. ${selectedDuplicate.student2.name}'s data has been merged into ${selectedDuplicate.student1.name}'s record.`);
    } catch (error) {
      console.error('Error merging student records:', error);
      alert('Failed to merge student records. Please try again or contact support.');
    }
    
    setIsProcessing(false);
    setSelectedDuplicate(null);
  };

  const visibleDuplicates = duplicates.filter(dup => !ignoredDuplicates.includes(dup.id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Duplicate Records Found ({visibleDuplicates.length})
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {visibleDuplicates.length > 0 ? (
              visibleDuplicates.map((duplicate) => (
                <Card key={duplicate.id} className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h3 className="font-medium">Potential Duplicate</h3>
                        <Badge variant="outline" className={
                          duplicate.confidence === 'High' ? 'text-red-600 border-red-300' : 
                          duplicate.confidence === 'Medium' ? 'text-yellow-600 border-yellow-300' : 
                          'text-green-600 border-green-300'
                        }>
                          {duplicate.confidence} Confidence
                        </Badge>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleIgnoreClick(duplicate)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-none"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Ignore</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleMergeClick(duplicate)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-none"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{isProcessing ? 'Processing...' : 'Merge'}</span>
                          <span className="sm:hidden">{isProcessing ? 'Processing...' : 'Merge'}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3 bg-white">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Record 1 (Primary)
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {duplicate.student1.name}</p>
                          <p><strong>ID:</strong> {duplicate.student1.admission_no || 'N/A'}</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span className="break-all">{duplicate.student1.parent_phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="break-all text-xs">{duplicate.student1.parent_email || 'No email'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-white">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Record 2 (Duplicate)
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {duplicate.student2.name}</p>
                          <p><strong>ID:</strong> {duplicate.student2.admission_no || 'N/A'}</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span className="break-all">{duplicate.student2.parent_phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="break-all text-xs">{duplicate.student2.parent_email || 'No email'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-slate-100 rounded text-xs text-slate-600">
                      <strong>Reason:</strong> {duplicate.reason}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No Duplicates Found</h3>
                <p className="text-slate-500">All student records appear to be unique.</p>
              </div>
            )}
          </div>
          
          {visibleDuplicates.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-3">
              <p className="text-sm text-slate-600 text-center sm:text-left">
                Review each potential duplicate carefully before merging.
              </p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ignore Confirmation Dialog */}
      <Dialog open={showIgnoreConfirm} onOpenChange={setShowIgnoreConfirm}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ignore Duplicate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to ignore this potential duplicate? It will be hidden from the duplicate list but both records will remain in the system.
            </p>
            {selectedDuplicate && (
              <div className="bg-slate-50 p-3 rounded-lg text-sm">
                <strong>Records:</strong> {selectedDuplicate.student1.name} & {selectedDuplicate.student2.name}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowIgnoreConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmIgnore}>
              Yes, Ignore
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Merge Confirmation Dialog */}
      <Dialog open={showMergeConfirm} onOpenChange={setShowMergeConfirm}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Merge Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800 font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
              <p className="text-xs text-red-700">
                The duplicate record will be permanently deleted and its data merged into the primary record.
              </p>
            </div>
            {selectedDuplicate && (
              <div className="space-y-2 text-sm">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <strong className="text-green-800">Primary Record (will be kept):</strong><br />
                  {selectedDuplicate.student1.name} - {selectedDuplicate.student1.admission_no}
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <strong className="text-red-800">Duplicate Record (will be deleted):</strong><br />
                  {selectedDuplicate.student2.name} - {selectedDuplicate.student2.admission_no}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowMergeConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMerge} variant="destructive">
              Yes, Merge Records
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}