'use client'

// components/shared/DeleteButton.tsx
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

export function DeleteButton<T>({
  action,
  id,
}: {
  action: (id: string) => Promise<{ message: string }>;
  id: string;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await action(id);
      // Здесь можно добавить дополнительную логику, например, обновление состояния
    } catch (error) {
      setError('Ошибка при удалении');
    }
  };

  return (
    <form action={handleDelete}>
      {error && <p className="text-red-500">{error}</p>}
      <Button variant="outline" type="submit">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  );
}
