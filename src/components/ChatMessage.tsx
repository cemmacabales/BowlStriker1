import React from 'react';
import { Bot, User } from 'lucide-react';
interface ChatMessageProps {
  message: string;
  isAi: boolean;
  timestamp: string;
}
export function ChatMessage({ message, isAi, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isAi ? 'bg-gradient-to-br from-primary-cyan to-primary-purple shadow-lg shadow-cyan-500/20' : 'bg-white/10 border border-white/20'}`}>

        {isAi ?
        <Bot className="w-6 h-6 text-white" /> :

        <User className="w-6 h-6 text-white" />
        }
      </div>

      {/* Message Bubble */}
      <div
        className={`flex flex-col max-w-[80%] ${isAi ? 'items-start' : 'items-end'}`}>

        <div
          className={`px-5 py-3 rounded-2xl backdrop-blur-md border ${isAi ? 'bg-white/5 border-white/10 rounded-tl-none text-white' : 'bg-primary-cyan/10 border-primary-cyan/20 rounded-tr-none text-white'}`}>

          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-[10px] text-white/40 mt-1 px-1">{timestamp}</span>
      </div>
    </div>);

}