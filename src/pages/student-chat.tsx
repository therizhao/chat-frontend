import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, GraduationCap, Clock, Bot, User, UserRound } from 'lucide-react';
import { useChat } from '@/lib/chat';
import { BookCallForm } from '@/components/student/book-call-form';

export function StudentChat() {
  const { chatId } = useParams();
  const { messages, sendMessageAsStudent: sendMessage } = useChat(chatId!);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(
    async (message?: string) => {
      const messageToSend = message?.trim() ?? inputValue.trim();

      if (!messageToSend) return;
      setInputValue('');

      await sendMessage(messageToSend);
    },
    [inputValue, sendMessage]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-bg text-white p-6 shadow-lg mb-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">
                Cats University
              </h1>
              <p className="text-purple-100">Admissions Support Chat</p>
            </div>
          </div>
          <p className="text-purple-100 text-pretty">
            Welcome to Cats University! Our admissions team is here to help you
            with any questions about programs, applications, and student life.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'student' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="text-primary-foreground text-xs bg-purple-500">
                    <Bot className="p-1" />
                  </AvatarFallback>
                </Avatar>
              )}
              {message.sender === 'admin' && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                </Avatar>
              )}

              <div
                className={`max-w-xs lg:max-w-md flex flex-col ${
                  message.sender === 'student' ? 'items-end' : 'items-start'
                }`}
              >
                <Card
                  className={`p-3 gap-3 ${
                    message.sender === 'student'
                      ? 'chat-bubble-sent text-white border-0'
                      : 'chat-bubble-received border-0 shadow-sm'
                  }`}
                >
                  <div className="text-sm text-pretty">{message.content}</div>
                  <div className="flex items-center gap-1 m-0">
                    <Clock className="h-3 w-3 opacity-60" />
                    <span className="text-xs opacity-60">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </Card>
              </div>

              {message.sender === 'student' && (
                <Avatar className="h-8 w-8 bg-accent">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    <User className="p-1" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            onClick={() => {
              handleSendMessage('I want to chat with an admissions staff');
            }}
          >
            <UserRound className="p-0.5" />
            Chat with our staff
          </Button>
          <BookCallForm chatId={chatId!} />
        </div>

        {/* Input Area */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about admissions, programs, or campus life..."
              className="flex-1 bg-white/90 border-0 focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={() => {
                handleSendMessage();
              }}
              className="gradient-bg hover:opacity-90 transition-opacity"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
