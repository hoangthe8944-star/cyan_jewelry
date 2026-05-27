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

    const authUser = getAuthUser();
    if (!authUser) {
      return;
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
    <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex items-end justify-end">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mb-4 w-[min(92vw,380px)] overflow-hidden border border-[rgba(17,33,45,0.14)] bg-white shadow-[0_30px_90px_rgba(17,33,45,0.22)]"
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

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_55px_rgba(17,33,45,0.28)] transition-all duration-300 hover:bg-secondary"
        aria-label={isOpen ? 'Ẩn chat' : 'Mở chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircleMore className="h-7 w-7" />}
      </button>
    </div>
  );
}
