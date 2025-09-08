import { apiClient } from './apiClient';

const teacherService = {
  // Get all teachers with optional filtering
  getAllTeachers: (params = {}) => {
    return apiClient.get('teachers/', { params });
  },

  // Get a specific teacher by ID
  getTeacher: (id) => {
    return apiClient.get(`teachers/${id}/`);
  },

  // Create a new teacher
  createTeacher: (teacherData) => {
    return apiClient.post('teachers/', teacherData);
  },

  // Update a teacher
  updateTeacher: (id, teacherData) => {
    return apiClient.put(`teachers/${id}/`, teacherData);
  },

  // Delete a teacher
  deleteTeacher: (id) => {
    return apiClient.delete(`teachers/${id}/`);
  },

  // Get active teachers
  getActiveTeachers: () => {
    return apiClient.get('teachers/', { params: { is_active: true } });
  },

  // Get class teachers
  getClassTeachers: () => {
    return apiClient.get('teachers/', { params: { is_class_teacher: true } });
  },
};

export default teacherService;