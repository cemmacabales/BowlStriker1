import React, { useEffect, useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ChatMessage } from '../components/ChatMessage';
import { GradientButton } from '../components/GradientButton';
import { useProducts } from '../context/ProductContext';
import { getBotResponse } from '../utils/chatbotRules';

export function BowlBot() {
  const { products } = useProducts();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm BowlBot, your AI bowling assistant. I can help you find the perfect ball, improve your technique, or explain lane conditions. How can I help you today?",
      isAi: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now(),
      text: input,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      // Capture the original input for processing before state is cleared above, wait, it's actually the input var
      const responseText = getBotResponse(input, products);
      const aiMsg = {
        id: Date.now() + 1,
        text: responseText,
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-cyan to-primary-purple mb-4 shadow-lg shadow-cyan-500/30 animate-pulse-slow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold">
            BowlBot AI Assistant
          </h1>
          <p className="text-white/60">
            Expert advice powered by neural networks
          </p>
        </div>

        {/* Chat Interface */}
        <GlassCard className="flex-1 flex flex-col overflow-hidden h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) =>
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isAi={msg.isAi}
                timestamp={msg.timestamp} />

            )}

            {isTyping &&
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-cyan to-primary-purple flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="px-5 py-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 flex items-center gap-1">
                  <div
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{
                      animationDelay: '0ms'
                    }} />

                  <div
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{
                      animationDelay: '150ms'
                    }} />

                  <div
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{
                      animationDelay: '300ms'
                    }} />

                </div>
              </div>
            }
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about bowling balls, techniques, or lane conditions..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary-cyan/50 transition-colors" />

              <GradientButton
                onClick={handleSend}
                disabled={!input.trim() || isTyping}>

                <Send className="w-5 h-5" />
              </GradientButton>
            </div>
          </div>
        </GlassCard>

        {/* Suggestions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            'Best ball for heavy oil?',
            'How to improve hook?',
            'What is a good beginner ball?',
            'Recommend a spare ball',
            'Tell me about bowling shoes'].
            map((suggestion, i) =>
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:border-primary-cyan/30 hover:text-primary-cyan transition-all">

                {suggestion}
              </button>
            )}
        </div>
      </div>
    </div>);

}