import axios from 'axios';

// Get all letters
export const getLetters = async () => {
  try {
    const response = await axios.get('/api/letters');
    return response.data;
  } catch (error) {
    console.error('Error fetching letters:', error);
    throw error;
  }
};

// Get a single letter by ID
export const getLetter = async (id) => {
  try {
    const response = await axios.get(`/api/letters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching letter ${id}:`, error);
    throw error;
  }
};

// Create a new letter
export const createLetter = async (letterData) => {
  try {
    const response = await axios.post('/api/letters', letterData);
    return response.data;
  } catch (error) {
    console.error('Error creating letter:', error);
    throw error;
  }
};

// Update an existing letter
export const updateLetter = async (id, letterData) => {
  try {
    const response = await axios.put(`/api/letters/${id}`, letterData);
    return response.data;
  } catch (error) {
    console.error(`Error updating letter ${id}:`, error);
    throw error;
  }
};

// Delete a letter
export const deleteLetter = async (id) => {
  try {
    const response = await axios.delete(`/api/letters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting letter ${id}:`, error);
    throw error;
  }
};

// Save letter to Google Drive
export const saveLetterToDrive = async (id, content) => {
  try {
    const response = await axios.post(`/api/letters/${id}/save-to-drive`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error saving letter ${id} to Google Drive:`, error);
    throw error;
  }
}; 