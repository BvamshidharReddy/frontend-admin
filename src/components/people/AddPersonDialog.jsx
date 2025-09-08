import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, GraduationCap, Briefcase } from 'lucide-react';
import StudentForm from '../students/StudentForm';
import TeacherForm from '../teachers/TeacherForm';
import StaffForm from './StaffForm';
import { Class, Section } from '@/api/entities';

export default function AddPersonDialog({ open, onOpenChange, onAdd }) {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPrerequisites();
    }
  }, [open]);

  const loadPrerequisites = async () => {
    setLoading(true);
    try {
      const [classesResponse, sectionsResponse] = await Promise.all([
        Class.list(),
        Section.list()
      ]);
      
      // Handle paginated response format
      const classesData = classesResponse?.data?.results || classesResponse?.results || classesResponse?.data || classesResponse;
      const sectionsData = sectionsResponse?.data?.results || sectionsResponse?.results || sectionsResponse?.data || sectionsResponse;
      
      setClasses(Array.isArray(classesData) ? classesData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
    } catch (error) {
      console.error("Error loading prerequisites:", error);
      setClasses([]);
      setSections([]);
    }
    setLoading(false);
  };

  const handleFormSubmit = async (data, type) => {
    await onAdd(data, type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a New Person</DialogTitle>
          <DialogDescription>
            Select the role of the person you want to add and fill in their details.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="student" className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student"><User className="w-4 h-4 mr-2" />Student</TabsTrigger>
            <TabsTrigger value="teacher"><GraduationCap className="w-4 h-4 mr-2" />Teacher</TabsTrigger>
            <TabsTrigger value="staff"><Briefcase className="w-4 h-4 mr-2" />Staff</TabsTrigger>
          </TabsList>
          <TabsContent value="student" className="mt-4">
            {loading ? <p>Loading class data...</p> : (
              <StudentForm 
                classes={classes}
                sections={sections}
                onSubmit={(data) => handleFormSubmit(data, 'student')}
                onCancel={() => onOpenChange(false)}
              />
            )}
          </TabsContent>
          <TabsContent value="teacher" className="mt-4">
             <TeacherForm 
                onSubmit={(data) => handleFormSubmit(data, 'teacher')}
                onCancel={() => onOpenChange(false)}
              />
          </TabsContent>
          <TabsContent value="staff" className="mt-4">
             <StaffForm 
                onSubmit={(data) => handleFormSubmit(data, 'staff')}
                onCancel={() => onOpenChange(false)}
              />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}