// Export all API services
import authService, { apiClient } from './authService';
import studentService from './studentService';
import teacherService from './teacherService';
import attendanceService from './attendanceService';
import gradesService from './gradesService';

export {
  apiClient,
  authService,
  studentService,
  teacherService,
  attendanceService,
  gradesService,
};