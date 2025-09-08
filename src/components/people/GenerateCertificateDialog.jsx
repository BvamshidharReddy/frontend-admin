
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Award, GraduationCap, Users, FileCheck } from 'lucide-react';

const certificateTypes = [
  {
    id: 'bonafide',
    name: 'Bonafide Certificate',
    description: 'General student verification certificate',
    icon: FileCheck,
    level: 'school'
  },
  {
    id: 'tc',
    name: 'Transfer Certificate (TC)',
    description: 'Official transfer document',
    icon: FileText,
    level: 'school'
  },
  {
    id: 'conduct',
    name: 'Conduct Certificate',
    description: 'Character and conduct verification',
    icon: Award,
    level: 'school'
  },
  {
    id: 'attendance',
    name: 'Attendance Certificate',
    description: 'Attendance record verification',
    icon: Users,
    level: 'school'
  },
  {
    id: 'graduation',
    name: 'Graduation Certificate',
    description: 'Course completion certificate',
    icon: GraduationCap,
    level: 'college'
  },
  {
    id: 'provisional',
    name: 'Provisional Certificate',
    description: 'Temporary degree certificate',
    icon: FileText,
    level: 'college'
  },
  {
    id: 'migration',
    name: 'Migration Certificate',
    description: 'University transfer certificate',
    icon: FileCheck,
    level: 'college'
  }
];

export default function GenerateCertificateDialog({ open, onOpenChange, selectedStudents = [] }) {
  const [selectedCertificateType, setSelectedCertificateType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCertificateType || !selectedStudents || selectedStudents.length === 0) {
      alert('Please select a certificate type and ensure students are selected.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate certificate generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Generated ${selectedCertificateType} certificates for ${selectedStudents.length} student(s). Files are ready for download.`);
    setIsGenerating(false);
    onOpenChange(false);
  };

  const selectedCertificate = certificateTypes.find(cert => cert.id === selectedCertificateType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Certificates</DialogTitle>
          <DialogDescription>
            Generate official certificates for {selectedStudents?.length || 0} selected student(s).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Certificate Type</label>
            <Select value={selectedCertificateType} onValueChange={setSelectedCertificateType}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">School Level</div>
                {certificateTypes.filter(cert => cert.level === 'school').map(cert => (
                  <SelectItem key={cert.id} value={cert.id}>
                    <div className="flex items-center gap-2">
                      <cert.icon className="w-4 h-4" />
                      {cert.name}
                    </div>
                  </SelectItem>
                ))}
                <div className="p-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">College Level</div>
                {certificateTypes.filter(cert => cert.level === 'college').map(cert => (
                  <SelectItem key={cert.id} value={cert.id}>
                    <div className="flex items-center gap-2">
                      <cert.icon className="w-4 h-4" />
                      {cert.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCertificate && (
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <selectedCertificate.icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-slate-900">{selectedCertificate.name}</h3>
                    <p className="text-sm text-slate-600">{selectedCertificate.description}</p>
                  </div>
                  <Badge variant="outline" className={selectedCertificate.level === 'school' ? 'bg-blue-50' : 'bg-purple-50'}>
                    {selectedCertificate.level}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">
                  Will be generated for: {selectedStudents?.map(s => s.name).join(', ') || 'No students selected'}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!selectedCertificateType || !selectedStudents || selectedStudents.length === 0 || isGenerating}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Certificates'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
