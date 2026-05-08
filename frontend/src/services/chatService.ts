/// <reference types="node" />
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const chatService = {
  // Send message
  sendMessage: async (
    message: string,
    userId: number,
    sessionId?: number | null
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message,
        userId,
        sessionId,
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history
  getChatHistory: async (
    userId: number,
    sessionId?: number | null
  ) => {
    try {
      let url = `${API_BASE_URL}/chat/history?userId=${userId}`;

      if (sessionId) {
        url += `&sessionId=${sessionId}`;
      }

      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  createCategory: async (category: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        category
      );

      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: number, category: any) => {
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

  deleteCategory: async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

export default chatService;