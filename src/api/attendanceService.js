import { apiClient } from './apiClient';

const attendanceService = {
  // Get all attendance records with optional filtering
  getAllAttendance: (params = {}) => {
    return apiClient.get('attendance/', { params });
  },

  // Get attendance by ID
  getAttendance: (id) => {
    return apiClient.get(`attendance/${id}/`);
  },

  // Create new attendance record
  createAttendance: (attendanceData) => {
    return apiClient.post('attendance/', attendanceData);
  },

  // Create multiple attendance records at once
  createBulkAttendance: (attendanceDataArray) => {
    return apiClient.post('attendance/bulk/', attendanceDataArray);
  },

  // Update attendance record
  updateAttendance: (id, attendanceData) => {
    return apiClient.put(`attendance/${id}/`, attendanceData);
  },

  // Delete attendance record
  deleteAttendance: (id) => {
    return apiClient.delete(`attendance/${id}/`);
  },

  // Get attendance by student
  getAttendanceByStudent: (studentId, params = {}) => {
    return apiClient.get('attendance/', { 
      params: { 
        student: studentId,
        ...params 
      } 
    });
  },

  // Get attendance by date
  getAttendanceByDate: (date, params = {}) => {
    return apiClient.get('attendance/', { 
      params: { 
        date: date,
        ...params 
      } 
    });
  },

  // Get attendance by class
  getAttendanceByClass: (classId, params = {}) => {
    return apiClient.get('attendance/', { 
      params: { 
        class_subject__class: classId,
        ...params 
      } 
    });
  },
};

export default attendanceService;