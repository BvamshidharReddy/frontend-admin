import { authService, studentService, teacherService } from './index';

// Simple test function to verify API connection
const testApiConnection = async () => {
  console.log('Testing API connection...');
  
  try {
    // Test authentication
    console.log('Testing authentication...');
    const loginResponse = await authService.login('admin', 'admin123');
    console.log('Login successful:', loginResponse);
    
    // Test getting current user
    console.log('Testing get current user...');
    const userResponse = await authService.getCurrentUser();
    console.log('Current user:', userResponse.data);
    
    // Test getting students
    console.log('Testing get students...');
    const studentsResponse = await studentService.getAllStudents();
    console.log('Students:', studentsResponse.data);
    
    // Test getting teachers
    console.log('Testing get teachers...');
    const teachersResponse = await teacherService.getAllTeachers();
    console.log('Teachers:', teachersResponse.data);
    
    console.log('All API tests passed!');
    return true;
  } catch (error) {
    console.error('API test failed:', error.response?.data || error.message);
    return false;
  }
};

export default testApiConnection;