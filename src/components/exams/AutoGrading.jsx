import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ScanLine, 
  Crown, 
  Upload, 
  Cpu, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/api/integrations';

export default function AutoGrading({ exam, students, onGradingComplete }) {
  const [processing, setProcessing] = useState(false);
  const [uploadedSheets, setUploadedSheets] = useState([]);
  const [gradingResults, setGradingResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSheetUpload = async (event) => {
    const files = Array.from(event.target.files);
    setProcessing(true);
    setProgress(0);

    try {
      const processedSheets = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 50);
        
        // Upload file
        const { file_url } = await UploadFile({ file });
        
        // Extract answer sheet data using OCR
        const extractionResult = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: "object",
            properties: {
              student_id: { type: "string" },
              answers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question_no: { type: "number" },
                    answer: { type: "string" },
                    marked_option: { type: "string" }
                  }
                }
              }
            }
          }
        });

        if (extractionResult.status === 'success') {
          processedSheets.push({
            file_name: file.name,
            url: file_url,
            data: extractionResult.output,
            status: 'extracted'
          });
        } else {
          processedSheets.push({
            file_name: file.name,
            url: file_url,
            data: null,
            status: 'error',
            error: extractionResult.details
          });
        }
      }

      setUploadedSheets(processedSheets);
      setProgress(100);
      
      // Auto-start grading if extraction was successful
      if (processedSheets.some(sheet => sheet.status === 'extracted')) {
        await handleAutoGrading(processedSheets);
      }

    } catch (error) {
      console.error('Error processing sheets:', error);
    }
    setProcessing(false);
  };

  const handleAutoGrading = async (sheets) => {
    setProcessing(true);
    setProgress(0);

    try {
      const gradingPrompt = `Grade these answer sheets for the exam "${exam.name}" (${exam.subject_id}).

Exam Details:
- Total Marks: ${exam.max_marks}
- Pass Marks: ${exam.pass_marks}

Answer Key and Marking Scheme:
[Include the correct answers and marking criteria here]

Student Responses:
${JSON.stringify(sheets.filter(s => s.status === 'extracted').map(s => s.data), null, 2)}

For each student, provide:
1. Marks for each question
2. Total marks obtained
3. Grade (A+, A, B+, B, C, D, F)
4. Pass/Fail status
5. Feedback comments
6. Areas for improvement

Also provide class statistics:
- Average marks
- Highest/lowest scores
- Grade distribution
- Question-wise analysis (which questions were most difficult)`;

      const gradingResult = await InvokeLLM({
        prompt: gradingPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            student_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  student_id: { type: "string" },
                  question_marks: { type: "array", items: { type: "number" } },
                  total_marks: { type: "number" },
                  grade: { type: "string" },
                  pass_status: { type: "string" },
                  feedback: { type: "string" },
                  improvements: { type: "array", items: { type: "string" } }
                }
              }
            },
            class_statistics: {
              type: "object",
              properties: {
                average_marks: { type: "number" },
                highest_score: { type: "number" },
                lowest_score: { type: "number" },
                pass_percentage: { type: "number" },
                grade_distribution: { type: "object" },
                difficult_questions: { type: "array", items: { type: "number" } }
              }
            }
          }
        }
      });

      setGradingResults({
        ...gradingResult,
        processed_at: new Date().toISOString(),
        exam_id: exam.id
      });

    } catch (error) {
      console.error('Auto-grading failed:', error);
    }
    setProcessing(false);
  };

  const handlePublishResults = () => {
    if (gradingResults && onGradingComplete) {
      onGradingComplete(gradingResults);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-blue-600" />
            Auto Answer Sheet Grading
            <Badge className="bg-amber-100 text-amber-800">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Sheets</TabsTrigger>
              <TabsTrigger value="results" disabled={!gradingResults}>Grading Results</TabsTrigger>
              <TabsTrigger value="analytics" disabled={!gradingResults}>Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-lg">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  onChange={handleSheetUpload}
                  className="hidden"
                  id="sheet-upload"
                />
                <label htmlFor="sheet-upload" className="cursor-pointer">
                  <ScanLine className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-700">Upload Answer Sheets</h3>
                  <p className="text-slate-600 mt-2">
                    Drop scanned answer sheets here or click to browse
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Supports PDF, JPG, PNG, TIFF formats
                  </p>
                  <Button className="mt-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </label>
              </div>

              {processing && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Cpu className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="font-medium">Processing Answer Sheets...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-slate-600 mt-2">
                      Scanning and extracting answers using AI OCR technology
                    </p>
                  </CardContent>
                </Card>
              )}

              {uploadedSheets.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Processed Sheets ({uploadedSheets.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {uploadedSheets.map((sheet, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {sheet.status === 'extracted' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">{sheet.file_name}</p>
                              <p className="text-sm text-slate-600">
                                {sheet.status === 'extracted' 
                                  ? `Extracted ${sheet.data?.answers?.length || 0} answers`
                                  : `Error: ${sheet.error}`
                                }
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {gradingResults && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Grading Results</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                      <Button size="sm" onClick={handlePublishResults}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Publish Results
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {gradingResults.class_statistics?.average_marks?.toFixed(1) || 0}
                        </p>
                        <p className="text-sm text-slate-600">Average Marks</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {gradingResults.class_statistics?.pass_percentage?.toFixed(1) || 0}%
                        </p>
                        <p className="text-sm text-slate-600">Pass Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {gradingResults.class_statistics?.highest_score || 0}
                        </p>
                        <p className="text-sm text-slate-600">Highest Score</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {gradingResults.student_results?.length || 0}
                        </p>
                        <p className="text-sm text-slate-600">Papers Graded</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Individual Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {gradingResults.student_results?.map((result, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{result.student_id}</p>
                              <p className="text-sm text-slate-600">{result.feedback}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{result.total_marks}/{exam.max_marks}</p>
                              <Badge className={
                                result.pass_status === 'Pass' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }>
                                {result.grade} - {result.pass_status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {gradingResults && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Class Performance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Grade Distribution</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(gradingResults.class_statistics?.grade_distribution || {}).map(([grade, count]) => (
                              <div key={grade} className="text-center p-2 bg-slate-50 rounded">
                                <p className="font-bold">{count}</p>
                                <p className="text-sm text-slate-600">{grade}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Most Difficult Questions</h4>
                          <div className="flex gap-2">
                            {gradingResults.class_statistics?.difficult_questions?.map((qNo, index) => (
                              <Badge key={index} variant="outline">
                                Question {qNo}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}