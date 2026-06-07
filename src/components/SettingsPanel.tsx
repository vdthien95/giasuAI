/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppSettings, GradeLevel, SupportLevel, ThemeMode, FontSize } from '../types';
import { motion } from 'motion/react';
import { 
  Key, Save, Trash2, RefreshCw, CheckCircle2, XCircle, 
  BookOpen, Users, Palette, Type as TypeIcon, Info 
} from 'lucide-react';
import { checkConnection } from '../gemini';

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFullKey, setShowFullKey] = useState(false);

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setErrorMessage('');
    try {
      const isOk = await checkConnection(localSettings.apiKey);
      if (isOk) {
        setTestStatus('success');
      } else {
        throw new Error('Connection failed - empty response');
      }
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Kết nối không thành công');
    }
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return `••••••••${key.slice(-4)}`;
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const grades: GradeLevel[] = ['1', '2', '3', '4', '5'];
  const supportLevels: { id: SupportLevel; label: string }[] = [
    { id: 'low', label: 'Ít' },
    { id: 'medium', label: 'Vừa' },
    { id: 'high', label: 'Nhiều' },
  ];
  const themes: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: 'Sáng' },
    { id: 'dark', label: 'Tối' },
  ];
  const fontSizes: { id: FontSize; label: string }[] = [
    { id: 'small', label: 'Nhỏ' },
    { id: 'medium', label: 'Vừa' },
    { id: 'large', label: 'Lớn' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden max-w-2xl mx-auto"
      id="settings-panel"
    >
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold">Cài đặt hệ thống</h2>
            <p className="text-xs text-slate-400">Quản lý cấu hình AI và giao diện</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <XCircle size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
        {/* App Info */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
            <Info size={18} className="text-indigo-500" />
            <h3>Thông tin ứng dụng</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-bold text-slate-900">AI Gia sư Socrates</p>
            <p className="text-xs text-slate-500">Phiên bản: 1.0.0</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gia sư thông minh hướng dẫn học sinh bằng phương pháp Socrates, giúp phát triển tư duy phản biện.
            </p>
          </div>
        </section>

        {/* API Key Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
            <Key size={18} className="text-indigo-500" />
            <h3>Quản lý API Key</h3>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showFullKey ? "text" : "password"}
                placeholder="Nhập API Key của bạn (Google Gemini)"
                value={localSettings.apiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowFullKey(!showFullKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 underline"
              >
                {showFullKey ? "Ẩn" : "Hiện"}
              </button>
            </div>

            {localSettings.apiKey && !showFullKey && (
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Đang sử dụng: {maskKey(localSettings.apiKey)}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing' || !localSettings.apiKey}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  testStatus === 'testing' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {testStatus === 'testing' ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Kiểm tra kết nối
              </button>
              <button
                onClick={() => setLocalSettings({ ...localSettings, apiKey: '' })}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
              >
                <Trash2 size={14} />
                Xóa Key
              </button>
            </div>

            {testStatus === 'success' && (
              <p className="flex items-center gap-2 text-xs text-green-600 font-bold">
                <CheckCircle2 size={14} /> Kết nối thành công!
              </p>
            )}
            {testStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <XCircle size={14} /> Lỗn kết nối:
                </p>
                <p className="opacity-80">{errorMessage}</p>
              </div>
            )}
          </div>
        </section>

        {/* Grade Level */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
            <BookOpen size={18} className="text-indigo-500" />
            <h3>Cấp học</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {grades.map(g => (
              <button
                key={g}
                onClick={() => setLocalSettings({ ...localSettings, gradeLevel: g })}
                className={`px-6 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  localSettings.gradeLevel === g
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">AI sẽ tự động điều chỉnh độ khó theo lớp bạn chọn.</p>
        </section>

        {/* Support Level */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
            <Users size={18} className="text-indigo-500" />
            <h3>Mức độ hỗ trợ</h3>
          </div>
          <div className="flex gap-3">
            {supportLevels.map(l => (
              <button
                key={l.id}
                onClick={() => setLocalSettings({ ...localSettings, supportLevel: l.id })}
                className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  localSettings.supportLevel === l.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
            <Palette size={18} className="text-indigo-500" />
            <h3>Giao diện</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chế độ</h4>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setLocalSettings({ ...localSettings, theme: t.id })}
                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                      localSettings.theme === t.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TypeIcon size={14} /> Cỡ chữ
              </h4>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {fontSizes.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setLocalSettings({ ...localSettings, fontSize: f.id })}
                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                      localSettings.fontSize === f.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 bg-slate-50 border-t flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Save size={20} />
          Lưu cấu hình
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Hủy bỏ
        </button>
      </div>
    </motion.div>
  );
}
