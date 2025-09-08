
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Plus, Crown, Upload, Settings, Play, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const initialCourses = [
    { 
      id: 'C01', 
      title: 'Advanced Algebra', 
      description: 'Complete course covering advanced algebraic concepts',
      subject: 'Mathematics', 
      class: 'Grade 11', 
      lectures: 15, 
      published: true,
      enrolled_students: 28,
      completion_rate: 85
    },
    { 
      id: 'C02', 
      title: 'Thermodynamics', 
      description: 'Physics fundamentals of heat and energy transfer',
      subject: 'Physics', 
      class: 'Grade 12', 
      lectures: 22, 
      published: true,
      enrolled_students: 32,
      completion_rate: 92
    },
    { 
      id: 'C03', 
      title: 'Shakespearean Literature', 
      description: 'Analysis of Shakespeare\'s major works',
      subject: 'English', 
      class: 'Grade 10', 
      lectures: 12, 
      published: false,
      enrolled_students: 0,
      completion_rate: 0
    },
];

export default function ELearning() {
  const [courses, setCourses] = useState(initialCourses);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({ 
    title: '', 
    description: '',
    subject: '', 
    class: '', 
    lectures: '' 
  });
  
  // State for manage course dialog
  const [isManageCourseDialogOpen, setIsManageCourseDialogOpen] = useState(false);
  const [managingCourse, setManagingCourse] = useState(null);
  
  // State for upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const handleAddCourse = () => {
    if (!newCourseData.title || !newCourseData.subject || !newCourseData.class) {
      alert("Title, Subject, and Class are required.");
      return;
    }
    const newCourse = {
      id: `C${(courses.length + 1).toString().padStart(2, '0')}`,
      ...newCourseData,
      lectures: parseInt(newCourseData.lectures) || 0,
      published: false,
      enrolled_students: 0,
      completion_rate: 0
    };
    setCourses([...courses, newCourse]);
    setNewCourseData({ title: '', description: '', subject: '', class: '', lectures: '' });
    setIsAddCourseDialogOpen(false);
  };

  const handleManageCourse = (course) => {
    setManagingCourse({ ...course }); // Work with a copy
    setIsManageCourseDialogOpen(true);
  };

  const handleUpdateCourse = () => {
    if (!managingCourse) return;
    setCourses(courses.map(course => 
      course.id === managingCourse.id 
        ? managingCourse // Use the updated managingCourse from state
        : course
    ));
    setIsManageCourseDialogOpen(false);
    setManagingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== courseId));
      setIsManageCourseDialogOpen(false);
    }
  };

  const handleUploadContent = () => {
    if (!uploadFile) {
      alert("Please select a file to upload.");
      return;
    }
    
    // Simulate file upload
    setTimeout(() => {
      alert(`File "${uploadFile.name}" has been uploaded successfully!`);
      setIsUploadDialogOpen(false);
      setUploadFile(null);
    }, 1000);
  };

  const togglePublishStatus = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, published: !course.published }
        : course
    ));
    // Also update the course being managed in the dialog
    if (managingCourse && managingCourse.id === courseId) {
        setManagingCourse(prev => ({ ...prev, published: !prev.published }));
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                E-Learning Platform
                <Badge className="bg-amber-100 text-amber-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </h1>
              <p className="text-slate-600">Create, manage, and deliver online courses.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Upload Content</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Course Content</DialogTitle>
                        <DialogDescription>Upload videos, PDFs, or other materials for your courses.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                          <Label htmlFor="courseSelect">Select Course</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map(course => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="fileUpload">Choose File</Label>
                          <Input 
                            id="fileUpload"
                            type="file" 
                            accept=".pdf,.mp4,.pptx,.docx,.jpg,.png"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleUploadContent}
                          disabled={!uploadFile}
                        >
                          {uploadFile ? 'Upload File' : 'Select a file first'}
                        </Button>
                    </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Create New Course</span>
                    <span className="sm:hidden">New Course</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Add a new course to your e-learning platform.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="courseTitle">Course Title</Label>
                      <Input id="courseTitle" value={newCourseData.title} onChange={e => setNewCourseData({...newCourseData, title: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="courseDescription">Course Description</Label>
                      <Textarea id="courseDescription" value={newCourseData.description} onChange={e => setNewCourseData({...newCourseData, description: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="courseSubject">Subject</Label>
                      <Input id="courseSubject" value={newCourseData.subject} onChange={e => setNewCourseData({...newCourseData, subject: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="courseClass">Class</Label>
                      <Input id="courseClass" value={newCourseData.class} onChange={e => setNewCourseData({...newCourseData, class: e.target.value})} />
                    </div>
                     <div>
                      <Label htmlFor="courseLectures">Number of Lectures</Label>
                      <Input id="courseLectures" type="number" value={newCourseData.lectures} onChange={e => setNewCourseData({...newCourseData, lectures: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddCourse}>Create Course</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">My Courses</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Course Title</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Subject</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Class</TableHead>
                    <TableHead className="min-w-[80px] hidden lg:table-cell">Lectures</TableHead>
                    <TableHead className="min-w-[120px] hidden xl:table-cell">Students</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm md:text-base">{course.title}</p>
                          <p className="text-xs text-slate-500">{course.description}</p>
                          <div className="sm:hidden mt-1 flex flex-col gap-1">
                            <Badge variant="outline" className="text-xs w-fit">{course.subject}</Badge>
                            <span className="text-xs text-slate-500">{course.class} • {course.lectures} lectures</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm">{course.subject}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{course.class}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{course.lectures}</span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <span className="font-medium">{course.enrolled_students}</span>
                          <span className="text-slate-500 ml-1">enrolled</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleManageCourse(course)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Manage Course Dialog */}
        <Dialog open={isManageCourseDialogOpen} onOpenChange={setIsManageCourseDialogOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Manage Course: {managingCourse?.title}
              </DialogTitle>
              <DialogDescription>
                Edit course details, manage content, and track student progress.
              </DialogDescription>
            </DialogHeader>
            {managingCourse && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Course Details</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Course Title</Label>
                      <Input 
                        value={managingCourse.title}
                        onChange={(e) => setManagingCourse({...managingCourse, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input 
                        value={managingCourse.subject}
                        onChange={(e) => setManagingCourse({...managingCourse, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={managingCourse.description}
                      onChange={(e) => setManagingCourse({...managingCourse, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Class</Label>
                      <Input 
                        value={managingCourse.class}
                        onChange={(e) => setManagingCourse({...managingCourse, class: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Number of Lectures</Label>
                      <Input 
                        type="number"
                        value={managingCourse.lectures}
                        onChange={(e) => setManagingCourse({...managingCourse, lectures: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant={managingCourse.published ? "destructive" : "default"}
                      onClick={() => togglePublishStatus(managingCourse.id)}
                    >
                      {managingCourse.published ? 'Unpublish Course' : 'Publish Course'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteCourse(managingCourse.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Course
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Course Content</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Lecture Materials</p>
                            <p className="text-sm text-slate-500">{managingCourse.lectures} lectures configured</p>
                          </div>
                          <Button size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Add Content
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Enrolled Students</h3>
                      <Badge variant="outline">{managingCourse.enrolled_students} students</Badge>
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Course Progress</p>
                            <p className="text-sm text-slate-500">{managingCourse.completion_rate}% average completion</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            View Students
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsManageCourseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCourse}>
                    Save Changes
                  </Button>
                </div>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
