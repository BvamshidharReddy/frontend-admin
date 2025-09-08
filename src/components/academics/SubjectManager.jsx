import React, { useState, useEffect } from "react";
import { Subject, Class, Teacher } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Bookmark } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import SubjectForm from "./SubjectForm";

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjectsData, classesData, teachersData] = await Promise.all([
        Subject.list("-created_date"),
        Class.list(),
        Teacher.list(),
      ]);
      setSubjects(subjectsData);
      setClasses(classesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error loading subjects data:", error);
    }
    setLoading(false);
  };
  
  const handleAddSubject = async (subjectData) => {
    await Subject.create(subjectData);
    setShowSubjectDialog(false);
    await loadData();
  };

  const handleEditSubject = async (subjectData) => {
    await Subject.update(editingSubject.id, subjectData);
    setEditingSubject(null);
    await loadData();
  };

  const handleDeleteSubject = async (subjectId) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      await Subject.delete(subjectId);
      await loadData();
    }
  };
  
  const getClassName = (classId) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getTeacherName = (teacherId) => teachers.find(t => t.id === teacherId)?.name || 'N/A';

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Bookmark className="w-5 h-5"/>Subjects</CardTitle>
        <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Subject</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add New Subject</DialogTitle></DialogHeader>
            <SubjectForm classes={classes} teachers={teachers} onSubmit={handleAddSubject} onCancel={() => setShowSubjectDialog(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
              ))
            ) : (
              subjects.map(subject => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{getClassName(subject.class_id)}</TableCell>
                  <TableCell>{getTeacherName(subject.teacher_id)}</TableCell>
                  <TableCell><Badge variant="secondary">{subject.type}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingSubject(subject)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteSubject(subject.id)}><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Subject</DialogTitle></DialogHeader>
          {editingSubject && <SubjectForm subject={editingSubject} classes={classes} teachers={teachers} onSubmit={handleEditSubject} onCancel={() => setEditingSubject(null)} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}