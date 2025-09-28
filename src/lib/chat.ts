import { useEffect, useState, useCallback } from 'react';
import { BACKEND_URL, supabase } from '@/config';
import { adminFetcher } from '@/lib/adminFetcher';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'student' | 'bot' | 'admin';
  created_at: string;
}

export interface StartChatResponse {
  chat_id: string;
  greeting?: string;
}

export async function startChat(): Promise<StartChatResponse> {
  const res = await fetch(`${BACKEND_URL}/chat/start`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to start chat');
  }
  return res.json();
}

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as ChatMessage[]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [chatId]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const sendMessageAsStudent = useCallback(
    async (content: string) => {
      await fetch(`${BACKEND_URL}/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    },
    [chatId]
  );

  const sendMessageAsAdmin = useCallback(
    async (content: string) => {
      await adminFetcher(`/admin/chat/${chatId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    },
    [chatId]
  );

  return { messages, sendMessageAsStudent, sendMessageAsAdmin, loading };
}
