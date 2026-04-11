import React, { createContext, useContext, useState, useCallback } from "react";

export type ChatMessage = {
  id?: string | number;
  [key: string]: any;
};

export type ChatContextType = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  selectedCategory: any;
  setSelectedCategory: React.Dispatch<React.SetStateAction<any>>;

  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;

  error: string | null;
  setErrorMessage: (errorMsg: string | null) => void;
  clearError: () => void;

  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

// Context starts as undefined, and we enforce usage inside provider
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const setErrorMessage = useCallback((errorMsg: string | null) => {
    setError(errorMsg);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ChatContextType = {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
    setCategories,
    error,
    setErrorMessage,
    clearError,
    addMessage,
    clearMessages,
    user,
    setUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};