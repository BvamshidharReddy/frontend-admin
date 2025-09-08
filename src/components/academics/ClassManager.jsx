import React, { useState, useEffect } from "react";
import { Class, Section, Teacher } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, Hash, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ClassForm from "./ClassForm";
import SectionForm from "./SectionForm";

export default function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classesData, sectionsData, teachersData] = await Promise.all([
        Class.list("-created_date"),
        Section.list(),
        Teacher.list()
      ]);
      setClasses(classesData);
      setSections(sectionsData);
      setTeachers(teachersData);
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      } else if (selectedClass) {
        // Reselect the class to refresh data
        const refreshedClass = classesData.find(c => c.id === selectedClass.id);
        setSelectedClass(refreshedClass || (classesData.length > 0 ? classesData[0] : null));
      }
    } catch (error) {
      console.error("Error loading academic data:", error);
    }
    setLoading(false);
  };
  
  const handleAddClass = async (classData) => {
    await Class.create(classData);
    setShowClassDialog(false);
    await loadData();
  };

  const handleEditClass = async (classData) => {
    await Class.update(editingClass.id, classData);
    setEditingClass(null);
    await loadData();
  };

  const handleDeleteClass = async (classId) => {
    if (confirm("This will delete the class and all its sections. Are you sure?")) {
      await Class.delete(classId);
      setSelectedClass(null);
      await loadData();
    }
  };

  const handleAddSection = async (sectionData) => {
    await Section.create({ ...sectionData, class_id: selectedClass.id });
    setShowSectionDialog(false);
    await loadData();
  };

  const handleEditSection = async (sectionData) => {
    await Section.update(editingSection.id, sectionData);
    setEditingSection(null);
    await loadData();
  };

  const handleDeleteSection = async (sectionId) => {
    if (confirm("Are you sure you want to delete this section?")) {
      await Section.delete(sectionId);
      await loadData();
    }
  };

  const filteredSections = selectedClass ? sections.filter(s => s.class_id === selectedClass.id) : [];

  return (
    <>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Classes List */}
        <div className="lg:col-span-4">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Classes</CardTitle>
              <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
                  <ClassForm teachers={teachers} onSubmit={handleAddClass} onCancel={() => setShowClassDialog(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                ) : (
                  classes.map(cls => (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClass(cls)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        selectedClass?.id === cls.id ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{cls.name}</p>
                          <p className="text-sm text-slate-500">{cls.stream}</p>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setEditingClass(cls);}}><Edit className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id);}}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections View */}
        <div className="lg:col-span-8">
          {loading && !selectedClass && <Skeleton className="h-96 w-full" />}
          {!loading && selectedClass && (
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Sections for {selectedClass.name}
                </CardTitle>
                <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="w-4 h-4 mr-2"/>Add Section</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>Add New Section</DialogTitle></DialogHeader>
                    <SectionForm classId={selectedClass.id} onSubmit={handleAddSection} onCancel={() => setShowSectionDialog(false)} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-6">
                {filteredSections.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredSections.map(section => (
                      <Card key={section.id} className="bg-slate-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-lg">{section.name}</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingSection(section)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteSection(section.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>Capacity: {section.capacity || 'N/A'}</span></div>
                            <div className="flex items-center gap-2"><Hash className="w-4 h-4" /><span>Room No: {section.room_no || 'N/A'}</span></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">No sections found for this class. Add one to get started.</p>
                )}
              </CardContent>
            </Card>
          )}
          {!loading && !selectedClass && (
            <Card className="flex items-center justify-center h-96 border-dashed">
              <p className="text-slate-500">Select a class to view sections</p>
            </Card>
          )}
        </div>
      </div>
      
      {/* Edit Dialogs */}
      <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Class</DialogTitle></DialogHeader>
          {editingClass && <ClassForm classData={editingClass} teachers={teachers} onSubmit={handleEditClass} onCancel={() => setEditingClass(null)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Section</DialogTitle></DialogHeader>
          {editingSection && <SectionForm sectionData={editingSection} classId={selectedClass?.id} onSubmit={handleEditSection} onCancel={() => setEditingSection(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}