
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Cpu, Crown, ArrowRight, AlertTriangle, CheckCircle, FileWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const importSchemas = {
  students: { name: 'Students', requiredFields: ['name', 'admission_no', 'class_id', 'section_id'], headers: 'name,admission_no,class_id,section_id,dob,gender,address,phone,email,parent_name,parent_phone,parent_email' },
  parents: { name: 'Parents', requiredFields: ['parent_name', 'parent_phone', 'student_admission_no'], headers: 'parent_name,parent_phone,parent_email,student_admission_no' },
  teachers: { name: 'Teachers', requiredFields: ['name', 'employee_id', 'department', 'phone'], headers: 'name,employee_id,department,phone,email,designation,qualification' },
  staff: { name: 'Staff', requiredFields: ['name', 'employee_id', 'designation'], headers: 'name,employee_id,designation,department,phone,email' },
};

// Dummy CSV parser
const parseCSV = (content) => {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const records = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
      return obj;
    }, {});
  });
  return records.filter(r => Object.values(r).some(val => val !== '')); // Filter out truly empty lines
};

const exportToCsv = (filename, rows) => {
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

export default function BulkImportDialog({ open, onOpenChange, embedded = false }) {
  const [step, setStep] = useState('select'); // select, validating, correction, segregating, confirmation
  const [importType, setImportType] = useState('students');
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState([]);
  const [segregationResult, setSegregationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setStep('select');
    setFile(null);
    setRecords([]);
    setErrors([]);
    setSegregationResult(null);
    setIsLoading(false);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const content = await selectedFile.text();
      const parsedRecords = parseCSV(content);
      setRecords(parsedRecords);
    }
  };

  const handleDownloadTemplate = (type) => {
    const headers = importSchemas[type].headers;
    exportToCsv(`${type}_template.csv`, headers);
  };

  const validateAndProcessFile = () => {
    setIsLoading(true);
    const validationErrors = [];
    const schema = importSchemas[importType].requiredFields;
    
    records.forEach((record, index) => {
      const missingFields = schema.filter(field => !record[field]);
      if (missingFields.length > 0) {
        // Create a copy of the record for correction to avoid direct mutation of `records`
        const errorRecordCopy = { ...record };
        validationErrors.push({ ...errorRecordCopy, originalIndex: index, missingFields });
      }
    });

    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      setStep('correction');
    } else {
      handleSegregation(records);
    }
    setIsLoading(false);
  };

  const handleCorrection = (originalIndex, field, value) => {
    const updatedErrors = errors.map(errorRecord => {
        if (errorRecord.originalIndex === originalIndex) {
            const newMissingFields = errorRecord.missingFields.filter(f => f !== field);
            return {
                ...errorRecord,
                [field]: value,
                missingFields: value ? newMissingFields : errorRecord.missingFields // Remove from missing if value is provided
            };
        }
        return errorRecord;
    });
    setErrors(updatedErrors);
  };

  const saveCorrectionsAndProceed = () => {
    const stillHasErrors = errors.some(e => e.missingFields.length > 0);
    if (stillHasErrors) {
      alert("Please fix all missing fields before proceeding.");
      return;
    }
    
    // Update main records with corrected data
    const updatedRecords = [...records];
    errors.forEach(errorRecord => {
        updatedRecords[errorRecord.originalIndex] = { ...errorRecord }; // Overwrite with corrected data
    });
    
    handleSegregation(updatedRecords);
  };
  
  const handleSegregation = (recordsToSegregate) => {
    setStep('segregating');
    setIsLoading(true);

    const results = { students: [], teachers: [], staff: [], parents: [], unclassified: [] };
    
    recordsToSegregate.forEach(record => {
      // Prioritize by most specific fields first to avoid misclassification
      if (importType === 'students' && record.admission_no) results.students.push(record);
      else if (importType === 'parents' && record.parent_phone) results.parents.push(record);
      else if (importType === 'teachers' && record.employee_id && record.department) results.teachers.push(record);
      else if (importType === 'staff' && record.employee_id && record.designation) results.staff.push(record);
      else if (record.admission_no) results.students.push(record); // Default to students if specific fields present
      else if (record.parent_phone) results.parents.push(record);
      else if (record.department) results.teachers.push(record);
      else if (record.designation) results.staff.push(record);
      else results.unclassified.push(record); // Catch-all for unclassified
    });

    setSegregationResult(results);
    setTimeout(() => {
      setIsLoading(false);
      setStep('confirmation');
    }, 1500);
  };

  const completeImport = async () => {
    setIsLoading(true);
    // Here you would call bulkCreate for each segregated type
    // e.g. await Student.bulkCreate(segregationResult.students);
    console.log("Importing data:", segregationResult);
    
    setTimeout(() => {
        setIsLoading(false);
        resetState();
        onOpenChange(false);
    }, 1000);
  };
  
  const wasSegregated = useMemo(() => {
      if (!segregationResult) return false;
      // Check if any other category has records, indicating actual segregation beyond the selected type
      const otherCategoriesCount = Object.entries(segregationResult).reduce((sum, [key, arr]) => {
          if (key !== importType && key !== 'unclassified') { // Don't count records specifically for the chosen type or unclassified
              return sum + arr.length;
          }
          return sum;
      }, 0);
      return otherCategoriesCount > 0 || (segregationResult.unclassified?.length > 0 && Object.keys(importSchemas).length > 1);
  }, [segregationResult, importType]);

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Standard CSV Import</h3>
                <p className="text-sm text-slate-600 mb-4">Select the type of data to import and upload a CSV file.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Import Type</label>
                        <Select value={importType} onValueChange={setImportType}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {Object.entries(importSchemas).map(([key, {name}]) => (
                                    <SelectItem key={key} value={key}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Upload File</label>
                        <Input type="file" accept=".csv" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownloadTemplate('students')}>Students</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadTemplate('parents')}>Parents</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadTemplate('teachers')}>Teachers</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadTemplate('staff')}>Staff</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" onClick={validateAndProcessFile} disabled={!file || isLoading} className="w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    {isLoading ? "Processing..." : "Process File"}
                  </Button>
                </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-slate-800">AI-Powered Import</h3>
                <Badge className="bg-amber-100 text-amber-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                Upload scanned documents, PDFs, or images. Our AI will automatically extract and populate the data.
                </p>
                <Link to={createPageUrl("AIImport")} onClick={() => !embedded && onOpenChange(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                    <Cpu className="w-4 h-4 mr-2" />
                    Use AI Import
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                </Link>
            </div>
          </div>
        );

      case 'correction':
        return (
            <div className="space-y-4">
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Found {errors.length} records with missing required fields. Please correct them below.
                    </AlertDescription>
                </Alert>
                <div className="max-h-[40vh] overflow-y-auto border rounded-lg">
                    <Table>
                        <TableHeader className="sticky top-0 bg-slate-50">
                            <TableRow>
                                {Object.keys(errors[0] || {}).filter(k => k !== 'originalIndex' && k !== 'missingFields').map(key => (
                                    <TableHead key={key} className="text-xs sm:text-sm">{key}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {errors.map((error) => (
                                <TableRow key={error.originalIndex}>
                                    {Object.keys(error).filter(k => k !== 'originalIndex' && k !== 'missingFields').map(key => (
                                        <TableCell key={key}>
                                            <Input
                                                defaultValue={error[key]}
                                                onChange={(e) => handleCorrection(error.originalIndex, key, e.target.value)}
                                                className={`text-sm ${error.missingFields.includes(key) && !error[key] ? "border-red-500" : ""}`}
                                                placeholder={`Enter ${key}`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end">
                    <Button onClick={saveCorrectionsAndProceed} className="w-full sm:w-auto">
                        Save Corrections & Proceed
                    </Button>
                </div>
            </div>
        );

    case 'segregating':
        return (
            <div className="text-center p-8 space-y-4">
                <Cpu className="w-12 h-12 mx-auto text-blue-600 animate-pulse" />
                <h3 className="text-lg font-semibold">Segregating Data...</h3>
                <p className="text-slate-600">Our AI is intelligently categorizing each record for you.</p>
            </div>
        );

    case 'confirmation':
        return (
            <div className="space-y-4">
                {wasSegregated && (
                    <Alert className="mb-4 bg-blue-50 border-blue-200">
                        <FileWarning className="h-4 w-4 text-blue-700" />
                        <AlertDescription className="text-blue-800">
                        Your given data has been allocated to the respective credentials. Please select the proper option next time.
                        </AlertDescription>
                    </Alert>
                )}
                <Alert className="mb-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        Validation and segregation complete. Review the allocation below.
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(segregationResult).map(([key, value]) => value.length > 0 && (
                        <div key={key} className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                            <span className="font-medium capitalize text-sm sm:text-base">{key}:</span>
                            <span className="font-bold text-lg">{value.length} records</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                     <Button onClick={completeImport} disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Importing..." : "Complete Import"}
                    </Button>
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  if (embedded) {
    return (
      <div className="space-y-4">
        {renderContent()}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetState(); onOpenChange(isOpen); }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bulk Import People</DialogTitle>
          <DialogDescription>
            Import multiple records at once using a CSV file.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] px-1">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
