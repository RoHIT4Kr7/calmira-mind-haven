import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Smile, Paperclip, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
}

interface ChatInterfaceProps {
  contactName: string;
  contactAvatar?: string;
  contactStatus?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  onVoiceMessage?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contactName,
  contactAvatar,
  contactStatus = "Online",
  initialMessages = [],
  onSendMessage,
  onVoiceMessage,
  onVoiceCall,
  onVideoCall
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${contactName}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    },
    ...initialMessages
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Call external handler
    if (onSendMessage) {
      onSendMessage(userMessage.content);
    }

    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage.content),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    // Simple response generation - in real app, this would call an AI service
    const responses = [
      "I understand how you're feeling. Can you tell me more about that?",
      "That sounds challenging. What do you think would help in this situation?",
      "Thank you for sharing that with me. How does that make you feel?",
      "I'm here to listen and support you. What's been on your mind lately?",
      "That's a valid concern. Have you experienced something similar before?",
      "I appreciate your openness. Let's explore this together."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contactAvatar} alt={contactName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-white">
              {contactName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="poppins-semibold text-foreground">{contactName}</h3>
            <p className="text-sm inter-regular text-muted-foreground">{contactStatus}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoiceCall}
            className="p-2 hover:bg-primary/10 rounded-xl"
          >
            <Phone className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoCall}
            className="p-2 hover:bg-primary/10 rounded-xl"
          >
            <Video className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-slate-100/50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white ml-2 rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 mr-2 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm inter-regular leading-relaxed">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.sender === 'user' ? 'text-right mr-2' : 'text-left ml-2'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 order-1">
                  <AvatarImage src={contactAvatar} alt={contactName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary text-xs">
                    {contactName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contactAvatar} alt={contactName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary text-xs">
                    {contactName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 mr-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/95 backdrop-blur-lg border-t border-border shadow-sm">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-xl flex-shrink-0"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-2xl border-gray-200 bg-white pr-12 inter-regular placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-xl"
            >
              <Smile className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          <Button
            onClick={newMessage.trim() ? handleSendMessage : onVoiceMessage}
            className={`p-3 rounded-2xl flex-shrink-0 transition-all duration-200 ${
              newMessage.trim() 
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
            }`}
          >
            {newMessage.trim() ? (
              <Send className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;