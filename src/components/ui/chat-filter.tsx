'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export type FilterType = 'pending' | 'handled' | 'all' | 'call-scheduled';

export function ChatFilter({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}) {
  const handleToggle = (filter: FilterType) => {
    onFilterChange(filter);
  };

  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeFilter === 'call-scheduled' ? 'default' : 'outline'}
            onClick={() => handleToggle('call-scheduled')}
          >
            Call Scheduled
          </Button>
        </TooltipTrigger>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => handleToggle('pending')}
          >
            Pending Reply
          </Button>
        </TooltipTrigger>
        <TooltipContent>Chats waiting for your reply</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => handleToggle('all')}
          >
            All
          </Button>
        </TooltipTrigger>
        <TooltipContent>All ongoing chats</TooltipContent>
      </Tooltip>
    </div>
  );
}
