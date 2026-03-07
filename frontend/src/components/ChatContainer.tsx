import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';
import ErrorAlert from './ErrorAlert';
import { useChat } from '../context/ChatContext';
import { createMessage, validateMessage, handleApiError } from "../utils/helpers";
import chatService from "../services/chatService";

const ChatContainer = () => {
  const { 
    messages, 
    setMessages, 
    isLoading, 
    setIsLoading, 
    error, 
    setErrorMessage, 
    clearError 
  } = useChat();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 💬 Suggested questions for the empty state
  const suggestedQuestions = [
    "How to apply as a new student?",
    "What are the requirements for enrolling in college?",
    "Where do I access my grades?",
    "How do I reset my student portal password?",
    "Can I pay my tuition in installments?"
  ];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load categories for the sidebar (optional but useful)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await chatService.getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Initial bot message on first load
  useEffect(() => {
    const initialMessage = {
      id: 1,
      text: "Hello! 👋 I'm your chatbot assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [setMessages]);

  const handleSendMessage = async (text: string) => {
    if (!validateMessage(text)) {
      setErrorMessage('Please enter a valid message.');
      return;
    }

    // Add user message
    const userMessage = createMessage(text, 'user', messages.length + 1);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    clearError();

    try {
      // Call the actual API
      const response = await chatService.sendMessage(text);
      const botMessage = createMessage(
        response.reply || 'Sorry, I could not process your message.',
        'bot',
        messages.length + 2
      );
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setErrorMessage(errorMsg);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! 👋 I'm your chatbot assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setSelectedCategory(null);
  };

  // 👉 Only show suggestion chips when it's just the initial bot message
  const hasOnlyInitialBotMessage =
    messages.length === 1 && messages[0]?.sender === 'bot';

  return (
    <div className="flex h-screen overflow-hidden">
      <ErrorAlert message={error} onClose={clearError} />
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Messages List */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Suggested questions under greeting */}
        {hasOnlyInitialBotMessage && (
          <div className="px-8 mt-2 mb-4">
            <p className="text-center text-gray-500 text-sm mb-3">
              You can start by asking one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="
                    bg-indigo-50 hover:bg-indigo-100
                    text-sm px-4 py-2 rounded-full
                    transition-colors shadow-sm
                  "
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
