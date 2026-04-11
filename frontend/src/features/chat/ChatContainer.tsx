import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';
import ErrorAlert from './ErrorAlert';
import { useChat } from '../context/ChatContext';
import { createMessage, validateMessage, handleApiError } from "../utils/helpers";
import chatService from "../services/chatService";
import SettingsModal from "./SettingsModal";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    "How to apply as a new student?",
    "What are the requirements for enrolling in college?",
    "Where do I access my grades?",
    "How do I reset my student portal password?",
    "Can I pay my tuition in installments?"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (title, msgs) => {

    const newHistory = [
      { title, messages: msgs },
      ...chatHistory
    ];

    setChatHistory(newHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));

  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    const userMessage = createMessage(text, 'user', messages.length + 1);
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    clearError();

    try {

      const response = await chatService.sendMessage(text);

      const botMessage = createMessage(
        response.reply || 'Sorry, I could not process your message.',
        'bot',
        messages.length + 2
      );

      const finalMessages = [...updatedMessages, botMessage];

      setMessages(finalMessages);

      if (messages.length === 1) {
        saveHistory(text, finalMessages);
      }

    } catch (err) {

      const errorMsg = handleApiError(err);
      setErrorMessage(errorMsg);

    } finally {

      setIsLoading(false);

    }

  };

  const handleNewChat = () => {

    if (messages.length > 1) {
      saveHistory(messages[1]?.text || "New Chat", messages);
    }

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

  const loadChatHistory = (chat) => {
    setMessages(chat.messages);
  };

  const hasOnlyInitialBotMessage =
    messages.length === 1 && messages[0]?.sender === 'bot';

  return (

    <div className="flex h-screen overflow-hidden">

      <ErrorAlert message={error} onClose={clearError} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        openSettings={() => setSettingsOpen(true)}
        chatHistory={chatHistory}
        onSelectHistory={loadChatHistory}
      />

      <div className="flex-1 flex flex-col">

        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <MessageList messages={messages} isLoading={isLoading} />

        {/* Suggested Questions */}
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

        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />

        <div ref={messagesEndRef} />

      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>

  );

};

export default ChatContainer;