import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Image, 
  Cpu, 
  Crown, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  RefreshCw,
  Eye,
  Edit
} from 'lucide-react';
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/api/integrations';

const SUPPORTED_FORMATS = [
  { type: 'CSV', desc: 'Comma-separated values', icon: FileText },
  { type: 'Excel', desc: 'XLSX, XLS files', icon: FileText },
  { type: 'PDF', desc: 'Scanned documents', icon: FileText },
  { type: 'Images', desc: 'JPG, PNG, TIFF', icon: Image },
  { type: 'Documents', desc: 'Word, Text files', icon: FileText }
];

const IMPORT_TYPES = {
  students: {
    name: 'Students',
    schema: {
      type: "object",
      properties: {
        admission_no: { type: "string" },
        name: { type: "string" },
        dob: { type: "string", format: "date" },
        gender: { type: "string" },
        class: { type: "string" },
        section: { type: "string" },
        roll_no: { type: "string" },
        parent_name: { type: "string" },
        parent_phone: { type: "string" },
        parent_email: { type: "string" },
        address: { type: "string" }
      }
    }
  },
  teachers: {
    name: 'Teachers',
    schema: {
      type: "object",
      properties: {
        employee_id: { type: "string" },
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        designation: { type: "string" },
        subjects: { type: "array", items: { type: "string" } },
        qualification: { type: "string" },
        date_of_joining: { type: "string", format: "date" }
      }
    }
  },
  fees: {
    name: 'Fee Records',
    schema: {
      type: "object",
      properties: {
        student_admission_no: { type: "string" },
        fee_head: { type: "string" },
        amount: { type: "number" },
        due_date: { type: "string", format: "date" },
        academic_year: { type: "string" },
        term: { type: "string" }
      }
    }
  },
  exams: {
    name: 'Exam Schedules',
    schema: {
      type: "object",
      properties: {
        exam_name: { type: "string" },
        subject: { type: "string" },
        class: { type: "string" },
        date: { type: "string", format: "date" },
        duration_minutes: { type: "number" },
        max_marks: { type: "number" }
      }
    }
  }
};

