import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from './supabase';

export type ConversationSummary = {
  id: string;
  kind: 'direct' | 'group';
  title: string;
  last_message_at: string;
  last_message: string | null;
  unread: boolean | null;
};

export type Message = {
  id: number;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

function client() {
  if (!supabase) throw new Error('Chat is not set up yet');
  return supabase;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const { data, error } = await client()
    .from('my_conversations')
    .select('*')
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getConversation(id: string): Promise<ConversationSummary | null> {
  const { data, error } = await client().from('my_conversations').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

/** Returns the conversation id, or null when nobody on Sanjal has that number. */
export async function startDirectChat(phone: string): Promise<string | null> {
  const { data, error } = await client().rpc('start_direct_chat', { phone });
  if (error) throw error;
  return data;
}

/** Newest first, for an inverted list. */
export async function listMessages(conversationId: string, limit = 50): Promise<Message[]> {
  const { data, error } = await client()
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  const { data, error } = await client()
    .from('messages')
    .insert({ conversation_id: conversationId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markRead(conversationId: string, userId: string): Promise<void> {
  await client()
    .from('conversation_members')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);
}

/** Calls `onMessage` for every new message in the conversation. Returns an unsubscribe function. */
export function subscribeToMessages(conversationId: string, onMessage: (message: Message) => void) {
  const channel: RealtimeChannel = client()
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message),
    )
    .subscribe();
  return () => {
    client().removeChannel(channel);
  };
}
