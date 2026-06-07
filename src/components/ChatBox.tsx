/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Message } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

export default function ChatBox({ messages, onSendMessage, isGenerating }: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden" id="chat-box">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-gray-50/30 dark:bg-slate-950/20"
        id="messages-container"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4"
              id="empty-state"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bot size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chào mừng bạn!</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
                Mình là Gia sư Socrates. Hãy bắt đầu bằng cách đặt bất kỳ câu hỏi nào về bài học nhé!
              </p>
            </motion.div>
          )}
          {messages.map((m, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              id={`message-${idx}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
              id="generating-indicator"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400 font-medium italic">Socrates đang suy nghĩ...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900"
        id="chat-input-form"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Đặt câu hỏi cho Socrates..."
            autoComplete="off"
            disabled={isGenerating}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500 transition-all text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            id="send-btn"
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-center text-gray-400 font-medium">
          Dùng phương pháp gợi mở để cùng nhau tìm ra câu trả lời.
        </p>
      </form>
    </div>
  );
}
