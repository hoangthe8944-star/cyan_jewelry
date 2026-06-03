import { FormEvent, useEffect, useRef, useState } from 'react';

import { LoaderCircle, MessageCircleMore, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

import { getAuthUser } from '../lib/auth';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Xin chào, mình có thể hỗ trợ bạn tìm sản phẩm, bộ sưu tập hoặc tư vấn đơn hàng.',
  },
];

const CHAT_REFRESH_INTERVAL_MS = 5000;

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function toChatMessages(messages: Array<{ role: ChatMessage['role']; content: string }>) {
  return messages.map((message) => createMessage(message.role, message.content));
}

function createMessagesSignature(messages: Array<{ role: ChatMessage['role']; content: string }>) {
  return JSON.stringify(messages.map((message) => [message.role, message.content]));
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('oriven_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (!widgetRef.current) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !widgetRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [isOpen]);

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem('oriven_chat_history', JSON.stringify(newMessages));
  };

  const fetchGeminiResponse = async (userMessage: string, chatHistory: ChatMessage[]) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not configured in .env file.');
      return 'Chào mừng bạn đến với Oriven Jewelry! Trợ lý ảo AI của cửa hàng hiện đang được thiết lập. Bạn có thể tự do trải nghiệm thiết kế trang sức 3D độc quyền tại phần Customizer nhé!';
    }

    const authUser = getAuthUser();
    const customerName = authUser?.fullName || 'Khách hàng';

    const systemInstruction = 
      `Bạn là Oriven AI - trợ lý ảo chuyên nghiệp của thương hiệu trang sức cao cấp Oriven Jewelry. ` +
      `Hãy nói chuyện với khách hàng tên là "${customerName}" bằng tiếng Việt một cách lịch sự, trang nhã, ngắn gọn và tận tâm. ` +
      `Nhiệm vụ của bạn là tư vấn cho khách hàng về các sản phẩm trang sức (nhẫn, vòng tay, hoa tai, dây chuyền), các chất liệu cao cấp (Vàng 18K, Vàng trắng, Vàng hồng, Bạch kim, Bạc) và các loại đá quý chủ (Diamond, Emerald, Sapphire, Ruby). ` +
      `Khuyến khích họ trải nghiệm tính năng thiết kế 3D độc quyền ở trang Customizer.`;

    try {
      const model = new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemini-2.5-flash',
        temperature: 0.7,
        maxOutputTokens: 500,
      });

      const messages = [
        new SystemMessage(systemInstruction),
        ...chatHistory
          .filter((m) => m.id !== 'welcome')
          .map((m) => {
            return m.role === 'user'
              ? new HumanMessage(m.content)
              : new AIMessage(m.content);
          }),
        new HumanMessage(userMessage),
      ];

      const response = await model.invoke(messages);
      const replyText = typeof response.content === 'string' ? response.content : '';
      return replyText || 'Oriven chưa hiểu rõ ý bạn, bạn có thể nói chi tiết hơn được không?';
    } catch (error) {
      console.error('Error calling Gemini API via LangChain:', error);
      throw new Error('Kết nối tới AI Chatbot gặp sự cố. Vui lòng thử lại sau.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || sending) {
      return;
    }

    const nextUserMessage = createMessage('user', trimmedInput);
    const newMessages = [...messages, nextUserMessage];
    saveMessages(newMessages);
    setInput('');
    setSending(true);
    setError(null);

    try {
      const reply = await fetchGeminiResponse(trimmedInput, messages);
      const nextAssistantMessage = createMessage('assistant', reply);
      saveMessages([...newMessages, nextAssistantMessage]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể kết nối chat lúc này.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={widgetRef} className="pointer-events-none fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-[70] flex flex-col items-end justify-end">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mb-4 w-full sm:w-[380px] overflow-hidden rounded-2xl border border-[#A36B31]/20 bg-white shadow-[0_24px_60px_rgba(17,33,45,0.25)]"
          >
            <div className="bg-primary px-5 py-4 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">Tư vấn nhanh</p>
                  <h3 className="mt-2 font-sterling text-[26px] leading-none">Oriven Chat</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/20 p-2 text-white transition-colors hover:bg-white/10"
                  aria-label="Đóng cửa sổ chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="h-[380px] overflow-y-auto bg-[linear-gradient(180deg,rgba(17,33,45,0.03),rgba(255,255,255,0.98)_18%,#ffffff_100%)] px-4 py-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 text-sm leading-6 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'border border-border bg-white text-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {sending ? (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Đang trả lời...
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border bg-white p-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  rows={2}
                  className="min-h-[52px] flex-1 resize-none border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="flex h-[52px] w-[52px] items-center justify-center bg-primary text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div className="pointer-events-auto relative group">
        {/* Colorful Gemstone Glow Aura behind the button on hover */}
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#00f2ea,#a855f7,#38bdf8,#e2e8f0)] opacity-0 group-hover:opacity-80 blur-md transition-all duration-500 scale-95 group-hover:scale-125 animate-pulse" />
        
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white overflow-hidden border border-white/20 transition-all duration-300"
          style={{
            boxShadow: '0 8px 32px rgba(17, 33, 45, 0.35)',
          }}
          aria-label={isOpen ? 'Ẩn chat' : 'Mở chat'}
        >
          {/* Shifting holographic gradient overlay on hover */}
          <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,242,234,0.3),rgba(168,85,247,0.3),rgba(56,189,248,0.3))] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {isOpen ? (
            <X className="relative z-10 h-5 w-5" />
          ) : (
            <motion.img 
              src="/mineral.png" 
              alt="Mineral" 
              className="h-full w-full object-cover relative z-10"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Shimmering highlight line on hover */}
          <motion.div
            className="absolute top-0 w-1/2 h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] -skew-x-12"
            style={{ left: '-100%' }}
            animate={{ left: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
}
