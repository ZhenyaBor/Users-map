import { useEffect, useState } from 'react';
import { type User, type UserRecord } from '../types/user';

export type UseUsersResult = {
  users: UserRecord[];
  loading: boolean;
  error: string | null;
};

export function useUsers(source: string = '/users.json'): UseUsersResult {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(source, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Не вдалося отримати список користувачів');
        }
        const data: User[] = await response.json();
        const prepared = data.map<UserRecord>((user) => ({
          ...user,
          interestsLc: user.interests.map((it) => it.toLowerCase()),
        }));
        setUsers(prepared);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [source]);

  return { users, loading, error };
}
