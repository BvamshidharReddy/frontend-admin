import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePlus2, Plus, Crown, FileText, Eye, User, Phone, Mail, MapPin, Calendar, Upload, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import GenerateCertificateDialog from '../components/people/GenerateCertificateDialog';
import AddTemplateDialog from '../components/admissions/AddTemplateDialog';

const initialApplicants = {
  applied: [
    {
      id: 1,
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'aarav.sharma@email.com',
      address: '123 MG Road, Bangalore',
      dob: '2010-05-15',
      gender: 'Male',
      grade: 'Grade 8',
      parent_name: 'Raj Sharma',
      parent_phone: '+91 98765 43211',
      parent_email: 'raj.sharma@email.com',
      application_date: '2024-01-15',
      documents: ['birth_certificate', 'transfer_certificate', 'photos']
    },
    {
      id: 2,
      name: 'Priya Singh',
      phone: '+91 98765 43212',
      email: 'priya.singh@email.com',
      address: '456 Brigade Road, Bangalore',
      dob: '2009-08-22',
      gender: 'Female',
      grade: 'Grade 9',
      parent_name: 'Sunil Singh',
      parent_phone: '+91 98765 43213',
      parent_email: 'sunil.singh@email.com',
      application_date: '2024-01-20',
      documents: ['birth_certificate', 'report_card', 'photos']
    }
  ],
  review: [
    {
      id: 3,
      name: 'Rohan Mehta',
      phone: '+91 98765 43214',
      email: 'rohan.mehta@email.com',
      address: '789 Commercial Street, Bangalore',
      dob: '2011-03-10',
      gender: 'Male',
      grade: 'Grade 7',
      parent_name: 'Amit Mehta',
      parent_phone: '+91 98765 43215',
      parent_email: 'amit.mehta@email.com',
      application_date: '2024-01-12',
      documents: ['birth_certificate', 'transfer_certificate']
    }
  ],
  offer: [
    {
      id: 4,
      name: 'Sanya Gupta',
      phone: '+91 98765 43216',
      email: 'sanya.gupta@email.com',
      address: '321 Indiranagar, Bangalore',
      dob: '2010-12-05',
      gender: 'Female',
      grade: 'Grade 8',
      parent_name: 'Preeti Gupta',
      parent_phone: '+91 98765 43217',
      parent_email: 'preeti.gupta@email.com',
      application_date: '2024-01-08',
      documents: ['birth_certificate', 'report_card', 'photos']
    }
  ],
  onboarded: [
    {
      id: 5,
      name: 'Vikram Reddy',
      phone: '+91 98765 43218',
      email: 'vikram.reddy@email.com',
      address: '654 Koramangala, Bangalore',
      dob: '2009-06-18',
      gender: 'Male',
      grade: 'Grade 9',
      parent_name: 'Krishna Reddy',
      parent_phone: '+91 98765 43219',
      parent_email: 'krishna.reddy@email.com',
      application_date: '2024-01-05',
      documents: ['birth_certificate', 'transfer_certificate', 'photos']
    }
  ],
};

const initialNewApplicantData = {
  name: '',
  dob: '',
  gender: '',
  grade: '',
  phone: '',
  email: '',
  address: '',
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  documents: [],
};

