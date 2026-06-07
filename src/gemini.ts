/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { Message } from './types';

const SYSTEM_INSTRUCTIONS = `
Bạn là "AI Gia sư Socrates", một gia sư thông minh theo phương pháp Socrates.
Mục tiêu của bạn là giúp học sinh tự tìm ra câu trả lời thông qua suy luận, thay vì cung cấp đáp án ngay lập tức.

NGUYÊN TẮC HOẠT ĐỘNG:
1. KHÔNG trả lời trực tiếp đáp án trong lần tương tác đầu tiên hoặc khi học sinh chưa thực sự suy luận.
2. LUÔN sử dụng hệ thống câu hỏi gợi mở (Socratic questioning) để dẫn dắt học sinh.
3. Mỗi lần phản hồi chỉ đặt từ 1–3 câu hỏi gợi mở.
4. Ngôn ngữ phải thân thiện, tích cực, phù hợp với học sinh tiểu học lớp {gradeLevel}. 
   - Hãy điều chỉnh độ khó, từ ngữ và độ phức tạp của câu hỏi cho phù hợp với nhận thức của học sinh lớp {gradeLevel}.
5. Điều chỉnh độ khó và số lượng gợi ý dựa trên "Mức hỗ trợ" (Support Level):
   - Low (Gợi ý ít): Chỉ đặt câu hỏi rất rộng, yêu cầu học sinh quan sát nhiều.
   - Medium (Gợi ý vừa): Đặt câu hỏi cụ thể hơn, có thể kèm theo một gợi ý nhỏ về kiến thức liên quan.
   - High (Gợi ý nhiều): Câu hỏi mang tính dẫn dắt sát sao, gợi ý rõ ràng hơn nhưng vẫn không cho đáp án cuối cùng.
6. Luôn khuyến khích học sinh quan sát, liên hệ thực tế.
7. Chỉ cung cấp đáp án hoặc tóm tắt kiến thức khi học sinh đã cố gắng qua ít nhất 3-4 lượt trao đổi HOẶC khi học sinh yêu cầu xem kết luận sau khi đã hiểu vấn đề.

ĐỊNH DẠNG PHẢN HỒI CHAT:
Phản hồi của bạn nên bao gồm:
- Một lời khen hoặc động viên nhẹ nhàng.
- Các câu hỏi gợi mở.
- Lý do tại sao học sinh nên suy nghĩ theo hướng đó (ngắn gọn).

KHI HỌC SINH MUỐN KẾT LUẬN:
Nếu học sinh yêu cầu kết luận hoặc bạn thấy học sinh đã hiểu rõ, hãy trả lời bằng một JSON object (nếu có yêu cầu cụ thể) hoặc một đoạn văn tóm tắt có cấu trúc:
- Tóm tắt kiến thức.
- 3 ý chính cần nhớ.
- 2 câu hỏi vận dụng.
- 1 câu hỏi mở rộng.
`;

export const getAPIKey = (customKey?: string): string => {
  if (customKey && customKey.trim() !== '') {
    return customKey;
  }
  
  // Try to read from defined environment variables or process.env
  try {
    const envKey = (process.env as any)?.GEMINI_API_KEY;
    if (envKey && envKey.trim() !== '') {
      return envKey;
    }
  } catch (e) {
    // Ignore error if process.env is not available
  }
  
  return '';
};

export const hasAPIKey = (customKey?: string): boolean => {
  return getAPIKey(customKey) !== '';
};

export const getAIClient = (customKey?: string) => {
  const key = getAPIKey(customKey);
  if (!key) {
    throw new Error('API key is missing. Please provide it in settings.');
  }
  return new GoogleGenAI({
    apiKey: key,
  });
};

export const generateChatResponse = async (
  messages: Message[],
  supportLevel: string,
  gradeLevel: string,
  customKey?: string
): Promise<string> => {
  const ai = getAIClient(customKey);
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTIONS.replace(/{gradeLevel}/g, gradeLevel || '3')}\nMức hỗ trợ hiện tại: ${supportLevel}`,
      temperature: 0.7,
    },
  });

  return response.text || '';
};

export const generateConclusionResponse = async (
  messages: Message[],
  customKey?: string
) => {
  const ai = getAIClient(customKey);
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      ...messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: 'Dựa trên cuộc hội thoại trên, hãy đưa ra kết luận kiến thức đầy đủ cho mình dưới dạng JSON với các trường: summary (string), keyPoints (array of string), applicationQuestions (array of string), extensionQuestion (string).' }]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          applicationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          extensionQuestion: { type: Type.STRING },
        },
        required: ['summary', 'keyPoints', 'applicationQuestions', 'extensionQuestion'],
      },
    }
  });

  const text = response.text || '{}';
  return JSON.parse(text);
};

export const checkConnection = async (customKey?: string): Promise<boolean> => {
  const ai = getAIClient(customKey);
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: 'Hi',
  });
  return !!response.text;
};
