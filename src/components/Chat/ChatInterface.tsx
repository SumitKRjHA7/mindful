import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Heart, Phone, AlertTriangle, Lightbulb } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatbot } from '../../utils/chatbot';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { crisisResources } from '../../data/crisisResources';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    onSendMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = chatbot.generateResponse(inputValue, messages);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse.message,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type === 'crisis' ? 'crisis' : 'text'
      };

      onSendMessage(botMessage);

      // Send follow-up if available
      if (botResponse.followUp) {
        setTimeout(() => {
          const followUpMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: botResponse.followUp!,
            sender: 'bot',
            timestamp: new Date(),
            type: 'prompt'
          };
          onSendMessage(followUpMessage);
        }, 1500);
      }

      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendPromptResponse = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.sender === 'user') return <User className="w-5 h-5" />;
    if (message.type === 'crisis') return <AlertTriangle className="w-5 h-5" />;
    if (message.type === 'prompt') return <Lightbulb className="w-5 h-5" />;
    return <Bot className="w-5 h-5" />;
  };

  const getMessageStyles = (message: ChatMessage) => {
    if (message.sender === 'user') {
      return 'bg-primary-600 text-white ml-auto';
    }
    if (message.type === 'crisis') {
      return 'bg-red-50 text-red-900 border border-red-200';
    }
    if (message.type === 'prompt') {
      return 'bg-accent-50 text-accent-900 border border-accent-200';
    }
    return 'bg-gray-100 text-gray-900';
  };

  const quickPrompts = [
    "I'm feeling anxious today",
    "I had a great day!",
    "I'm struggling with motivation",
    "I need some encouragement",
    "Help me process my emotions",
    "I'm feeling overwhelmed"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mindful Companion</h1>
              <p className="text-gray-600">Your AI-powered emotional support companion</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col" padding="none">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your safe space</h3>
                <p className="text-gray-600 mb-6">I'm here to listen, support, and help you process your emotions. Feel free to share what's on your mind.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                  {quickPrompts.slice(0, 4).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendPromptResponse(prompt)}
                      className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="animate-slide-up">
                    <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-primary-600 text-white' : 
                        message.type === 'crisis' ? 'bg-red-600 text-white' :
                        message.type === 'prompt' ? 'bg-accent-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {getMessageIcon(message)}
                      </div>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageStyles(message)}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.type === 'crisis' && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs font-semibold mb-2">Immediate Help:</p>
                            <div className="space-y-1">
                              {crisisResources.slice(0, 2).map((resource) => (
                                <div key={resource.id} className="flex items-center text-xs">
                                  <Phone className="w-3 h-3 mr-1" />
                                  <span className="font-medium">{resource.name}:</span>
                                  <span className="ml-1">{resource.phone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length > 0 && (
            <div className="px-6 py-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendPromptResponse(prompt)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-2">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts and feelings..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={2}
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                icon={Send}
                className="self-end"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;