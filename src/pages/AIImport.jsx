import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Crown, 
  Upload, 
  Users, 
  GraduationCap, 
  DollarSign, 
  FileText,
  History,
  Settings,
  Zap
} from 'lucide-react';
import AIBulkImportDialog from '../components/ai-import/AIBulkImportDialog';
import ImportHistory from '../components/ai-import/ImportHistory';

const IMPORT_MODULES = [
  {
    id: 'students',
    title: 'Students & Parents',
    description: 'Import student records with parent/guardian information',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    formats: 'CSV, Excel, PDF, Images'
  },
  {
    id: 'teachers',
    title: 'Teachers & Staff',
    description: 'Import teacher profiles and staff records',
    icon: GraduationCap,
    color: 'from-green-500 to-green-600',
    formats: 'CSV, Excel, PDF'
  },
  {
    id: 'fees',
    title: 'Fee Structure',
    description: 'Import fee plans and payment records',
    icon: DollarSign,
    color: 'from-orange-500 to-orange-600',
    formats: 'CSV, Excel, PDF'
  },
  {
    id: 'exams',
    title: 'Exam Schedules',
    description: 'Import examination timetables and plans',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    formats: 'CSV, Excel, PDF'
  }
];

export default function AIImport() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedImportType, setSelectedImportType] = useState('students');

  const handleImportClick = (moduleId) => {
    setSelectedImportType(moduleId);
    setShowImportDialog(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              AI Bulk Import
              <Badge className="bg-amber-100 text-amber-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </h1>
            <p className="text-slate-600">Streamline data entry with intelligent OCR and automated data processing</p>
          </div>
        </div>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-6">
            {/* Updated card grid section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {IMPORT_MODULES.map((module) => (
                <Card
                  key={module.id}
                  className="border-0 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-col flex-grow">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center shadow-lg mb-4`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-semibold text-slate-900 mb-2">{module.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                      <div className="text-xs text-slate-500 mb-4">
                        Supports: {module.formats}
                      </div>

                      {/* Button */}
                      <div className="mt-auto">
                        <Button
                          className="w-full flex items-center justify-center whitespace-normal text-sm px-2 py-2"
                          onClick={() => handleImportClick(module.id)}
                        >
                          <Upload className="w-4 h-4 mr-2 shrink-0" />
                          <span className="truncate">{`Import ${module.title}`}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Cpu className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">OCR Text Extraction</h3>
                    <p className="text-sm text-slate-600">Advanced optical character recognition to extract text from scanned documents, images, and PDFs with high accuracy.</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Smart Data Mapping</h3>
                    <p className="text-sm text-slate-600">Intelligent algorithms automatically map extracted data to the correct database fields, reducing manual work.</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Data Validation</h3>
                    <p className="text-sm text-slate-600">Automatic validation, formatting, and error correction to ensure data quality and consistency.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ImportHistory />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>AI Import Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">OCR Accuracy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">High Accuracy Mode</p>
                          <p className="text-sm text-slate-600">Better accuracy but slower processing</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-correct Names</p>
                          <p className="text-sm text-slate-600">Automatically correct common name misspellings</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Data Validation Rules</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Strict Email Validation</p>
                          <p className="text-sm text-slate-600">Reject records with invalid email formats</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Phone Number Formatting</p>
                          <p className="text-sm text-slate-600">Auto-format phone numbers to standard format</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>

                  <Button className="mt-6">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AIBulkImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          importType={selectedImportType}
        />
      </div>
    </div>
  );
}
