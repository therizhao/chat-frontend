import { BACKEND_URL } from '@/config';

export async function adminFetcher(path: string, options: RequestInit) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    credentials: 'include', // important to send cookies (auth)
    ...options,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch chats');
  }
  return res.json();
}
