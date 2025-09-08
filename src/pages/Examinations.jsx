import React, { useState, useEffect } from 'react';
import { Exam, ExamResult, Class, Subject, Student } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FileText, Eye, Award, Cpu, ScanLine, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamForm from "../components/exams/ExamForm";
import MarksEntry from "../components/exams/MarksEntry";
import AutoPaperGenerator from "../components/exams/AutoPaperGenerator";
import AutoGrading from "../components/exams/AutoGrading";

export default function Examinations() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [marksEntryExam, setMarksEntryExam] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [examsData, classesData, subjectsData, studentsData] = await Promise.all([
      Exam.list("-date"),
      Class.list(),
      Subject.list(),
      Student.list()
    ]);
    setExams(examsData);
    setClasses(classesData);
    setSubjects(subjectsData);
    setStudents(studentsData);
    setLoading(false);
  };
  
  const handleAddExam = async (examData) => {
    await Exam.create(examData);
    setShowExamDialog(false);
    await loadData();
  };

  const handleEditExam = async (examData) => {
    await Exam.update(editingExam.id, examData);
    setEditingExam(null);
    await loadData();
  };

  const handleDeleteExam = async (examId) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      await Exam.delete(examId);
      await loadData();
    }
  };
  
  const getClassName = (id) => classes.find(c => c.id === id)?.name;
  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name;
  
  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Examinations</h1>
              <p className="text-slate-600">Manage exam schedules, results, and AI-powered tools</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="schedule">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="schedule" className="flex items-center gap-2 p-2 sm:p-3">
              <FileText className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Schedule & Results</span>
            </TabsTrigger>
            <TabsTrigger value="ai_papers" className="flex items-center gap-2 p-2 sm:p-3">
              <Cpu className="w-4 h-4" />
              <span className="text-xs sm:text-sm">AI Question Papers</span>
              <Badge className="ml-1 bg-amber-100 text-amber-800"><Crown className="w-3 h-3"/></Badge>
            </TabsTrigger>
            <TabsTrigger value="ai_grading" className="flex items-center gap-2 p-2 sm:p-3">
              <ScanLine className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Auto-Grading</span>
              <Badge className="ml-1 bg-amber-100 text-amber-800"><Crown className="w-3 h-3"/></Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="mt-4 md:mt-6">
            <div className="flex justify-end mb-4">
              <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Schedule Exam</span>
                    <span className="sm:hidden">New Exam</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Schedule New Exam</DialogTitle></DialogHeader>
                  <ExamForm classes={classes} subjects={subjects} onSubmit={handleAddExam} onCancel={() => setShowExamDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Exam Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Exam</TableHead>
                        <TableHead className="min-w-[100px] hidden sm:table-cell">Class</TableHead>
                        <TableHead className="min-w-[120px] hidden md:table-cell">Subject</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exams.map(exam => (
                        <TableRow key={exam.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm md:text-base">{exam.name}</p>
                              <div className="sm:hidden mt-1 flex flex-col gap-1">
                                <Badge variant="outline" className="text-xs w-fit">{getClassName(exam.class_id)}</Badge>
                                <Badge variant="outline" className="text-xs w-fit">{getSubjectName(exam.subject_id)}</Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm">{getClassName(exam.class_id)}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm">{getSubjectName(exam.subject_id)}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{new Date(exam.date).toLocaleDateString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-xs">{exam.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setMarksEntryExam(exam)} className="text-xs px-2">
                                <Award className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Marks</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingExam(exam)} className="text-xs px-2">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 text-xs px-2" onClick={() => handleDeleteExam(exam.id)}>
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai_papers" className="mt-4 md:mt-6">
            <AutoPaperGenerator 
              subjects={subjects} 
              classes={classes} 
              onGenerate={(paper) => {
                console.log('Generated paper:', paper);
              }}
            />
          </TabsContent>
          
          <TabsContent value="ai_grading" className="mt-4 md:mt-6">
            <AutoGrading 
              exam={marksEntryExam} 
              students={students.filter(s => marksEntryExam && s.class_id === marksEntryExam.class_id)}
              onGradingComplete={(results) => {
                console.log('Grading results:', results);
                setMarksEntryExam(null);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editingExam} onOpenChange={() => setEditingExam(null)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Exam</DialogTitle></DialogHeader>
          {editingExam && <ExamForm exam={editingExam} classes={classes} subjects={subjects} onSubmit={handleEditExam} onCancel={() => setEditingExam(null)} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!marksEntryExam} onOpenChange={() => setMarksEntryExam(null)}>
        <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Marks Entry for {marksEntryExam?.name}</DialogTitle></DialogHeader>
          {marksEntryExam && <MarksEntry exam={marksEntryExam} students={students.filter(s => s.class_id === marksEntryExam.class_id)} onComplete={() => setMarksEntryExam(null)}/>}
        </DialogContent>
      </Dialog>
    </div>
  );
}