import { apiClient } from './apiClient';

const studentService = {
  // Get all students with optional filtering
  getAllStudents: (params = {}) => {
    return apiClient.get('students/', { params });
  },

  // Get a specific student by ID
  getStudent: (id) => {
    return apiClient.get(`students/${id}/`);
  },

  // Create a new student
  createStudent: (studentData) => {
    return apiClient.post('students/', studentData);
  },

  // Update a student
  updateStudent: (id, studentData) => {
    return apiClient.put(`students/${id}/`, studentData);
  },

  // Delete a student
  deleteStudent: (id) => {
    return apiClient.delete(`students/${id}/`);
  },

  // Get active students
  getActiveStudents: () => {
    return apiClient.get('students/', { params: { is_active: true } });
  },

  // Get students by class
  getStudentsByClass: (classId) => {
    return apiClient.get('students/', { params: { current_class: classId } });
  },
};

export default studentService;