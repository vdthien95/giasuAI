/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningSession } from '../types';
import { motion } from 'motion/react';
import { History, Calendar, MessageSquare, ChevronRight, Trash2 } from 'lucide-react';

interface Props {
  sessions: LearningSession[];
  onSelect: (session: LearningSession) => void;
  onClear: () => void;
}

export default function LearningLog({ sessions, onSelect, onClear }: Props) {
  return (
    <div className="space-y-4" id="learning-log-container">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <History size={16} className="text-indigo-500" />
          Nhật ký học tập
        </h3>
        {sessions.length > 0 && (
          <button 
            id="clear-history-btn"
            onClick={onClear}
            className="text-[10px] uppercase tracking-wider font-bold text-red-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 size={12} />
            Xóa lịch sử
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-800 p-8 rounded-2xl text-center" id="empty-history">
          <p className="text-sm text-gray-400 dark:text-slate-600 font-medium">Bạn chưa có câu hỏi nào trong nhật ký.</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar" id="sessions-list">
          {sessions.map((session, idx) => (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={session.id}
              onClick={() => onSelect(session)}
              className="w-full flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group group-id-session"
              id={`session-item-${session.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-indigo-500 transition-colors">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  {session.topic || 'Cuộc thảo luận mới'}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap">
                    <Calendar size={10} />
                    {new Date(session.startTime).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold uppercase transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {session.supportLevel}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-slate-700 group-hover:text-indigo-400 transition-colors" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
