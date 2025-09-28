import dayjs from 'dayjs';
import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat, type ChatMessage } from '@/lib/chat';
import {
  Clock,
  Send,
  Baby,
  UserRound,
  Bot,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import { FollowUp } from '@/lib/types';

interface ChatSheetProps {
  chatId: string;
  trigger: React.ReactNode;
  followups: FollowUp[];
  onSend?: () => void;
}

const getAvatarProps = (sender: ChatMessage['sender']) => {
  switch (sender) {
    case 'admin':
      return {
        icon: <UserRound className="h-4 w-4" />,
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
      };
    case 'bot':
      return {
        icon: <Bot className="h-4 w-4" />,
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
      };
    case 'student':
    default:
      return {
        icon: <Baby className="h-4 w-4" />,
        bgColor: 'bg-green-500',
        textColor: 'text-white',
      };
  }
};

export function ChatSheet({
  chatId,
  followups,
  trigger,
  onSend = () => {},
}: ChatSheetProps) {
  const { messages, sendMessageAsAdmin, loading } = useChat(chatId);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setIsSending(true);
    try {
      await sendMessageAsAdmin(inputValue);
      setInputValue('');
      onSend();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent className="flex flex-col p-0 w-full sm:w-[1080px] sm:max-w-[1080px]">
        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
          <SheetTitle className="text-lg font-semibold">
            Chat #{chatId.slice(-5)}
          </SheetTitle>

          <FollowupList followups={followups} />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading messages...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg: ChatMessage) => {
              const avatarProps = getAvatarProps(msg.sender);
              const isAdmin = msg.sender === 'admin' || msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isAdmin ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isAdmin && (
                    <Avatar className="size-8 shrink-0 mt-1">
                      <AvatarFallback
                        className={`${avatarProps.bgColor} ${avatarProps.textColor} text-xs font-medium`}
                      >
                        {avatarProps.icon}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={`py-4 ${isAdmin ? 'bg-primary text-white' : ''}`}
                  >
                    <CardContent>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className="flex items-center gap-1 mt-2 opacity-70">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {isAdmin && (
                    <Avatar className="size-8 shrink-0 mt-1">
                      <AvatarFallback
                        className={`${avatarProps.bgColor} ${avatarProps.textColor} text-xs font-medium`}
                      >
                        {avatarProps.icon}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <SheetFooter className="p-6 border-t bg-muted/30">
          <div className="flex gap-3 w-full">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-background border-input focus:ring-2 focus:ring-primary/20"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !inputValue.trim()}
              size="icon"
              className="shrink-0"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const FollowupList: React.FC<{ followups: FollowUp[] }> = ({
  followups,
}) => {
  return (
    <div>
      <div className="text-gray-700 mb-2">Scheduled Phone Calls</div>
      <div className="text-gray-700 mb-2 text-sm">
        The student requested for a call at these times
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {followups.map((f, index) => (
          <Card
            key={index}
            className="min-w-[300px] border border-gray-200 shadow-sm px-4 py-4"
          >
            <CardDescription className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 " />
                {f.student_phone}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 " />
                {dayjs(f.preferred_time).format('MMM D, YYYY, h:mm A')}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                {f.student_email}
              </div>
            </CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
};
