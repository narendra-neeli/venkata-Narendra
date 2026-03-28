import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Video, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function ChatWindow({ conversation, currentUserEmail }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversation?.id],
    queryFn: () => base44.entities.Message.filter(
      { conversation_id: conversation.id }, 
      'created_date', 
      200
    ),
    enabled: !!conversation?.id,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversation?.id] });
      base44.entities.Conversation.update(conversation.id, {
        last_message: message,
        last_message_date: new Date().toISOString(),
      });
      setMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-lg">Select a conversation</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const otherName = conversation.patient_email === currentUserEmail 
    ? conversation.doctor_name || 'Doctor'
    : conversation.patient_name || 'Patient';

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      conversation_id: conversation.id,
      sender_email: currentUserEmail,
      sender_name: 'You',
      content: message.trim(),
      type: 'text',
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {otherName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{otherName}</p>
            <p className="text-xs text-emerald-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Phone className="w-4 h-4" />
          </Button>
          <Link to={`/video?room=${conversation.id}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Video className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
        {messages.map((msg) => {
          const isMe = msg.sender_email === currentUserEmail;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5",
                isMe 
                  ? "bg-primary text-primary-foreground rounded-br-md" 
                  : "bg-card border border-border rounded-bl-md"
              )}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={cn(
                  "text-[10px] mt-1",
                  isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                )}>
                  {msg.created_date ? format(new Date(msg.created_date), 'HH:mm') : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="bg-muted/50 border-0 focus-visible:ring-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || sendMutation.isPending}
            size="icon" 
            className="flex-shrink-0 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