export default function Admissions() {
  const [students, setStudents] = useState([]);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [isAddApplicantOpen, setIsAddApplicantOpen] = useState(false);
  const [newApplicantData, setNewApplicantData] = useState({...initialNewApplicantData});
  const [showGenerateCertificateDialog, setShowGenerateCertificateDialog] = useState(false);
  const [showSmartCertificateDialog, setShowSmartCertificateDialog] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false);

  useEffect(() => {
    const allStudents = Object.values(applicants).flat();
    setStudents(allStudents);
  }, [applicants]);

  const handleAddApplicant = () => {
    if (!newApplicantData.name || !newApplicantData.grade) {
      alert("Applicant Name and Grade are required.");
      return;
    }
    const newApplicant = {
      id: Date.now(),
      ...newApplicantData,
      application_date: new Date().toISOString().split('T')[0],
    };
    setApplicants(prev => ({
      ...prev,
      applied: [...prev.applied, newApplicant],
    }));
    setNewApplicantData({...initialNewApplicantData});
    setIsAddApplicantOpen(false);
  };

  const handleInputChange = (field, value) => {
    setNewApplicantData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (id) => {
    setNewApplicantData(prev => {
      const newDocuments = prev.documents.includes(id)
        ? prev.documents.filter(docId => docId !== id)
        : [...prev.documents, id];
      return { ...prev, documents: newDocuments };
    });
  };

  const handleViewApplication = (applicant) => {
    setViewingApplicant(applicant);
    setIsViewApplicationOpen(true);
  };

  const handleProcessApplication = (applicant) => {
    const currentStage = Object.keys(applicants).find(stage => 
      applicants[stage].some(app => app.id === applicant.id)
    );
    
    let nextStage = null;
    switch(currentStage) {
      case 'applied':
        nextStage = 'review';
        break;
      case 'review':
        nextStage = 'offer';
        break;
      case 'offer':
        nextStage = 'onboarded';
        break;
      default:
        alert('Application is already at the final stage or an unknown stage.');
        return;
    }

    if (nextStage) {
      setApplicants(prev => ({
        ...prev,
        [currentStage]: prev[currentStage].filter(app => app.id !== applicant.id),
        [nextStage]: [...prev[nextStage], applicant]
      }));
      alert(`Moved to Next Stage`);
      setIsViewApplicationOpen(false);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      review: "bg-yellow-100 text-yellow-800",
      offer: "bg-purple-100 text-purple-800",
      onboarded: "bg-green-100 text-green-800"
    };
    return colors[stage] || colors.applied;
  };

  // Determine current stage for viewing applicant
  const viewingApplicantStage = viewingApplicant
    ? Object.keys(applicants).find(stage =>
        applicants[stage].some(app => app.id === viewingApplicant.id)
      )
    : null;

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              Admissions & Certificates
              <Badge className="bg-purple-100 text-purple-800">
                <Crown className="w-3 h-3 mr-1" />
                Standard
              </Badge>
            </h1>
            <p className="text-slate-600">Streamline admission pipeline and generate certificates.</p>
          </div>
          <Dialog open={isAddApplicantOpen} onOpenChange={setIsAddApplicantOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Application</Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Application</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4">

                {/* Personal Details */}
                <Card>
                  <CardHeader><CardTitle className="text-lg">Personal Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appName">Full Name *</Label>
                        <Input id="appName" value={newApplicantData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="appDob">Date of Birth</Label>
                        <Input id="appDob" type="date" value={newApplicantData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appGender">Gender</Label>
                        <Select value={newApplicantData.gender} onValueChange={(val) => handleInputChange('gender', val)}>
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="appGrade">Grade Applying For *</Label>
                         <Select value={newApplicantData.grade} onValueChange={(val) => handleInputChange('grade', val)}>
                          <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="appPhone">Student Phone</Label>
                          <Input id="appPhone" value={newApplicantData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="appEmail">Student Email</Label>
                          <Input id="appEmail" type="email" value={newApplicantData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="appAddress">Address</Label>
                        <Textarea id="appAddress" value={newApplicantData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                      </div>
                  </CardContent>
                </Card>

                {/* Parent/Guardian Information */}
                <Card>
                  <CardHeader><CardTitle className="text-lg">Parent/Guardian Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentName">Parent/Guardian Name</Label>
                        <Input id="parentName" value={newApplicantData.parent_name} onChange={(e) => handleInputChange('parent_name', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                        <Input id="parentPhone" value={newApplicantData.parent_phone} onChange={(e) => handleInputChange('parent_phone', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                      <Input id="parentEmail" type="email" value={newApplicantData.parent_email} onChange={(e) => handleInputChange('parent_email', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader><CardTitle className="text-lg">Documents Checklist</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { id: 'birth_certificate', label: 'Birth Certificate' },
                      { id: 'transfer_certificate', label: 'Transfer Certificate' },
                      { id: 'photos', label: 'Passport-size Photos' },
                      { id: 'aadhar', label: 'Aadhar Card' },
                    ].map(doc => (
                      <div key={doc.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={doc.id}
                          checked={newApplicantData.documents.includes(doc.id)}
                          onCheckedChange={() => handleCheckboxChange(doc.id)}
                        />
                        <Label htmlFor={doc.id} className="font-normal">{doc.label}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddApplicantOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddApplicant}>Add Application</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="admissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions" className="mt-6">
            <Card className="mb-6 border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Admission Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(applicants).map(([stage, stageApplicants]) => (
                  <div key={stage} className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-4 capitalize flex items-center gap-2">
                      {stage}
                      <Badge variant="secondary" className={getStageColor(stage)}>
                        {stageApplicants.length}
                      </Badge>
                    </h3>
                    <div className="space-y-3">
                      {stageApplicants.map(applicant => (
                        <Card key={applicant.id} className="p-3 hover:shadow-md transition-shadow">
                          <div className="space-y-2">
                            <p className="font-medium text-sm">{applicant.name}</p>
                            <p className="text-xs text-slate-500">Applied: {applicant.application_date}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleViewApplication(applicant)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Application
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
                  <CardHeader>
                      <CardTitle>Standard Certificate Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-slate-600 mb-4">Generate official certificates for admitted students (e.g., Bonafide, Transfer Certificate).</p>
                      <Button onClick={() => setShowGenerateCertificateDialog(true)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Standard Certificate
                      </Button>
                  </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
                  <CardHeader>
                      <CardTitle>Smart Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-slate-600 mb-4">Issue certificates for co-curricular achievements like quizzes, sports, and cultural events.</p>
                      <Button onClick={() => setShowSmartCertificateDialog(true)} variant="secondary">
                          <Award className="w-4 h-4 mr-2" />
                          Issue Smart Certificate
                      </Button>
                  </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
                  <CardHeader>
                      <CardTitle>Certificate Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-slate-600 mb-4">Manage certificate templates for your institution.</p>
                       <Button onClick={() => setShowAddTemplateDialog(true)}>
                          <Upload className="w-4 h-4 mr-2" />
                          Add Template
                      </Button>
                  </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Application Dialog */}
        <Dialog open={isViewApplicationOpen} onOpenChange={setIsViewApplicationOpen}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Application Details
              </DialogTitle>
            </DialogHeader>
            {viewingApplicant && (
              <div className="space-y-6 py-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Full Name</Label>
                        <p className="text-slate-900 font-medium">{viewingApplicant.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Date of Birth</Label>
                        <p className="text-slate-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {viewingApplicant.dob || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Gender</Label>
                        <p className="text-slate-900">{viewingApplicant.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Applied for Grade</Label>
                        <p className="text-slate-900">{viewingApplicant.grade}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Application Date</Label>
                        <p className="text-slate-900">{viewingApplicant.application_date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Phone</Label>
                        <p className="text-slate-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {viewingApplicant.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Email</Label>
                        <p className="text-slate-900 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {viewingApplicant.email || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Address</Label>
                        <p className="text-slate-900 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1" />
                          <span>{viewingApplicant.address || 'Not provided'}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Parent Name</Label>
                        <p className="text-slate-900">{viewingApplicant.parent_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Parent Phone</Label>
                        <p className="text-slate-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {viewingApplicant.parent_phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Parent Email</Label>
                        <p className="text-slate-900 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {viewingApplicant.parent_email || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Documents Submitted</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'birth_certificate', label: 'Birth Certificate' },
                        { id: 'transfer_certificate', label: 'Transfer Certificate' },
                        { id: 'photos', label: 'Passport-size Photos' },
                        { id: 'aadhar', label: 'Aadhar Card' },
                      ].filter(docType => (viewingApplicant.documents || []).includes(docType.id))
                       .map((doc, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {doc.label}
                        </Badge>
                      ))}
                      {(!viewingApplicant.documents || viewingApplicant.documents.length === 0) && (
                        <p className="text-slate-500">No documents uploaded</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewApplicationOpen(false)}>
                    Close
                  </Button>
                  {viewingApplicantStage !== 'onboarded' && (
                    <Button onClick={() => handleProcessApplication(viewingApplicant)}>
                      Process Application
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <GenerateCertificateDialog
          open={showGenerateCertificateDialog}
          onOpenChange={setShowGenerateCertificateDialog}
          selectedStudents={students.filter(s => applicants.onboarded.some(a => a.id === s.id))}
        />

        <GenerateCertificateDialog
          open={showSmartCertificateDialog}
          onOpenChange={setShowSmartCertificateDialog}
          selectedStudents={students}
        />

        <AddTemplateDialog
            open={showAddTemplateDialog}
            onOpenChange={setShowAddTemplateDialog}
        />
      </div>
    </div>
  );
}