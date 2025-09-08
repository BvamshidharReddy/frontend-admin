import { apiClient } from './apiClient';

// Core integrations for file uploads and other utilities
export const Core = {
  // File upload integration
  UploadFile: async (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return apiClient.post('uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Generate signed URL for file uploads
  CreateFileSignedUrl: async (fileName, fileType, folder = 'uploads') => {
    return apiClient.post('uploads/signed-url/', {
      file_name: fileName,
      file_type: fileType,
      folder: folder,
    });
  },
  
  // Upload private file (requires authentication)
  UploadPrivateFile: async (file, folder = 'private') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('private', true);
    
    return apiClient.post('uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Send email integration
  SendEmail: async (emailData) => {
    return apiClient.post('notifications/email/', emailData);
  },
};

// Add LLM integration for chatbot
Core.InvokeLLM = async ({ prompt }) => {
  try {
    const response = await apiClient.post('ai/chat/', { prompt });
    return response.data.response;
  } catch (error) {
    console.error('Error invoking LLM:', error);
    return "I'm sorry, I'm having trouble processing your request right now.";
  }
};

// Extract data from uploaded file using AI
Core.ExtractDataFromUploadedFile = async ({ fileUrl, fileType, extractionType }) => {
  try {
    const response = await apiClient.post('ai/extract-data/', {
      file_url: fileUrl,
      file_type: fileType,
      extraction_type: extractionType
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting data from file:', error);
    throw new Error('Failed to extract data from the uploaded file');
  }
};

// Export individual integrations for convenience
export const UploadFile = Core.UploadFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;
export const InvokeLLM = Core.InvokeLLM;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const SendEmail = Core.SendEmail;






