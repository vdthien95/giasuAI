/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportLevel } from '../types';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

interface Props {
  level: SupportLevel;
  onChange: (level: SupportLevel) => void;
}

const levels: { id: SupportLevel; label: string; desc: string }[] = [
  { id: 'low', label: 'Gợi ý ít', desc: 'Socrates chỉ hỏi các câu hỏi rất rộng để bạn tự khám phá.' },
  { id: 'medium', label: 'Gợi ý vừa', desc: 'Kết hợp câu hỏi và các gợi ý nhỏ về kiến thức.' },
  { id: 'high', label: 'Gợi ý nhiều', desc: 'Dẫn dắt sát sao hơn giúp bạn dễ dàng tìm hướng đi.' },
];

export default function SupportLevelSelector({ level, onChange }: Props) {
  return (
    <div className="bg-gray-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800" id="support-level-container">
      <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-slate-300 font-semibold text-sm">
        <Info size={16} className="text-indigo-500" />
        <span>Chọn mức độ hỗ trợ</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {levels.map((l) => (
          <button
            key={l.id}
            id={`level-btn-${l.id}`}
            onClick={() => onChange(l.id)}
            className={`flex flex-col p-3 rounded-xl border-2 transition-all text-left ${
              level === l.id
                ? 'bg-indigo-50 border-indigo-500 ring-4 ring-indigo-50 dark:bg-indigo-950/30 dark:ring-indigo-900/20'
                : 'bg-white dark:bg-slate-800 border-transparent hover:border-gray-200 dark:hover:border-slate-700'
            }`}
          >
            <span className={`font-bold text-sm ${level === l.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
              {l.label}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-500 leading-tight mt-1">
              {l.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
