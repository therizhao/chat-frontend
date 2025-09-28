import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startChat } from '@/lib/chat';

export function StudentApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const initChat = async () => {
      try {
        const { chat_id } = await startChat();
        navigate(`/chats/${chat_id}`);
      } catch (err) {
        console.error('Failed to start chat', err);
      }
    };

    initChat();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Starting chat...</p>
    </div>
  );
}
