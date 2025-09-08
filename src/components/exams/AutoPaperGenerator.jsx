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
  Cpu, 
  Crown, 
  Wand2, 
  FileText, 
  Download, 
  Eye, 
  Settings,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';

export default function AutoPaperGenerator({ subjects, classes, onGenerate }) {
  const [generating, setGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [template, setTemplate] = useState({
    subject: '',
    class: '',
    exam_type: 'Unit Test',
    duration: 60,
    total_marks: 100,
    difficulty_distribution: {
      easy: 40,
      medium: 40,
      hard: 20
    },
    question_types: {
      mcq: 20,
      short_answer: 40,
      long_answer: 40
    },
    topics: '',
    special_instructions: ''
  });

  const handleGeneratePaper = async () => {
    setGenerating(true);
    try {
      const prompt = `Generate a comprehensive ${template.exam_type} question paper for ${template.subject} (Class ${template.class}).

Requirements:
- Duration: ${template.duration} minutes
- Total Marks: ${template.total_marks}
- Difficulty Distribution: Easy ${template.difficulty_distribution.easy}%, Medium ${template.difficulty_distribution.medium}%, Hard ${template.difficulty_distribution.hard}%
- Question Types: MCQ ${template.question_types.mcq}%, Short Answer ${template.question_types.short_answer}%, Long Answer ${template.question_types.long_answer}%
- Topics to cover: ${template.topics}
- Special Instructions: ${template.special_instructions}

Generate:
1. A well-structured question paper with proper sections
2. Marking scheme for each question
3. Time allocation suggestions
4. Answer key for objective questions
5. Sample answers for subjective questions

Format the output as a complete, ready-to-print question paper with proper formatting, instructions, and professional layout.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            paper_title: { type: "string" },
            instructions: { type: "array", items: { type: "string" } },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section_name: { type: "string" },
                  instructions: { type: "string" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question_no: { type: "number" },
                        question_text: { type: "string" },
                        marks: { type: "number" },
                        difficulty: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correct_answer: { type: "string" },
                        sample_answer: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            marking_scheme: { type: "string" },
            time_allocation: { type: "string" }
          }
        }
      });

      setGeneratedPaper({
        ...result,
        template: template,
        generated_at: new Date().toISOString(),
        id: Date.now().toString()
      });

    } catch (error) {
      console.error('Error generating paper:', error);
      alert('Failed to generate question paper. Please try again.');
    }
    setGenerating(false);
  };

  const handleSavePaper = () => {
    if (generatedPaper && onGenerate) {
      onGenerate(generatedPaper);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            AI Question Paper Generator
            <Badge className="bg-amber-100 text-amber-800">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template">Template Setup</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedPaper}>Preview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Select value={template.subject} onValueChange={(v) => setTemplate({...template, subject: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={template.class} onValueChange={(v) => setTemplate({...template, class: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Exam Type</Label>
                  <Select value={template.exam_type} onValueChange={(v) => setTemplate({...template, exam_type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unit Test">Unit Test</SelectItem>
                      <SelectItem value="Mid Term">Mid Term</SelectItem>
                      <SelectItem value="Final">Final Exam</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    value={template.duration} 
                    onChange={(e) => setTemplate({...template, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Total Marks</Label>
                  <Input 
                    type="number" 
                    value={template.total_marks} 
                    onChange={(e) => setTemplate({...template, total_marks: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Card className="bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Difficulty Distribution (%)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Easy</Label>
                    <Input 
                      type="number" 
                      value={template.difficulty_distribution.easy}
                      onChange={(e) => setTemplate({
                        ...template, 
                        difficulty_distribution: {
                          ...template.difficulty_distribution,
                          easy: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Medium</Label>
                    <Input 
                      type="number" 
                      value={template.difficulty_distribution.medium}
                      onChange={(e) => setTemplate({
                        ...template, 
                        difficulty_distribution: {
                          ...template.difficulty_distribution,
                          medium: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hard</Label>
                    <Input 
                      type="number" 
                      value={template.difficulty_distribution.hard}
                      onChange={(e) => setTemplate({
                        ...template, 
                        difficulty_distribution: {
                          ...template.difficulty_distribution,
                          hard: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Question Types (%)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">MCQ</Label>
                    <Input 
                      type="number" 
                      value={template.question_types.mcq}
                      onChange={(e) => setTemplate({
                        ...template, 
                        question_types: {
                          ...template.question_types,
                          mcq: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Short Answer</Label>
                    <Input 
                      type="number" 
                      value={template.question_types.short_answer}
                      onChange={(e) => setTemplate({
                        ...template, 
                        question_types: {
                          ...template.question_types,
                          short_answer: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Long Answer</Label>
                    <Input 
                      type="number" 
                      value={template.question_types.long_answer}
                      onChange={(e) => setTemplate({
                        ...template, 
                        question_types: {
                          ...template.question_types,
                          long_answer: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label>Topics to Cover</Label>
                <Textarea 
                  placeholder="List the topics/chapters to include in the question paper..."
                  value={template.topics}
                  onChange={(e) => setTemplate({...template, topics: e.target.value})}
                />
              </div>

              <div>
                <Label>Special Instructions</Label>
                <Textarea 
                  placeholder="Any special instructions for the AI (e.g., include diagrams, focus on practical applications, etc.)"
                  value={template.special_instructions}
                  onChange={(e) => setTemplate({...template, special_instructions: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Save Template</Button>
                <Button 
                  onClick={handleGeneratePaper} 
                  disabled={generating || !template.subject || !template.class}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 mr-2" />
                      Generate Paper
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {generatedPaper && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{generatedPaper.paper_title}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button size="sm" onClick={handleSavePaper}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Paper
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-white border">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">{generatedPaper.paper_title}</h2>
                        <p className="text-slate-600">Time: {template.duration} minutes | Max Marks: {template.total_marks}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Instructions:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {generatedPaper.instructions?.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>

                      {generatedPaper.sections?.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-6">
                          <h4 className="font-semibold text-lg mb-2">
                            Section {String.fromCharCode(65 + sectionIndex)}: {section.section_name}
                          </h4>
                          {section.instructions && (
                            <p className="text-sm text-slate-600 mb-3">{section.instructions}</p>
                          )}
                          
                          <div className="space-y-4">
                            {section.questions?.map((question, qIndex) => (
                              <div key={qIndex} className="border-l-2 border-slate-200 pl-4">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium">
                                    Q{question.question_no}. {question.question_text}
                                  </p>
                                  <Badge variant="outline" className="ml-2">
                                    {question.marks} marks
                                  </Badge>
                                </div>
                                
                                {question.options && question.options.length > 0 && (
                                  <div className="ml-4 space-y-1">
                                    {question.options.map((option, oIndex) => (
                                      <p key={oIndex} className="text-sm">
                                        {String.fromCharCode(97 + oIndex)}) {option}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold mb-2">Marking Scheme & Time Allocation:</h4>
                        <p className="text-sm text-slate-600">{generatedPaper.marking_scheme}</p>
                        <p className="text-sm text-slate-600 mt-2">{generatedPaper.time_allocation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-700">No Generated Papers Yet</h3>
                <p className="mt-2">Generated question papers will appear here for future reference.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}