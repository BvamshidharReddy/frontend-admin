import React, { useState } from "react";
import {
  BookOpen,
  Bookmark,
  Settings,
  ArrowUp,
  ArrowDown,
  Crown,
  Star,
  Upload,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Pencil,
  Trash,
  School,
  Users,
  Clock,
  FileText,
  FileUp,
  X,
  Calendar
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function ClassManager({ grades, setGrades }) {
  const [blocks] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [selectedGrade, setSelectedGrade] = useState(grades[0]?.name);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showImportStudentsDialog, setShowImportStudentsDialog] = useState(false);
  const [classesList, setClassesList] = useState({});
  const [formData, setFormData] = useState({ grade: "", section: "", block: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [currentGradeForModal, setCurrentGradeForModal] = useState("");
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [editGradeIndex, setEditGradeIndex] = useState(null);
  const [gradeFormData, setGradeFormData] = useState({ name: "", level: "" });

  const [studentCounts] = useState({
    "Kindergarten": { "A": 18, "B": 20 },
    "Grade 1": { "A": 25, "B": 23, "C": 27 },
    "Grade 2": { "A": 24, "B": 26, "C": 22 },
    "Grade 3": { "A": 28, "B": 25, "C": 24 },
    "Grade 4": { "A": 26, "B": 29 },
    "Grade 5": { "A": 30, "B": 28, "C": 25 },
    "Grade 6": { "A": 32, "B": 30, "C": 29 },
    "Grade 7": { "A": 35, "B": 33 },
    "Grade 8": { "A": 31, "B": 34, "C": 30 },
    "Grade 9": { "A": 40, "B": 38, "C": 39 },
    "Grade 10": { "A": 42, "B": 40, "C": 41 }
  });

  const [settings, setSettings] = useState({
    showBlocks: true,
    showSections: true,
    enableRoomAllocation: false,
    enableCapacityTracking: false,
    enableTeacherAssignment: false,
    enableAIClassOptimization: false,
  });

  const currentPlan = "basic";

  const handleAddClass = () => {
    if (!formData.block) {
      alert("Please select a block!");
      return;
    }

    setClassesList((prev) => ({
      ...prev,
      [selectedGrade]: {
        ...(prev[selectedGrade] || {}),
        [selectedSection]: [
          ...(prev[selectedGrade]?.[selectedSection] || []),
          { block: formData.block },
        ],
      },
    }));
    setFormData({ grade: "", section: "", block: "" });
    setIsModalOpen(false);
  };
  
  const handleOpenModal = (grade, section) => {
    setSelectedGrade(grade);
    setSelectedSection(section);
    setFormData({ grade, section, block: "" });
    setIsModalOpen(true);
  };

  const handleBulkImport = () => {
    if (currentPlan === 'basic') {
      setShowUpgradeDialog(true);
    } else {
      setShowBulkImportDialog(true);
    }
  };

  const handleImportStudents = () => {
    setShowImportStudentsDialog(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };
  
  const getPlanBadge = (requiredPlan) => {
    const badges = {
      standard: <Badge className="bg-purple-100 text-purple-800 text-xs flex items-center gap-1"><Star className="w-3 h-3" />Standard</Badge>,
      premium: <Badge className="bg-amber-100 text-amber-800 text-xs flex items-center gap-1"><Crown className="w-3 h-3" />Premium</Badge>
    };
    return badges[requiredPlan] || null;
  };

  const isFeatureAvailable = (requiredPlan) => {
    const planHierarchy = { basic: 1, standard: 2, premium: 3 };
    return planHierarchy[currentPlan] >= planHierarchy[requiredPlan];
  };

  const handleToggle = (key) => {
    const featurePlanRequirements = {
      showBlocks: 'basic',
      showSections: 'basic',
      enableRoomAllocation: 'standard',
      enableCapacityTracking: 'standard', 
      enableTeacherAssignment: 'standard',
      enableAIClassOptimization: 'premium'
    };

    const requiredPlan = featurePlanRequirements[key];
    
    if (isFeatureAvailable(requiredPlan)) {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setShowUpgradeDialog(true);
    }
  };

  const handleOpenAddSectionModal = (gradeName) => {
    setCurrentGradeForModal(gradeName);
    setNewSectionName("");
    setSelectedBlock("");
    setIsAddSectionModalOpen(true);
  };
  
  const handleSaveSection = () => {
    if (!newSectionName.trim() || !selectedBlock) {
      alert("Section name and block are required!");
      return;
    }
    const sectionKey = newSectionName.trim();
    if (classesList[currentGradeForModal] && classesList[currentGradeForModal][sectionKey]) {
      alert(`Section "${sectionKey}" already exists for ${currentGradeForModal}.`);
      return;
    }

    setClassesList(prev => ({
      ...prev,
      [currentGradeForModal]: {
        ...(prev[currentGradeForModal] || {}),
        [sectionKey]: [{ block: selectedBlock }]
      }
    }));

    setIsAddSectionModalOpen(false);
    setSelectedBlock("");
    setNewSectionName("");
  };

  const handleDeleteSection = (gradeName, sectionName) => {
    if (window.confirm(`Are you sure you want to delete section "${sectionName}" from ${gradeName}?`)) {
      const newGradeClasses = { ...classesList[gradeName] };
      delete newGradeClasses[sectionName];
      setClassesList(prev => ({ ...prev, [gradeName]: newGradeClasses }));
    }
  };

  const handleAddGrade = () => {
    setEditGradeIndex(null);
    setGradeFormData({ name: "", level: "" });
    setIsGradeModalOpen(true);
  };

  const handleEditGrade = (index) => {
    setEditGradeIndex(index);
    setGradeFormData(grades[index]);
    setIsGradeModalOpen(true);
  };

  const handleDeleteGrade = (index) => {
    const gradeName = grades[index].name;
    if (window.confirm(`Are you sure you want to delete ${gradeName}?`)) {
      const newClassesList = { ...classesList };
      delete newClassesList[gradeName];
      setClassesList(newClassesList);

      const newGrades = grades.filter((_, i) => i !== index);
      setGrades(newGrades);

      if (selectedGrade === gradeName) {
        setSelectedGrade(newGrades[0]?.name || null);
      }
    }
  };

  const handleSaveGrade = () => {
    if (!gradeFormData.name || !gradeFormData.level) {
      alert("Please fill all fields!");
      return;
    }

    const oldName = editGradeIndex !== null ? grades[editGradeIndex].name : null;
    const newGrades = [...grades];
    
    if (editGradeIndex !== null) {
      newGrades[editGradeIndex] = gradeFormData;
    } else {
      if (grades.some(g => g.name === gradeFormData.name)) {
        alert("A grade with this name already exists!");
        return;
      }
      newGrades.push(gradeFormData);
      setClassesList(prev => ({ ...prev, [gradeFormData.name]: {} }));
    }
    setGrades(newGrades);

    if (editGradeIndex !== null && oldName !== gradeFormData.name) {
      const newClassesList = { ...classesList };
      if (newClassesList[oldName]) {
        newClassesList[gradeFormData.name] = newClassesList[oldName];
        delete newClassesList[oldName];
      }
      setClassesList(newClassesList);

      if (selectedGrade === oldName) {
        setSelectedGrade(gradeFormData.name);
      }
    }

    setIsGradeModalOpen(false);
  };
  
  const filteredGrades = grades.filter((grade) =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Classes & Sections</h2>
            <p className="text-sm text-slate-600">Manage grades, sections, and classroom allocation</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleImportStudents}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            Import Students to Class
          </Button>
          <Button
            onClick={handleBulkImport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Bulk Import Classes
            {currentPlan === 'basic' && <Crown className="w-3 h-3 text-amber-500" />}
          </Button>
          <Button
            onClick={handleSettingsClick}
            variant="outline"
            className="p-2 rounded-lg shadow"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Grades
            </h3>
            <Button
              onClick={handleAddGrade}
              size="sm"
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm shadow"
            >
              + Add Grade
            </Button>
          </div>
          <Input
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="space-y-2">
            {filteredGrades.map((grade, index) => (
              <div key={grade.name}>
                <div
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedGrade === grade.name
                      ? "bg-blue-100 text-blue-800 font-semibold border-blue-400"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedGrade(grade.name)}
                >
                  <div>
                    <h4 className="text-base font-medium">{grade.name}</h4>
                    <p className="text-xs text-slate-500">{grade.level}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-slate-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditGrade(index)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteGrade(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {selectedGrade ? (
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedGrade} Overview</h3>
                    <p className="text-sm text-slate-600">Sections, blocks and student distribution</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleOpenAddSectionModal(selectedGrade)}
                  size="sm"
                  className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm shadow"
                >
                  + Add Section
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {Object.keys(classesList[selectedGrade] || {}).length}
                      </div>
                      <div className="text-sm text-blue-600">Total Sections</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {Object.values(classesList[selectedGrade] || {}).flat().length}
                      </div>
                      <div className="text-sm text-green-600">Total Blocks</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {Object.keys(studentCounts[selectedGrade] || {}).reduce((total, section) => 
                          total + (studentCounts[selectedGrade][section] || 0), 0
                        )}
                      </div>
                      <div className="text-sm text-purple-600">Total Students</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 mb-4">Sections & Distribution</h4>
                {Object.keys(classesList[selectedGrade] || {}).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(classesList[selectedGrade]).map((sectionName) => (
                      <Card key={sectionName} className="bg-slate-50 border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-slate-900">Section {sectionName}</h5>
                              <p className="text-xs text-slate-500">
                                {(classesList[selectedGrade][sectionName] || []).length} block(s) assigned
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                               <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenModal(selectedGrade, sectionName)}
                                    title="Add block to section"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSection(selectedGrade, sectionName)}
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                title="Delete section"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mb-3 p-2 bg-white rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Students</span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {studentCounts[selectedGrade]?.[sectionName] || 0} enrolled
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-medium text-slate-600">Assigned Blocks:</span>
                            {(classesList[selectedGrade]?.[sectionName] || []).length > 0 ? (
                              (classesList[selectedGrade]?.[sectionName] || []).map((cls, blockIndex) => (
                                <div key={blockIndex} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                                  <span className="font-medium">Block {cls.block}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                      if (window.confirm("Remove this block assignment?")) {
                                        const newBlocks = classesList[selectedGrade][sectionName].filter((_, idx) => idx !== blockIndex);
                                        setClassesList(prev => ({ 
                                          ...prev, 
                                          [selectedGrade]: { 
                                            ...prev[selectedGrade], 
                                            [sectionName]: newBlocks 
                                          } 
                                        }));
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500">No blocks assigned. Add one using the '+' button.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                    <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No sections found for {selectedGrade}</p>
                    <p className="text-sm text-slate-400">Click "Add Section" to get started</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <School className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Select a grade to manage its sections and blocks</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Block/Room to {selectedGrade} - {selectedSection}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={formData.block}
              onValueChange={(value) => setFormData({ ...formData, block: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Block" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map((b) => (
                  <SelectItem key={b} value={b}>Block {b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddClass} className="w-full">
              Add Block
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Academics Settings</DialogTitle>
            <DialogDescription>
              Enable or disable features for class management. Upgrades may be required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="showSections">Enable Sections</Label>
                <p className="text-xs text-slate-500">Organize grades into sections like A, B, C.</p>
              </div>
              <Switch id="showSections" checked={settings.showSections} onCheckedChange={() => handleToggle('showSections')} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="showBlocks">Enable Blocks/Rooms</Label>
                <p className="text-xs text-slate-500">Assign specific rooms or blocks to sections.</p>
              </div>
              <Switch id="showBlocks" checked={settings.showBlocks} onCheckedChange={() => handleToggle('showBlocks')} />
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${!isFeatureAvailable('standard') ? 'bg-slate-50 opacity-70' : ''}`}>
              <div>
                <Label htmlFor="enableRoomAllocation" className="flex items-center gap-2">
                  Room Allocation {getPlanBadge('standard')}
                </Label>
                <p className="text-xs text-slate-500">Manage room details and availability.</p>
              </div>
              <Switch id="enableRoomAllocation" checked={settings.enableRoomAllocation} onCheckedChange={() => handleToggle('enableRoomAllocation')} disabled={!isFeatureAvailable('standard')} />
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${!isFeatureAvailable('standard') ? 'bg-slate-50 opacity-70' : ''}`}>
              <div>
                <Label htmlFor="enableCapacityTracking" className="flex items-center gap-2">
                  Capacity Tracking {getPlanBadge('standard')}
                </Label>
                <p className="text-xs text-slate-500">Track student capacity per class.</p>
              </div>
              <Switch id="enableCapacityTracking" checked={settings.enableCapacityTracking} onCheckedChange={() => handleToggle('enableCapacityTracking')} disabled={!isFeatureAvailable('standard')} />
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${!isFeatureAvailable('standard') ? 'bg-slate-50 opacity-70' : ''}`}>
              <div>
                <Label htmlFor="enableTeacherAssignment" className="flex items-center gap-2">
                  Teacher Assignment {getPlanBadge('standard')}
                </Label>
                <p className="text-xs text-slate-500">Assign class teachers to sections.</p>
              </div>
              <Switch id="enableTeacherAssignment" checked={settings.enableTeacherAssignment} onCheckedChange={() => handleToggle('enableTeacherAssignment')} disabled={!isFeatureAvailable('standard')} />
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${!isFeatureAvailable('premium') ? 'bg-slate-50 opacity-70' : ''}`}>
              <div>
                <Label htmlFor="enableAIClassOptimization" className="flex items-center gap-2">
                  AI Class Optimization {getPlanBadge('premium')}
                </Label>
                <p className="text-xs text-slate-500">Use AI to suggest optimal class arrangements.</p>
              </div>
              <Switch id="enableAIClassOptimization" checked={settings.enableAIClassOptimization} onCheckedChange={() => handleToggle('enableAIClassOptimization')} disabled={!isFeatureAvailable('premium')} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkImportDialog} onOpenChange={setShowBulkImportDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Bulk Import Classes & Sections
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple grades, sections, and classroom assignments at once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
              <p className="text-slate-600 mb-4">or click to browse</p>
              <Button variant="outline">Choose File</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Expected CSV Format:</h4>
                <div className="text-sm text-slate-600 font-mono bg-slate-50 p-3 rounded">
                  grade_name,grade_level,section_name,block_name<br/>
                  Grade 1,Primary,A,Block A<br/>
                  Grade 1,Primary,B,Block B<br/>
                  Grade 2,Primary,A,Block C
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Sample Data:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 15 Grades imported</li>
                  <li>• 45 Sections created</li>
                  <li>• 120 Blocks assigned</li>
                  <li>• Processing time: ~2 minutes</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkImportDialog(false)}>Cancel</Button>
            <Button>Import Classes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Upgrade Required
            </DialogTitle>
            <DialogDescription>This feature is not available on your current plan. Please upgrade to access it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Unlock More Features</h3>
              <p className="text-sm text-slate-600 mb-4">
                Upgrade your plan to unlock more powerful features and streamline your school management.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Standard Plan</span>
                  </div>
                  <p className="text-sm text-purple-700">Advanced class management, room allocation, capacity tracking</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-900">Premium Plan</span>
                  </div>
                  <p className="text-sm text-amber-700">AI Bulk Import, auto-optimization, and all advanced features</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Maybe Later
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-amber-600">
              <Link to={createPageUrl("Settings") + '?tab=billing'}>Upgrade Now</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportStudentsDialog} onOpenChange={setShowImportStudentsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              Import Students to a Class
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk assign students to a specific grade and section.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <Label>Academic Year</Label>
                  <Select defaultValue="2024-25">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label>Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
                <div>
                  <Label>Section</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
                <div>
                  <Label>Block</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map(s => <SelectItem key={s} value={s}>Block {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your student CSV file here</p>
              <p className="text-slate-600 mb-4">or click to browse</p>
              <Button variant="outline">Choose File</Button>
            </div>
            <div>
              <h4 className="font-medium">Expected CSV Format:</h4>
              <div className="text-sm text-slate-600 font-mono bg-slate-50 p-3 rounded mt-2">
                admission_no,student_name,dob,gender,roll_no
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportStudentsDialog(false)}>Cancel</Button>
            <Button>Import Students</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editGradeIndex !== null ? "Edit Grade" : "Add New Grade"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Grade Name (e.g., Grade 1, Class X)"
              value={gradeFormData.name}
              onChange={(e) => setGradeFormData({ ...gradeFormData, name: e.target.value })}
            />
            <Input
              placeholder="Level (e.g., Primary, Middle School)"
              value={gradeFormData.level}
              onChange={(e) => setGradeFormData({ ...gradeFormData, level: e.target.value })}
            />
            <Button onClick={handleSaveGrade} className="w-full">
              Save Grade
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSectionModalOpen} onOpenChange={setIsAddSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section to {currentGradeForModal}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>First, Select Block</Label>
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block} value={block}>Block {block}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedBlock && (
              <div>
                <Label>Section Name</Label>
                <Select value={newSectionName} onValueChange={setNewSectionName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((section) => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {newSectionName && (
                  <div className="mt-2">
                    <Label>Custom Section Name (Optional)</Label>
                    <Input
                      placeholder={`Edit section name (currently: ${newSectionName})`}
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddSectionModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSection} disabled={!selectedBlock || !newSectionName}>
                Add Section
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubjectManager({ grades }) {
  const [subjects, setSubjects] = useState([
    { id: "1", name: "Mathematics", code: "MATH", grade: "Grade 10", teacher: "Dr. Smith", type: "Core", max_marks: 100, pass_marks: 33 },
    { id: "2", name: "Physics", code: "PHY", grade: "Grade 10", teacher: "Prof. Johnson", type: "Core", max_marks: 100, pass_marks: 33 },
    { id: "3", name: "Chemistry", code: "CHEM", grade: "Grade 10", teacher: "Dr. Brown", type: "Core", max_marks: 100, pass_marks: 33 },
    { id: "4", name: "English", code: "ENG", grade: "Grade 9", teacher: "Ms. Wilson", type: "Core", max_marks: 100, pass_marks: 33 },
    { id: "5", name: "Computer Science", code: "CS", grade: "Grade 10", teacher: "Mr. Davis", type: "Elective", max_marks: 100, pass_marks: 33 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Subjects & Curriculum</h2>
            <p className="text-sm text-slate-600">Manage subjects, syllabus progress, and timetables</p>
          </div>
        </div>
      </div>

      <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle>Subject Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 px-2">Subject</th>
                  <th className="pb-2 px-2">Code</th>
                  <th className="pb-2 px-2">Grade</th>
                  <th className="pb-2 px-2">Teacher</th>
                  <th className="pb-2 px-2">Type</th>
                  <th className="pb-2 px-2">Marks</th>
                  <th className="pb-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => (
                  <tr key={subject.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium">{subject.name}</td>
                    <td className="py-3 px-2">{subject.code}</td>
                    <td className="py-3 px-2">{subject.grade}</td>
                    <td className="py-3 px-2">{subject.teacher}</td>
                    <td className="py-3 px-2">
                      <Badge className={subject.type === 'Core' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {subject.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{subject.max_marks} / {subject.pass_marks}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Academics() {
  const [grades, setGrades] = useState([
    { name: "Kindergarten", level: "Pre-Primary" },
    { name: "Grade 1", level: "Primary" },
    { name: "Grade 2", level: "Primary" },
    { name: "Grade 3", level: "Primary" },
    { name: "Grade 4", level: "Primary" },
    { name: "Grade 5", level: "Primary" },
    { name: "Grade 6", level: "Middle School" },
    { name: "Grade 7", level: "Middle School" },
    { name: "Grade 8", level: "Middle School" },
    { name: "Grade 9", level: "Secondary" },
    { name: "Grade 10", level: "Secondary" },
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Academics</h1>
            <p className="text-slate-600">Manage classes, subjects, and academic structure</p>
          </div>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[500px]">
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <School className="w-4 h-4" />
              <span>Classes & Sections</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Subjects & Syllabus</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="classes" className="mt-6">
            <ClassManager grades={grades} setGrades={setGrades} />
          </TabsContent>
          <TabsContent value="subjects" className="mt-6">
            <SubjectManager grades={grades} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}