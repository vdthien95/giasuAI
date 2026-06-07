/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Conclusion } from '../types';
import { motion } from 'motion/react';
import { Lightbulb, CheckCircle2, FlaskConical, Rocket } from 'lucide-react';

interface Props {
  conclusion: Conclusion;
}

export default function ConclusionCard({ conclusion }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-50/50 dark:shadow-none overflow-hidden"
      id="conclusion-card"
    >
      <div className="bg-indigo-600 p-4 flex items-center gap-2 text-white">
        <Lightbulb size={20} />
        <h3 className="font-bold tracking-tight">Kết luận kiến thức</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            Tóm tắt kiến thức
          </h4>
          <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
            {conclusion.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FlaskConical size={14} className="text-indigo-500" />
              Câu hỏi vận dụng
            </h4>
            <ul className="space-y-2">
              {conclusion.applicationQuestions.map((q, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                  <span className="font-bold text-indigo-400">{idx + 1}.</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Rocket size={14} className="text-orange-500" />
              Bạn có biết? (Mở rộng)
            </h4>
            <div className="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm text-orange-900 dark:text-orange-200 leading-relaxed">
              {conclusion.extensionQuestion}
            </div>
            
            <div className="mt-4">
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Ý chính cần nhớ:</h4>
              <div className="flex flex-wrap gap-2">
                {conclusion.keyPoints.map((point, idx) => (
                  <span key={idx} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1 rounded-full text-[11px] font-semibold border border-gray-200 dark:border-slate-700">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
