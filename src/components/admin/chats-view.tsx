import useSWR from 'swr';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChatFilter, type FilterType } from '@/components/ui/chat-filter';
import { adminFetcher } from '@/lib/adminFetcher';
import { Inbox } from 'lucide-react';
import { ChatSheet } from '@/components/admin/chat-sheet';
import { Badge } from '@/components/ui/badge';

type ChatStatus = 'bot' | 'awaiting_human' | 'human' | 'closed';

const statusPriority: Record<ChatStatus, number> = {
  awaiting_human: 1,
  human: 2,
  bot: 3,
  closed: 4,
};

interface Chat {
  id: string;
  created_at: string;
  status: ChatStatus;
  followups: {
    student_email: string;
    student_phone: string;
    preferred_time: number;
  }[];
}

// Map status to display text and color
const statusMap: Record<ChatStatus, { text: string; color: string }> = {
  bot: { text: 'Bot', color: 'bg-green-500' },
  awaiting_human: { text: 'Pending reply', color: 'bg-red-500' },
  human: { text: 'Replied', color: 'bg-yellow-400' },
  closed: { text: 'Closed', color: 'bg-gray-400' },
};

export function ChatsView() {
  const {
    data,
    error,
    isLoading,
    mutate: refetch,
  } = useSWR('/admin/chats', adminFetcher);
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending');

  const chats: Chat[] = data?.chats || [];

  if (isLoading) return <div>Loading chats...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredChats = chats
    .filter((chat) => {
      switch (activeFilter) {
        case 'pending':
          return chat.status === 'awaiting_human' || chat.status === 'human';
        case 'all':
          return chat.status !== 'closed';
        case 'call-scheduled':
          return chat.followups.length > 0;
      }
    })
    .sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

  return (
    <div>
      <div className="mb-6">
        <ChatFilter
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
        />
      </div>
      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
          <Inbox className="w-16 h-16 mb-4 opacity-50" />
          <h2 className="text-xl font-semibold">No chats to display</h2>
          <p className="mt-2 text-sm">
            {chats.length === 0
              ? 'No chats have been created yet.'
              : 'No chats match your selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
          {filteredChats.map((chat) => {
            const status = statusMap[chat.status];
            return (
              <ChatSheet
                key={chat.id}
                chatId={chat.id}
                followups={chat.followups}
                onSend={refetch}
                trigger={
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer text-left">
                    <CardHeader>
                      <CardTitle>
                        #{chat.id.slice(-5)}{' '}
                        {chat.followups.length > 0 && (
                          <Badge className="ml-2 -translate-y-0.5">
                            Call Scheduled
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {new Date(chat.created_at).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${status.color}`}
                      ></span>
                      <span className="text-muted-foreground text-sm">
                        {status.text}
                      </span>
                    </CardContent>
                  </Card>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
