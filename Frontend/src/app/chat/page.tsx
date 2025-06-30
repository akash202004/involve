"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSend, FiArrowLeft, FiUser, FiMessageCircle } from 'react-icons/fi';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'worker';
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your assigned worker. How can I help you today?',
      sender: 'worker',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const workerId = searchParams.get('workerId');
  const workerName = searchParams.get('workerName');

  // Mock worker data
  const worker = {
    id: workerId || '1',
    name: workerName || 'Amit Kumar',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'online'
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate worker typing
  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random typing duration
  };

  // Generate mock worker response
  const generateWorkerResponse = (userMessage: string): string => {
    const responses = [
      "I understand. I'll be there shortly.",
      "That sounds good. I'm on my way.",
      "I'll make sure to bring the necessary tools.",
      "No problem, I can handle that.",
      "I'll arrive in about 10-15 minutes.",
      "Thank you for the information.",
      "I'll update you on my progress.",
      "Is there anything specific I should know?",
      "I'll call you when I'm nearby.",
      "Perfect, I'll see you soon."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate worker typing
    simulateTyping();

    // Simulate worker response after typing
    setTimeout(() => {
      const workerResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateWorkerResponse(inputMessage),
        sender: 'worker',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, workerResponse]);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Image
              src={worker.avatar}
              alt={worker.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              worker.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-900">{worker.name}</h2>
            <p className="text-sm text-gray-500">
              {worker.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[70%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {message.sender === 'worker' && (
                <Image
                  src={worker.avatar}
                  alt={worker.name}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
              )}
              
              <div className={`px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-yellow-500 text-white rounded-br-md'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-yellow-100' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <Image
                src={worker.avatar}
                alt={worker.name}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
              <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-full transition-colors ${
              inputMessage.trim()
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatPage; 