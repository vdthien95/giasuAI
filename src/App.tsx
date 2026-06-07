/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import SupportLevelSelector from './components/SupportLevelSelector';
import ChatBox from './components/ChatBox';
import ConclusionCard from './components/ConclusionCard';
import LearningLog from './components/LearningLog';
import SettingsPanel from './components/SettingsPanel';
import { SupportLevel, Message, LearningSession, Conclusion, AppSettings } from './types';
import { BrainCircuit, BookOpen, Quote, ChevronRight, Share2, MessageCircle } from 'lucide-react';
import { generateChatResponse, generateConclusionResponse, hasAPIKey } from './gemini';

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  gradeLevel: '3',
  supportLevel: 'medium',
  theme: 'light',
  fontSize: 'medium',
};

export default function App() {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConcluding, setIsConcluding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load history & settings
  useEffect(() => {
    const savedLog = localStorage.getItem('socrates_learning_log');
    if (savedLog) {
      try { setSessions(JSON.parse(savedLog)); } catch (e) { console.error(e); }
    }
    const savedSettings = localStorage.getItem('socrates_settings');
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('socrates_learning_log', JSON.stringify(sessions));
  }, [sessions]);

  // Save settings & Sync theme
  useEffect(() => {
    localStorage.setItem('socrates_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const startNewSession = () => {
    const newSession: LearningSession = {
      id: Date.now().toString(),
      topic: '',
      messages: [],
      startTime: Date.now(),
      supportLevel: settings.supportLevel,
    };
    setCurrentSession(newSession);
  };

  const handleSendMessage = async (text: string) => {
    let session = currentSession;
    if (!session) {
      session = {
        id: Date.now().toString(),
        topic: text.length > 50 ? text.substring(0, 47) + '...' : text,
        messages: [],
        startTime: Date.now(),
        supportLevel: settings.supportLevel,
      };
      setCurrentSession(session);
    }

    const userMessage: Message = { role: 'user', content: text, timestamp: Date.now() };
    const newMessages = [...session.messages, userMessage];
    const updatedSession = { ...session, messages: newMessages };
    
    setCurrentSession(updatedSession);
    setIsGenerating(true);

    try {
      const content = await generateChatResponse(
        newMessages,
        settings.supportLevel,
        settings.gradeLevel,
        settings.apiKey
      );

      const assistantMessage: Message = { role: 'assistant', content, timestamp: Date.now() };

      const finalSession = { 
        ...updatedSession, 
        messages: [...newMessages, assistantMessage],
        topic: updatedSession.topic || (text.length > 50 ? text.substring(0, 47) + '...' : text)
      };
      setCurrentSession(finalSession);
      
      setSessions(prev => {
        const others = prev.filter(s => s.id !== finalSession.id);
        return [finalSession, ...others];
      });
    } catch (error: any) {
      const errorMsg: Message = { 
        role: 'assistant', 
        content: `Rất tiếc, đã có lỗi xảy ra: ${error.message}. Vui lòng kiểm tra lại cấu hình API Key trong phần Cài đặt.`, 
        timestamp: Date.now() 
      };
      setCurrentSession(prev => prev ? { ...prev, messages: [...prev.messages, errorMsg] } : null);
    } finally {
      setIsGenerating(false);
    }
  };

  const concludeLesson = async () => {
    if (!currentSession || currentSession.messages.length === 0) return;
    
    setIsConcluding(true);
    try {
      const conclusion: Conclusion = await generateConclusionResponse(
        currentSession.messages,
        settings.apiKey
      );
      const finalSession = { ...currentSession, conclusion, endTime: Date.now() };
      setCurrentSession(finalSession);
      
      setSessions(prev => {
        const others = prev.filter(s => s.id !== finalSession.id);
        return [finalSession, ...others];
      });
    } catch (error) {
      console.error('Conclusion error:', error);
    } finally {
      setIsConcluding(false);
    }
  };

  const handleSelectSession = (session: LearningSession) => {
    setCurrentSession(session);
    setSettings(prev => ({ ...prev, supportLevel: session.supportLevel }));
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nhật ký học tập không?')) {
      setSessions([]);
      localStorage.removeItem('socrates_learning_log');
    }
  };

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-indigo-100 selection:text-indigo-900 ${settings.theme === 'dark' ? 'bg-slate-950 text-slate-200 dark' : 'bg-slate-50 text-gray-900'} ${fontSizeClass}`}>
      <Header onOpenSettings={() => setShowSettings(true)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-4"
            >
              <SettingsPanel 
                settings={settings} 
                onSave={setSettings} 
                onClose={() => setShowSettings(false)} 
              />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight dark:text-white">Học tập</h2>
                    <button 
                      onClick={startNewSession}
                      className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
                      title="Bắt đầu phiên học mới"
                      id="new-session-btn"
                    >
                      <BookOpen size={20} />
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                      <BrainCircuit size={16} className="text-indigo-500" />
                      <span>Thông tin lớp học</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lớp đang chọn:</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Lớp {settings.gradeLevel}</span>
                    </div>
                  </div>

                  <SupportLevelSelector 
                    level={settings.supportLevel} 
                    onChange={(l) => setSettings(prev => ({ ...prev, supportLevel: l }))} 
                  />
                  
                  <LearningLog 
                    sessions={sessions} 
                    onSelect={handleSelectSession} 
                    onClear={handleClearHistory} 
                  />
                  
                  <div className="bg-slate-900 dark:bg-indigo-950 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative" id="socratic-quote-card">
                    <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                      <BrainCircuit size={100} />
                    </div>
                    <Quote size={24} className="text-indigo-400 mb-2" />
                    <p className="text-sm italic font-medium relative z-10 leading-relaxed">
                      "Tôi không thể dạy ai bất cứ điều gì, tôi chỉ có thể làm cho họ suy nghĩ."
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-bold mt-3 opacity-60">— Socrates</p>
                  </div>
                </motion.div>
              </div>

              {/* Main Area */}
              <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
                <AnimatePresence mode="wait">
                  {currentSession?.conclusion ? (
                    <motion.div 
                      key="conclusion"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ConclusionCard conclusion={currentSession.conclusion} />
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={startNewSession}
                          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 dark:border-slate-800 text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                          id="continue-learning-btn"
                        >
                          Tiếp tục học hỏi <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="chat"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between px-2">
                        <div id="session-info">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Phiên học hiện tại</span>
                          <h2 className="text-lg font-bold truncate max-w-[250px] sm:max-w-md dark:text-white">
                            {currentSession?.topic || 'Sẵn sàng trợ giúp bạn'}
                          </h2>
                        </div>
                        {currentSession && currentSession.messages.length > 2 && (
                          <button
                            onClick={concludeLesson}
                            disabled={isConcluding}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 dark:shadow-none disabled:opacity-50"
                            id="conclude-btn"
                          >
                            {isConcluding ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang tóm tắt...
                              </>
                            ) : (
                              <>
                                <Share2 size={14} />
                                Xem kết luận
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {!hasAPIKey(settings.apiKey) && (
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700 flex items-center gap-3 animate-pulse">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <BrainCircuit size={16} />
                          </div>
                          <div>
                            <p className="font-bold">Lưu ý: Chưa cài đặt API Key!</p>
                            <p>Vui lòng vào phần <strong>Cài đặt</strong> để nhập API Key trước khi bắt đầu học.</p>
                          </div>
                        </div>
                      )}

                      <ChatBox 
                        messages={currentSession?.messages || []} 
                        onSendMessage={handleSendMessage} 
                        isGenerating={isGenerating} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 py-8 border-t border-gray-200 bg-white dark:bg-slate-950 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 font-medium dark:text-slate-500">
            AI Gia sư Socrates - Ứng dụng hỗ trợ học tập định hướng Chương trình GDPT 2018.
            <br />
            &copy; 2026 AI Studio. Phát triển năng lực tự học cho học sinh Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
}
