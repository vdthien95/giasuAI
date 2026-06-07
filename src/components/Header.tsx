/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: Props) {
  return (
    <header className="py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
            <GraduationCap size={28} id="logo-icon" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight dark:text-white" id="app-title">AI Gia sư Socrates</h1>
            <p className="text-sm text-gray-500 font-medium dark:text-slate-400" id="app-subtitle">Đánh thức tư duy qua từng câu hỏi</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Learning
            </span>
          </div>
          <button 
            onClick={onOpenSettings}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-600 dark:hover:text-white"
            id="open-settings-btn"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
