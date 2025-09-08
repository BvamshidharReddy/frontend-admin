import { apiClient } from './apiClient';

// Entity service factory function
const createEntityService = (endpoint) => {
  return {
    getAll: (params = {}) => apiClient.get(endpoint, { params }),
    getById: (id) => apiClient.get(`${endpoint}${id}/`),
    create: (data) => apiClient.post(endpoint, data),
    update: (id, data) => apiClient.put(`${endpoint}${id}/`, data),
    partialUpdate: (id, data) => apiClient.patch(`${endpoint}${id}/`, data),
    delete: (id) => apiClient.delete(`${endpoint}${id}/`),
  };
};

// Create services for each entity
export const Student = createEntityService('students/');
export const Class = createEntityService('classes/');
export const Section = createEntityService('sections/');
export const Teacher = createEntityService('teachers/');
export const Staff = createEntityService('staff/');
export const Subject = createEntityService('subjects/');
export const Attendance = createEntityService('attendance/');
export const Exam = createEntityService('exams/');
export const ExamResult = createEntityService('exam-results/');
// Fee service - placeholder for future implementation
export const Fee = {
  list: () => Promise.resolve({ data: [] }),
  getAll: () => Promise.resolve({ data: [] }),
  getById: () => Promise.resolve({ data: null }),
  create: () => Promise.resolve({ data: null }),
  update: () => Promise.resolve({ data: null }),
  partialUpdate: () => Promise.resolve({ data: null }),
  delete: () => Promise.resolve({ data: null }),
};
export const Announcement = createEntityService('announcements/');

// Add list method to all entities for backward compatibility
Object.keys({ Student, Class, Section, Teacher, Staff, Subject, Attendance, Exam, ExamResult, Fee, Announcement }).forEach(entityName => {
  const entity = { Student, Class, Section, Teacher, Staff, Subject, Attendance, Exam, ExamResult, Fee, Announcement }[entityName];
  if (entity) {
    entity.list = entity.getAll;
  }
});

// Auth service
export const User = createEntityService('users/');
User.login = async (credentials) => {
  const response = await fetch('http://localhost:8000/api-token-auth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};
User.register = (userData) => apiClient.post('users/', userData);
User.getCurrentUser = () => apiClient.get('users/me/');
User.updateProfile = (id, data) => apiClient.patch(`users/${id}/`, data);
User.list = User.getAll;