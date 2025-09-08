import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Crown, 
  QrCode, 
  Download, 
  Eye, 
  Share,
  CheckCircle,
  FileText,
  Printer,
  Shield
} from 'lucide-react';
import { InvokeLLM, GenerateImage } from '@/api/integrations';

export default function SmartCertificates({ students, onGenerate }) {
  const [generating, setGenerating] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);
  const [certificateData, setCertificateData] = useState({
    type: 'achievement',
    student_id: '',
    title: '',
    description: '',
    date_issued: new Date().toISOString().split('T')[0],
    issued_by: '',
    template_style: 'elegant',
    include_qr: true,
    watermark: true
  });

  const certificateTypes = [
    { value: 'achievement', label: 'Achievement Certificate', desc: 'For academic or extracurricular achievements' },
    { value: 'participation', label: 'Participation Certificate', desc: 'For event or activity participation' },
    { value: 'completion', label: 'Course Completion', desc: 'For completing courses or programs' },
    { value: 'merit', label: 'Merit Certificate', desc: 'For outstanding performance' },
    { value: 'conduct', label: 'Good Conduct Certificate', desc: 'For exemplary behavior' }
  ];

  const templateStyles = [
    { value: 'elegant', label: 'Elegant', preview: 'Classic formal design with gold accents' },
    { value: 'modern', label: 'Modern', preview: 'Clean contemporary design with blue theme' },
    { value: 'traditional', label: 'Traditional', preview: 'Traditional academic style with borders' },
    { value: 'colorful', label: 'Colorful', preview: 'Vibrant design suitable for younger students' }
  ];

  const handleGenerateCertificate = async () => {
    setGenerating(true);
    try {
      const student = students.find(s => s.id === certificateData.student_id);
      if (!student) {
        alert('Please select a student');
        return;
      }

      // Generate certificate design prompt
      const designPrompt = `Create a professional ${certificateData.type} certificate with the following details:

Certificate Details:
- Type: ${certificateData.type}
- Title: ${certificateData.title}
- Student Name: ${student.name}
- Description: ${certificateData.description}
- Date Issued: ${certificateData.date_issued}
- Issued By: ${certificateData.issued_by}
- Template Style: ${certificateData.template_style}

Design Requirements:
- Professional and formal appearance
- School branding elements
- Appropriate borders and decorative elements
- Space for QR code verification
- High-quality printable format
- ${certificateData.template_style} style theme`;

      // Generate certificate image
      const imageResult = await GenerateImage({
        prompt: designPrompt
      });

      // Generate QR code data and verification details
      const qrData = {
        certificate_id: `CERT-${Date.now()}`,
        student_name: student.name,
        certificate_type: certificateData.type,
        date_issued: certificateData.date_issued,
        issued_by: certificateData.issued_by,
        verification_url: `https://verify.medhashaala.edu/cert/${Date.now()}`
      };

      // Generate certificate content using LLM
      const contentResult = await InvokeLLM({
        prompt: `Generate formal certificate text for a ${certificateData.type} certificate.

Details:
- Student: ${student.name}
- Title: ${certificateData.title}
- Description: ${certificateData.description}
- Date: ${certificateData.date_issued}
- Issued by: ${certificateData.issued_by}

Generate:
1. Formal certificate text
2. Citation/description paragraph
3. Verification statement
4. Digital signature line`,
        response_json_schema: {
          type: "object",
          properties: {
            main_text: { type: "string" },
            citation: { type: "string" },
            verification_statement: { type: "string" },
            signature_line: { type: "string" }
          }
        }
      });

      setGeneratedCertificate({
        ...certificateData,
        student: student,
        qr_data: qrData,
        content: contentResult,
        image_url: imageResult.url,
        generated_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
    setGenerating(false);
  };

  const handleDownloadCertificate = () => {
    // Simulate PDF download
    if (generatedCertificate) {
      const link = document.createElement('a');
      link.href = generatedCertificate.image_url;
      link.download = `${generatedCertificate.student.name}_${generatedCertificate.type}_certificate.pdf`;
      link.click();
    }
  };

  const handleVerifyCertificate = () => {
    if (generatedCertificate) {
      window.open(generatedCertificate.qr_data.verification_url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            Smart Certificate Generator
            <Badge className="bg-amber-100 text-amber-800">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate Certificate</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedCertificate}>Preview & Download</TabsTrigger>
              <TabsTrigger value="verify">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Certificate Type</Label>
                  <Select value={certificateData.type} onValueChange={(v) => setCertificateData({...certificateData, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {certificateTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Select Student</Label>
                  <Select value={certificateData.student_id} onValueChange={(v) => setCertificateData({...certificateData, student_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.admission_no})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Certificate Title</Label>
                <Input 
                  placeholder="e.g., Excellence in Mathematics"
                  value={certificateData.title}
                  onChange={(e) => setCertificateData({...certificateData, title: e.target.value})}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the achievement or reason for the certificate..."
                  value={certificateData.description}
                  onChange={(e) => setCertificateData({...certificateData, description: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Date Issued</Label>
                  <Input 
                    type="date"
                    value={certificateData.date_issued}
                    onChange={(e) => setCertificateData({...certificateData, date_issued: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Issued By</Label>
                  <Input 
                    placeholder="Principal Name or Authority"
                    value={certificateData.issued_by}
                    onChange={(e) => setCertificateData({...certificateData, issued_by: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Template Style</Label>
                <Select value={certificateData.template_style} onValueChange={(v) => setCertificateData({...certificateData, template_style: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateStyles.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        <div>
                          <p className="font-medium">{style.label}</p>
                          <p className="text-xs text-slate-500">{style.preview}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-slate-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Security Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span className="text-sm">Include QR Code for Verification</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={certificateData.include_qr}
                        onChange={(e) => setCertificateData({...certificateData, include_qr: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Add Security Watermark</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={certificateData.watermark}
                        onChange={(e) => setCertificateData({...certificateData, watermark: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Save as Template</Button>
                <Button 
                  onClick={handleGenerateCertificate} 
                  disabled={generating || !certificateData.student_id || !certificateData.title}
                  className="bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  {generating ? (
                    <>
                      <Award className="w-4 h-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Generate Certificate
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {generatedCertificate && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {generatedCertificate.title} - {generatedCertificate.student.name}
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm" onClick={handleDownloadCertificate}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-white border-2">
                    <CardContent className="p-8">
                      <div className="text-center space-y-6">
                        <div className="border-b pb-4">
                          <h1 className="text-3xl font-bold text-slate-800 mb-2">MedhaShaala International School</h1>
                          <p className="text-slate-600">Certificate of {generatedCertificate.type}</p>
                        </div>

                        <div className="py-8">
                          <h2 className="text-2xl font-bold text-slate-800 mb-4">{generatedCertificate.title}</h2>
                          
                          <div className="max-w-2xl mx-auto text-center space-y-4">
                            <p className="text-lg">{generatedCertificate.content?.main_text}</p>
                            <p className="text-xl font-semibold text-blue-600">{generatedCertificate.student.name}</p>
                            <p className="text-slate-600">{generatedCertificate.content?.citation}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-8 border-t">
                          <div className="text-left">
                            <p className="text-sm text-slate-600">Issued on: {new Date(generatedCertificate.date_issued).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-600">Certificate ID: {generatedCertificate.qr_data.certificate_id}</p>
                          </div>
                          
                          {generatedCertificate.include_qr && (
                            <div className="text-center">
                              <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center mb-2">
                                <QrCode className="w-8 h-8 text-slate-600" />
                              </div>
                              <p className="text-xs text-slate-500">Scan to verify</p>
                            </div>
                          )}
                          
                          <div className="text-right">
                            <div className="border-t border-slate-300 pt-2 w-32">
                              <p className="text-sm font-medium">{generatedCertificate.issued_by}</p>
                              <p className="text-xs text-slate-600">Principal</p>
                            </div>
                          </div>
                        </div>

                        {generatedCertificate.content?.verification_statement && (
                          <div className="text-center pt-4">
                            <p className="text-xs text-slate-500">{generatedCertificate.content.verification_statement}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Certificate Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <QrCode className="w-24 h-24 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-700">Verify Certificate Authenticity</h3>
                    <p className="text-slate-600 mt-2">
                      Each certificate includes a unique QR code for instant verification
                    </p>
                  </div>

                  {generatedCertificate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Certificate Verified</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>ID:</strong> {generatedCertificate.qr_data.certificate_id}</p>
                        <p><strong>Student:</strong> {generatedCertificate.qr_data.student_name}</p>
                        <p><strong>Type:</strong> {generatedCertificate.qr_data.certificate_type}</p>
                        <p><strong>Issued:</strong> {new Date(generatedCertificate.qr_data.date_issued).toLocaleDateString()}</p>
                        <p><strong>Authority:</strong> {generatedCertificate.qr_data.issued_by}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={handleVerifyCertificate}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Verification
                      </Button>
                    </div>
                  )}

                  <div className="text-center">
                    <Input placeholder="Enter Certificate ID to verify" className="max-w-md mx-auto mb-3" />
                    <Button>Verify Certificate</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}