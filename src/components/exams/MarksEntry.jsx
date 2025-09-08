import React, { useState, useEffect } from "react";
import { ExamResult } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function MarksEntry({ exam, students, onComplete }) {
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], marks_obtained: value } }));
  };
  
  const handleAbsentChange = (studentId, isAbsent) => {
    setMarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], is_absent: isAbsent, marks_obtained: isAbsent ? 0 : prev[studentId]?.marks_obtained }}));
  };

  const handleSaveMarks = async () => {
    setLoading(true);
    const recordsToSave = Object.entries(marks).map(([studentId, data]) => ({
      exam_id: exam.id,
      student_id: studentId,
      marks_obtained: data.is_absent ? 0 : Number(data.marks_obtained || 0),
      is_absent: data.is_absent || false,
    }));

    try {
      // Ideal: bulkCreate or bulkUpsert
      for(const record of recordsToSave) {
        // Here we should check if a record exists and update it. For now, create.
        await ExamResult.create(record);
      }
      alert("Marks saved successfully!");
      onComplete();
    } catch (error) {
      console.error("Failed to save marks", error);
      alert("Error saving marks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p>Class: <strong>{students[0]?.class_id}</strong> | Subject: <strong>{exam.subject_id}</strong> | Max Marks: <strong>{exam.max_marks}</strong></p>
      <div className="max-h-[60vh] overflow-y-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Marks Obtained</TableHead>
              <TableHead>Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.roll_no}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    max={exam.max_marks}
                    min="0"
                    value={marks[student.id]?.marks_obtained || ''}
                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                    disabled={marks[student.id]?.is_absent}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`absent-${student.id}`}
                      checked={marks[student.id]?.is_absent || false}
                      onCheckedChange={(checked) => handleAbsentChange(student.id, checked)}
                    />
                    <Label htmlFor={`absent-${student.id}`}>Mark as Absent</Label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveMarks} disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Save Marks"}</Button>
      </div>
    </div>
  );
}