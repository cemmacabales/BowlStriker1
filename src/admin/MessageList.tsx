import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { supabase } from '../lib/supabase';
import { Mail, MailOpen, Trash2, RefreshCw, Clock } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function MessageList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, read: true } : null);
  };

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read') return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Messages</h1>
          <p className="text-white/60">
            Contact form submissions from users
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-cyan/20 text-primary-cyan text-xs font-bold border border-primary-cyan/30">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border ${
              filter === tab
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary-cyan text-black text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="text-center py-16 text-white/40">Loading messages...</div>
          ) : filtered.length === 0 ? (
            <GlassCard className="p-8 text-center text-white/40">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No messages yet.</p>
            </GlassCard>
          ) : (
            filtered.map((msg) => (
              <GlassCard
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selected?.id === msg.id
                    ? 'bg-white/10 border-cyan-500/40'
                    : 'hover:bg-white/8'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {msg.read
                      ? <MailOpen className="w-4 h-4 text-white/30" />
                      : <Mail className="w-4 h-4 text-primary-cyan" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${msg.read ? 'text-white/70' : 'text-white'}`}>
                        {msg.name}
                      </p>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-cyan flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{msg.email}</p>
                    <p className="text-xs text-white/50 mt-1 truncate">{msg.message}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-white/30">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px]">
                        {new Date(msg.created_at).toLocaleDateString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <GlassCard variant="dark" className="p-6 sticky top-28">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary-cyan hover:underline">
                    {selected.email}
                  </a>
                  <div className="flex items-center gap-1 mt-1 text-white/30">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(selected.created_at).toLocaleDateString('en-PH', {
                        month: 'long', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!selected.read && (
                    <button
                      onClick={() => markAsRead(selected.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
                      title="Mark as read"
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Message</p>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your message to Bowl Striker`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 flex flex-col items-center justify-center text-center text-white/40 sticky top-28">
              <MailOpen className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a message to read it</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
