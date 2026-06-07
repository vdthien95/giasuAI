/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportLevel = 'low' | 'medium' | 'high';
export type GradeLevel = '1' | '2' | '3' | '4' | '5';
export type ThemeMode = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppSettings {
  apiKey: string;
  gradeLevel: GradeLevel;
  supportLevel: SupportLevel;
  theme: ThemeMode;
  fontSize: FontSize;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conclusion {
  summary: string;
  keyPoints: string[];
  applicationQuestions: string[];
  extensionQuestion: string;
}

export interface LearningSession {
  id: string;
  topic: string;
  messages: Message[];
  conclusion?: Conclusion;
  startTime: number;
  endTime?: number;
  supportLevel: SupportLevel;
}
