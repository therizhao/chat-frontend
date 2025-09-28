import { Toaster } from '@/components/ui/sonner';
import { ChatsView } from '@/components/admin/chats-view';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/lib/adminAuth';
import { Button } from '@/components/ui/button';

export function AdminApp() {
  const { logout } = useAuth();

  return (
    <div className="py-8 px-16 flex flex-col gap-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-gray-400">/</span>
          <h1 className="font-mono text-lg">admin</h1>
          <span className="text-gray-400">/</span>
          <h1 className="font-mono text-lg">chats</h1>
        </div>

        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>

      <ChatsView />

      {/* ── Global toaster ──────────────────────────────────────────────── */}
      <Toaster position="top-center" richColors />
    </div>
  );
}
