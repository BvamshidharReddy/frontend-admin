import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Crown, Send, MessageSquare, Zap, Settings, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const initialConversations = [
  { 
    id: 1, 
    user: 'Parent - Raj Sharma', 
    topic: 'Fee payment query', 
    lastMessage: 'When is the next fee due date?',
    timestamp: '2024-01-15 14:30',
    status: 'Active'
  },
  { 
    id: 2, 
    user: 'Student - Priya Singh', 
    topic: 'Assignment submission', 
    lastMessage: 'How do I submit my math assignment?',
    timestamp: '2024-01-15 13:45',
    status: 'Resolved'
  },
  { 
    id: 3, 
    user: 'Teacher - Ms. Johnson', 
    topic: 'Class schedule inquiry', 
    lastMessage: 'What time does Grade 8 math start tomorrow?',
    timestamp: '2024-01-15 12:20',
    status: 'Active'
  }
];

const chatMessages = [
  { id: 1, sender: 'user', message: 'Hello! I need help with fee payment.', timestamp: '14:25' },
  { id: 2, sender: 'bot', message: 'Hi! I\'d be happy to help you with fee payment. Can you please provide your student\'s admission number?', timestamp: '14:26' },
  { id: 3, sender: 'user', message: 'The admission number is ST001234', timestamp: '14:27' },
  { id: 4, sender: 'bot', message: 'Thank you! I can see that the next fee payment of ₹15,000 is due on January 30th, 2024. Would you like me to guide you through the online payment process?', timestamp: '14:28' }
];

export default function Chatbot() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(chatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatbotSettings, setChatbotSettings] = useState({
    autoResponses: true,
    workingHours: true,
    transferToHuman: true,
    language: 'English'
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        message: 'Thank you for your message. Our AI is processing your request and will respond shortly.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Bot className="w-6 h-6 md:w-8 md:h-8" />
              AI Chatbot
              <Badge className="bg-amber-100 text-amber-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </h1>
            <p className="text-sm md:text-base text-slate-600">Manage AI-powered conversations and support interactions.</p>
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Chatbot Settings</span>
                <span className="sm:hidden">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md">
              <DialogHeader>
                <DialogTitle>Chatbot Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoResponses">Auto Responses</Label>
                  <Switch 
                    id="autoResponses"
                    checked={chatbotSettings.autoResponses}
                    onCheckedChange={(value) => setChatbotSettings({...chatbotSettings, autoResponses: value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="workingHours">Working Hours Only</Label>
                  <Switch 
                    id="workingHours"
                    checked={chatbotSettings.workingHours}
                    onCheckedChange={(value) => setChatbotSettings({...chatbotSettings, workingHours: value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="transferToHuman">Auto Transfer Complex Queries</Label>
                  <Switch 
                    id="transferToHuman"
                    checked={chatbotSettings.transferToHuman}
                    onCheckedChange={(value) => setChatbotSettings({...chatbotSettings, transferToHuman: value})}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsSettingsOpen(false)} className="w-full sm:w-auto">
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-blue-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{conversations.filter(c => c.status === 'Active').length}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">156</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Queries Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-purple-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">89%</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">AI Resolution</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-orange-600"/>
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">12</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Human Transfers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm h-[500px] lg:h-[600px]">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="space-y-3 max-h-[400px] lg:max-h-[500px] overflow-y-auto px-3 md:px-0">
                  {conversations.map(conv => (
                    <Card 
                      key={conv.id} 
                      className={`p-3 hover:bg-slate-50 transition-colors border-slate-200 shadow-sm cursor-pointer ${
                        selectedConversation?.id === conv.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm truncate">{conv.user}</h4>
                          <Badge className={conv.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {conv.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{conv.topic}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{conv.lastMessage}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {conv.timestamp}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm h-[500px] lg:h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {selectedConversation ? selectedConversation.user : 'Select a conversation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-3 md:p-6">
                {selectedConversation ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-slate-50 rounded-lg max-h-[350px] lg:max-h-[450px]">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-slate-200 text-slate-900'
                          }`}>
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your response..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 text-sm"
                      />
                      <Button onClick={handleSendMessage} size="sm" className="px-3">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <Bot className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm md:text-base">Select a conversation to view messages</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}