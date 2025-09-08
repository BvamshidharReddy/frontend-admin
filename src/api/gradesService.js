import { apiClient } from './apiClient';

const gradesService = {
  // Get all exam types
  getAllExamTypes: () => {
    return apiClient.get('exam-types/');
  },

  // Get exam type by ID
  getExamType: (id) => {
    return apiClient.get(`exam-types/${id}/`);
  },

  // Create new exam type
  createExamType: (examTypeData) => {
    return apiClient.post('exam-types/', examTypeData);
  },

  // Update exam type
  updateExamType: (id, examTypeData) => {
    return apiClient.put(`exam-types/${id}/`, examTypeData);
  },

  // Delete exam type
  deleteExamType: (id) => {
    return apiClient.delete(`exam-types/${id}/`);
  },

  // Get all exams
  getAllExams: (params = {}) => {
    return apiClient.get('exams/', { params });
  },

  // Get exam by ID
  getExam: (id) => {
    return apiClient.get(`exams/${id}/`);
  },

  // Create new exam
  createExam: (examData) => {
    return apiClient.post('exams/', examData);
  },

  // Update exam
  updateExam: (id, examData) => {
    return apiClient.put(`exams/${id}/`, examData);
  },

  // Delete exam
  deleteExam: (id) => {
    return apiClient.delete(`exams/${id}/`);
  },

  // Get all grades
  getAllGrades: (params = {}) => {
    return apiClient.get('grades/', { params });
  },

  // Get grade by ID
  getGrade: (id) => {
    return apiClient.get(`grades/${id}/`);
  },

  // Create new grade
  createGrade: (gradeData) => {
    return apiClient.post('grades/', gradeData);
  },

  // Create multiple grades at once
  createBulkGrades: (gradesDataArray) => {
    return apiClient.post('grades/bulk/', gradesDataArray);
  },

  // Update grade
  updateGrade: (id, gradeData) => {
    return apiClient.put(`grades/${id}/`, gradeData);
  },

  // Delete grade
  deleteGrade: (id) => {
    return apiClient.delete(`grades/${id}/`);
  },

  // Get grades by student
  getGradesByStudent: (studentId, params = {}) => {
    return apiClient.get('grades/', { 
      params: { 
        student: studentId,
        ...params 
      } 
    });
  },

  // Get grades by exam
  getGradesByExam: (examId, params = {}) => {
    return apiClient.get('grades/', { 
      params: { 
        exam: examId,
        ...params 
      } 
    });
  },
};

export default gradesService;