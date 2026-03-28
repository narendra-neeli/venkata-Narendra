import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ConversationList({ conversations, selectedId, onSelect, currentUserEmail }) {
  if (!conversations?.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conv) => {
        const isSelected = conv.id === selectedId;
        const otherName = conv.patient_email === currentUserEmail 
          ? conv.doctor_name || 'Doctor' 
          : conv.patient_name || 'Patient';
        const initials = otherName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
              isSelected 
                ? "bg-primary/10 border border-primary/20" 
                : "hover:bg-muted"
            )}
          >
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className={cn(
                "text-xs font-semibold",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{otherName}</p>
                {conv.last_message_date && (
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {format(new Date(conv.last_message_date), 'HH:mm')}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {conv.last_message || 'No messages yet'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
