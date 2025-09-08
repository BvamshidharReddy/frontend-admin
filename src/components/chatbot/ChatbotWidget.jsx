import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { apiClient } from '@/api/apiClient';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Medha, your AI assistant. You can ask me questions or tell me where to go, like 'go to students'.",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check for navigation commands
      const lowerCaseInput = inputValue.toLowerCase();
      if (lowerCaseInput.includes('go to') || lowerCaseInput.includes('navigate to')) {
        const pages = [
          { name: 'dashboard', url: createPageUrl('Dashboard') },
          { name: 'students', url: createPageUrl('Students') },
          { name: 'teachers', url: createPageUrl('Teachers') },
          { name: 'attendance', url: createPageUrl('Attendance') },
          { name: 'grades', url: createPageUrl('Grades') },
          { name: 'courses', url: createPageUrl('Courses') },
          { name: 'exams', url: createPageUrl('Exams') },
          { name: 'fees', url: createPageUrl('Fees') },
          { name: 'settings', url: createPageUrl('Settings') }
        ];

        for (const page of pages) {
          if (lowerCaseInput.includes(page.name)) {
            const botResponse = {
              id: messages.length + 2,
              text: `Navigating to ${page.name}...`,
              sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
            setTimeout(() => {
              navigate(page.url);
              setIsOpen(false);
            }, 1000);
            setIsLoading(false);
            return;
          }
        }
      }

      // Simple response logic (replace with actual API call when available)
      let botResponse = {
        id: messages.length + 2,
        text: getSimpleResponse(inputValue),
        sender: 'bot'
      };

      // Simulate API delay
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Simple response function (replace with actual AI when backend is ready)
  const getSimpleResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return 'Hello! How can I help you today?';
    } else if (lowerInput.includes('help')) {
      return 'I can help you navigate the system, answer questions about students, teachers, or school operations. Try asking something specific!';
    } else if (lowerInput.includes('student') && (lowerInput.includes('add') || lowerInput.includes('create'))) {
      return 'To add a new student, go to the Students page and click the "Add Student" button in the top right corner.';
    } else if (lowerInput.includes('attendance')) {
      return 'You can manage attendance from the Attendance page. You can mark attendance for a class or view attendance reports there.';
    } else if (lowerInput.includes('exam') || lowerInput.includes('test')) {
      return 'Exams can be managed from the Exams page. You can create new exams, schedule them, and record results there.';
    } else if (lowerInput.includes('fee') || lowerInput.includes('payment')) {
      return 'Fee management is available on the Fees page. You can view pending payments, record new payments, and generate receipts.';
    } else if (lowerInput.includes('report') || lowerInput.includes('analytics')) {
      return 'Reports and analytics are available on the Dashboard. You can view various statistics and generate detailed reports there.';
    } else {
      return "I'm not sure how to help with that yet. Try asking about students, teachers, attendance, exams, or fees.";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-card border shadow-lg rounded-lg w-80 h-96 flex flex-col overflow-hidden"
          >
            <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="font-medium">Medha Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground">
                <X size={16} />
              </Button>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 ${message.sender === 'bot' ? 'mr-12' : 'ml-12'}`}
                >
                  <div className={`p-3 rounded-lg ${message.sender === 'bot' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    {message.sender === 'bot' && (
                      <Badge variant="outline" className="text-xs">Medha</Badge>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-3 mr-12">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-3 border-t">
              <div className="flex">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 rounded-r-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="rounded-l-none"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <Bot size={20} />
        </Button>
      )}
    </div>
  );
}