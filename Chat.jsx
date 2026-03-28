import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import NewConversationDialog from '@/components/chat/NewConversationDialog';
import { MessageCircle } from 'lucide-react';

export default function Chat() {
  const { user } = useOutletContext();
  const [selected, setSelected] = useState(null);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date', 50),
    refetchInterval: 5000,
  });

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[320px] border-r border-border flex flex-col flex-shrink-0 hidden md:flex">
          <div className="h-14 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold">Messages</h2>
            </div>
            <NewConversationDialog currentUser={user} onCreated={setSelected} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList 
              conversations={conversations} 
              selectedId={selected?.id} 
              onSelect={setSelected}
              currentUserEmail={user?.email}
            />
          </div>
        </div>

        {/* Chat area */}
        <ChatWindow conversation={selected} currentUserEmail={user?.email} />
      </div>
    </div>
  );
}
