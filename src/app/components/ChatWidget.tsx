import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoaderCircle, MessageCircleMore, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import {
  getChatConversationForCustomer,
  getLatestChatConversation,
  markChatConversationRead,
  sendChatMessage,
} from '../api';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const latestMessagesSignatureRef = useRef(createMessagesSignature(INITIAL_MESSAGES));
  const sessionIdRef = useRef<string | null>(null);
  const hydratedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

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

    const authUser = getAuthUser();
    if (!authUser) {
      return () => {
        document.removeEventListener('pointerdown', handlePointerDownOutside);
      };
    }

    let isActive = true;

    const syncConversation = async (showLoading: boolean) => {
      const shouldShowLoading = showLoading && hydratedUserIdRef.current !== authUser.id;

      if (shouldShowLoading) {
        setLoadingConversation(true);
      }
      try {
        let conversation = null;

        if (sessionIdRef.current) {
          try {
            conversation = await getChatConversationForCustomer(authUser.id, sessionIdRef.current);
          } catch {
            conversation = await getLatestChatConversation(authUser.id);
          }
        } else {
          conversation = await getLatestChatConversation(authUser.id);
        }

        if (!isActive) {
          return;
        }

        if (!conversation || !conversation.messages.length) {
          setSessionId(null);
          setMessages(INITIAL_MESSAGES);
          latestMessagesSignatureRef.current = createMessagesSignature(INITIAL_MESSAGES);
          hydratedUserIdRef.current = authUser.id;
          setError(null);
          return;
        }

        const nextSignature = createMessagesSignature(conversation.messages);
        setSessionId(conversation.id);

        if (nextSignature !== latestMessagesSignatureRef.current) {
          setMessages(toChatMessages(conversation.messages));
          latestMessagesSignatureRef.current = nextSignature;
        }

        hydratedUserIdRef.current = authUser.id;
        setError(null);

        void markChatConversationRead(authUser.id, conversation.id).catch(() => {
          if (!isActive) {
            return;
          }
        });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        if (shouldShowLoading) {
          setError(loadError instanceof Error ? loadError.message : 'Không thể tải lịch sử chat lúc này.');
        }
      } finally {
        if (isActive && shouldShowLoading) {
          setLoadingConversation(false);
        }
      }
    };

    void syncConversation(true);
    const intervalId = window.setInterval(() => {
      void syncConversation(false);
    }, CHAT_REFRESH_INTERVAL_MS);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || sending || loadingConversation) {
      return;
    }

    const authUser = getAuthUser();
    if (!authUser) {
      toast.info('Vui lòng đăng nhập trước khi nhắn tin.');
      navigate('/login', {
        state: {
          redirectTo: `${location.pathname}${location.search}`,
        },
      });
      return;
    }

    const nextUserMessage = createMessage('user', trimmedInput);
    const history = messages
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setMessages((prev) => [...prev, nextUserMessage]);
    latestMessagesSignatureRef.current = createMessagesSignature([
      ...messages,
      {
        role: nextUserMessage.role,
        content: nextUserMessage.content,
      },
    ]);
    setInput('');
    setSending(true);
    setError(null);

    try {
      const response = await sendChatMessage({
        message: trimmedInput,
        history,
        sessionId,
        userId: authUser.id,
        customerName: authUser.fullName,
      });

      if (response.text?.trim()) {
        setMessages((prev) => {
          const nextMessages = [...prev, createMessage('assistant', response.text as string)];
          latestMessagesSignatureRef.current = createMessagesSignature(nextMessages);
          return nextMessages;
        });
      }

      setSessionId(response.sessionId ?? sessionId);
      hydratedUserIdRef.current = authUser.id;
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

                {loadingConversation ? (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Đang tải hội thoại...
                    </div>
                  </div>
                ) : null}

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
                  disabled={sending || loadingConversation || !input.trim()}
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
