import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const chatService = {
  // Send a message to the chatbot
  sendMessage: async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history
  getChatHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Get available categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (category) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update a category
  updateCategory: async (id, category) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/categories/${id}`,
        category
      );
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

export default chatService;