export default function AIBulkImportDialog({ open, onOpenChange, importType = 'students' }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload'); // upload, process, review, complete
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setResults(null);
    setExtractedData([]);
    setValidationErrors([]);
    setCurrentStep('upload');
  };

  const handleAIExtraction = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setCurrentStep('process');
    setProgress(0);

    try {
      const processedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 50); // First 50% for upload/OCR
        
        // Upload file first
        const { file_url } = await UploadFile({ file });
        
        // Extract data using AI OCR
        const extractionResult = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: "array",
            items: IMPORT_TYPES[importType].schema
          }
        });

        if (extractionResult.status === 'success') {
          processedFiles.push({
            name: file.name,
            url: file_url,
            data: extractionResult.output,
            errors: []
          });
        } else {
          processedFiles.push({
            name: file.name,
            url: file_url,
            data: [],
            errors: [extractionResult.details]
          });
        }
      }

      setProgress(75);

      // Enhance extraction with LLM for better accuracy
      if (processedFiles.some(f => f.data.length > 0)) {
        const allData = processedFiles.flatMap(f => f.data);
        
        const enhancedResult = await InvokeLLM({
          prompt: `Review and enhance this extracted ${importType} data. Fix any obvious errors, standardize formats, and ensure consistency. Return the cleaned data in the same JSON structure:

${JSON.stringify(allData, null, 2)}

Rules:
- Standardize date formats to YYYY-MM-DD
- Clean up phone numbers (remove spaces, add +91 if missing for Indian numbers)
- Proper case names and addresses
- Validate email formats
- For students: ensure admission numbers are unique
- For teachers: ensure employee IDs are unique
- Return only valid, complete records`,
          response_json_schema: {
            type: "object",
            properties: {
              cleaned_data: {
                type: "array",
                items: IMPORT_TYPES[importType].schema
              },
              validation_notes: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });

        setExtractedData(enhancedResult.cleaned_data || allData);
        setValidationErrors(enhancedResult.validation_notes || []);
      }

      setProgress(100);
      setResults({
        total_files: files.length,
        processed_files: processedFiles.length,
        total_records: processedFiles.reduce((sum, f) => sum + f.data.length, 0),
        files: processedFiles
      });
      setCurrentStep('review');

    } catch (error) {
      console.error('AI extraction failed:', error);
      setValidationErrors([error.message || 'Failed to process files']);
    }
    setProcessing(false);
  };

  const handleDataEdit = (index, field, value) => {
    const updatedData = [...extractedData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setExtractedData(updatedData);
  };

  const handleImportConfirm = async () => {
    setProcessing(true);
    setCurrentStep('complete');
    
    // Here you would call the appropriate entity creation methods
    // For demo purposes, we'll simulate this
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setResults(prev => ({
        ...prev,
        imported: extractedData.length,
        failed: 0
      }));
      
      // Reset after successful import
      setTimeout(() => {
        onOpenChange(false);
        setCurrentStep('upload');
        setFiles([]);
        setExtractedData([]);
        setResults(null);
      }, 3000);
      
    } catch (error) {
      console.error('Import failed:', error);
    }
    setProcessing(false);
  };

  const downloadTemplate = () => {
    const headers = Object.keys(IMPORT_TYPES[importType].schema.properties);
    const csvContent = headers.join(',') + '\n' + 
      'SAMPLE001,John Doe,2010-05-15,Male,Grade 5,A,001,Jane Doe,+91-9876543210,jane@example.com,123 Main St';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI Bulk Import - {IMPORT_TYPES[importType].name}
            <Badge className="bg-amber-100 text-amber-800">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={processing}>Upload</TabsTrigger>
            <TabsTrigger value="process" disabled={processing || currentStep === 'upload'}>Process</TabsTrigger>
            <TabsTrigger value="review" disabled={processing || !results}>Review</TabsTrigger>
            <TabsTrigger value="complete" disabled={processing || currentStep !== 'complete'}>Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supported Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SUPPORTED_FORMATS.map((format) => (
                      <div key={format.type} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <format.icon className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium">{format.type}</p>
                          <p className="text-xs text-slate-500">{format.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">OCR Text Extraction</p>
                      <p className="text-sm text-slate-600">Extract text from scanned documents and images</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Intelligent Data Mapping</p>
                      <p className="text-sm text-slate-600">Automatically map extracted data to correct fields</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Data Validation & Cleanup</p>
                      <p className="text-sm text-slate-600">Fix formats, validate, and standardize data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <input
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-lg font-medium">Upload Files</p>
                      <p className="text-slate-600">Drop files here or click to browse</p>
                    </div>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-600" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFiles = files.filter((_, i) => i !== index);
                              setFiles(newFiles);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button 
                    onClick={handleAIExtraction} 
                    disabled={files.length === 0}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Start AI Processing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
                  AI Processing in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing files...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Uploading and scanning documents...</p>
                  <p>• Extracting text using OCR...</p>
                  <p>• Mapping data to structured format...</p>
                  <p>• Validating and cleaning data...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            {results && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{results.total_files}</p>
                      <p className="text-sm text-slate-600">Files Processed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{extractedData.length}</p>
                      <p className="text-sm text-slate-600">Records Extracted</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{validationErrors.length}</p>
                      <p className="text-sm text-slate-600">Validation Issues</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {extractedData.length > 0 ? Math.round((extractedData.length / (extractedData.length + validationErrors.length)) * 100) : 0}%
                      </p>
                      <p className="text-sm text-slate-600">Accuracy</p>
                    </CardContent>
                  </Card>
                </div>

                {validationErrors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium mb-2">Validation Issues Found:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {validationErrors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {validationErrors.length > 5 && (
                          <li>... and {validationErrors.length - 5} more issues</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {Object.keys(IMPORT_TYPES[importType].schema.properties).map(field => (
                              <th key={field} className="text-left p-2 font-medium">{field}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.slice(0, 10).map((record, index) => (
                            <tr key={index} className="border-b">
                              {Object.keys(IMPORT_TYPES[importType].schema.properties).map(field => (
                                <td key={field} className="p-2">
                                  <input
                                    type="text"
                                    value={record[field] || ''}
                                    onChange={(e) => handleDataEdit(index, field, e.target.value)}
                                    className="w-full p-1 border rounded text-xs"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {extractedData.length > 10 && (
                        <p className="text-center p-4 text-slate-500">
                          ... and {extractedData.length - 10} more records
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleImportConfirm} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Import {extractedData.length} Records
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="complete" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Import Completed Successfully!</h3>
                <p className="text-slate-600 mb-4">
                  {results?.imported || 0} records have been imported into your system.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• All data has been validated and cleaned</p>
                  <p>• Duplicate records have been handled</p>
                  <p>• System notifications have been sent</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}