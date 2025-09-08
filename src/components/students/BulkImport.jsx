import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

export default function BulkImport({ onComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a CSV file");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Here you would typically upload the file and process it
      // For now, we'll simulate a successful upload
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setResults({
          total: 25,
          successful: 23,
          failed: 2,
          errors: [
            { row: 5, error: "Missing required field: admission_no" },
            { row: 12, error: "Invalid email format" }
          ]
        });
        setUploading(false);
      }, 2000);

    } catch (err) {
      setError("Failed to upload file. Please try again.");
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `admission_no,name,dob,gender,class_id,section_id,roll_no,phone,email,parent_name,parent_phone,parent_email,address,status
STU001,John Doe,2010-05-15,Male,class1,section1,001,9876543210,john@example.com,Jane Doe,9876543211,jane@example.com,123 Main St,Active
STU002,Mary Smith,2010-03-20,Female,class1,section1,002,9876543212,mary@example.com,Bob Smith,9876543213,bob@example.com,456 Oak Ave,Active`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Download Template</h3>
              <p className="text-sm text-slate-600">
                Download the CSV template with required fields and sample data
              </p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Upload CSV File</h3>
              <p className="text-sm text-slate-600 mb-4">
                Select a CSV file containing student data to import
              </p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csvFile"
                />
                <label htmlFor="csvFile" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Click to select CSV file or drag and drop
                  </p>
                </label>
                
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-900">
                    <FileText className="w-4 h-4" />
                    {file.name}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFile(null)}
                      className="ml-2 p-1 h-auto"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {file && !results && (
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Processing..." : "Upload & Process"}
              </Button>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Import Results</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{results.total}</p>
                <p className="text-sm text-blue-600">Total Records</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{results.successful}</p>
                <p className="text-sm text-green-600">Successful</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{results.failed}</p>
                <p className="text-sm text-red-600">Failed</p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Import Errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.errors.map((error, index) => (
                      <li key={index}>Row {error.row}: {error.error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={onComplete}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Import
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setResults(null);
                  setUploadProgress(0);
                }}
              >
                Import More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}