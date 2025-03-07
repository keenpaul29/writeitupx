import axios from 'axios';

// Get AI writing suggestions
export const getWritingSuggestions = async (text, context) => {
  try {
    const response = await axios.post('/api/ai/suggestions', { text, context });
    return response.data.suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please sign in again.');
    }
    throw new Error(error.response?.data?.error || 'Failed to get suggestions');
  }
}; 