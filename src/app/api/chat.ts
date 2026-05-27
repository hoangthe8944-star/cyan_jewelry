import { API_BASE_URL, FALLBACK_API_BASE_URL } from './client';

const DEFAULT_CHAT_API_PATH = '/api/chat/conversations';
const DEFAULT_CHAT_CUSTOMER_NAME = 'Khách hàng website';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  text?: string | null;
  sessionId?: string | null;
  conversationCode?: string | null;
}

export interface ChatConversation {
  id: string;
  conversationCode: string | null;
  messages: ChatMessagePayload[];
}

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

function isAssistantRole(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim().toUpperCase();
  return ['ASSISTANT', 'AI', 'BOT', 'SYSTEM', 'ADMIN', 'STAFF'].includes(normalizedValue);
}

function isUserRole(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim().toUpperCase();
  return ['USER', 'CUSTOMER', 'CLIENT', 'BUYER', 'GUEST'].includes(normalizedValue);
}

function readRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readTextFromUnknown(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const directKeys = ['reply', 'response', 'answer', 'content', 'text', 'message', 'body'];

  for (const key of directKeys) {
    const nestedValue = record[key];
    if (typeof nestedValue === 'string' && nestedValue.trim()) {
      return nestedValue.trim();
    }
  }

  return null;
}

function readConversationId(value: unknown): string | null {
  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const nestedConversation = readRecord(record.conversation);
  const candidate =
    record.id ??
    record.conversationId ??
    record.sessionId ??
    nestedConversation?.id ??
    nestedConversation?.conversationId ??
    null;

  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
}

function readConversationCode(value: unknown): string | null {
  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const nestedConversation = readRecord(record.conversation);
  const candidate =
    record.conversationCode ??
    record.code ??
    nestedConversation?.conversationCode ??
    nestedConversation?.code ??
    null;

  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
}

function readDirectReply(value: unknown): string | null {
  const record = readRecord(value);
  if (!record) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  const directKeys = ['reply', 'response', 'answer'];

  for (const key of directKeys) {
    const nestedValue = record[key];
    if (typeof nestedValue === 'string' && nestedValue.trim()) {
      return nestedValue.trim();
    }
  }

  return null;
}

function readMessageRole(value: unknown): ChatMessagePayload['role'] | null {
  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const rawRole =
    record.role ??
    record.senderRole ??
    record.senderType ??
    record.authorRole ??
    record.authorType ??
    record.messageRole;

  if (isAssistantRole(rawRole)) {
    return 'assistant';
  }

  if (isUserRole(rawRole)) {
    return 'user';
  }

  return null;
}

function readMessages(value: unknown): ChatMessagePayload[] {
  const record = readRecord(value);
  if (!record) {
    return [];
  }

  const collections = [record.messages, record.items, record.content];

  for (const collection of collections) {
    if (!Array.isArray(collection)) {
      continue;
    }

    const messages = collection
      .map((item) => {
        const role = readMessageRole(item);
        const content = readTextFromUnknown(item);

        if (!role || !content) {
          return null;
        }

        return {
          role,
          content,
        } satisfies ChatMessagePayload;
      })
      .filter((message): message is ChatMessagePayload => Boolean(message));

    if (messages.length) {
      return messages;
    }
  }

  return [];
}

async function extractErrorText(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const payload = await response.json();
      const text = readTextFromUnknown(payload);

      if (text) {
        return text;
      }

      if (Array.isArray((payload as Record<string, unknown>)?.message)) {
        return ((payload as Record<string, unknown>).message as unknown[]).join(', ');
      }

      return JSON.stringify(payload);
    } catch {
      return `Yêu cầu thất bại: ${response.status}`;
    }
  }

  const text = (await response.text()).trim();
  return text || `Yêu cầu thất bại: ${response.status}`;
}

async function performRequest(path: string, init: RequestInit) {
  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim();
  const primaryTarget = chatApiUrl
    ? isAbsoluteUrl(chatApiUrl)
      ? `${chatApiUrl}${path}`
      : buildUrl(API_BASE_URL, `${chatApiUrl}${path}`)
    : buildUrl(API_BASE_URL, path);
  const fallbackTarget = chatApiUrl
    ? isAbsoluteUrl(chatApiUrl)
      ? `${chatApiUrl}${path}`
      : buildUrl(FALLBACK_API_BASE_URL, `${chatApiUrl}${path}`)
    : buildUrl(FALLBACK_API_BASE_URL, path);

  try {
    return await fetch(primaryTarget, init);
  } catch (error) {
    if (!isNetworkError(error) || API_BASE_URL === FALLBACK_API_BASE_URL) {
      throw error;
    }

    return fetch(fallbackTarget, init);
  }
}

function withCustomerPath(basePath: string, customerUserId: string, suffix = '') {
  return `${basePath}/customer/${encodeURIComponent(customerUserId)}${suffix}`;
}

async function requestJson(path: string, init: RequestInit) {
  const response = await performRequest(path, init);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Không tìm thấy chat API tại ${path}.`);
    }

    throw new Error(await extractErrorText(response));
  }

  return response.json();
}

function normalizeConversation(payload: unknown): ChatConversation {
  const id = readConversationId(payload);

  if (!id) {
    throw new Error('Frontend chưa đọc được conversation id từ chat API.');
  }

  return {
    id,
    conversationCode: readConversationCode(payload),
    messages: readMessages(payload),
  };
}

async function createConversation(basePath: string, initialMessage: string, customerName: string, userId: string) {
  const resolvedCustomerName =
    customerName.trim() || import.meta.env.VITE_CHAT_CUSTOMER_NAME?.trim() || DEFAULT_CHAT_CUSTOMER_NAME;
  const payload = await requestJson(basePath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
    body: JSON.stringify({
      customerUserId: userId,
      customerName: resolvedCustomerName,
      message: initialMessage,
    }),
  });

  const conversation = normalizeConversation(payload);

  return {
    conversationId: conversation.id,
    conversationCode: conversation.conversationCode,
    text: readDirectReply(payload),
  };
}

export async function listChatConversations(customerUserId: string) {
  const basePath = import.meta.env.VITE_CHAT_API_PATH?.trim() || DEFAULT_CHAT_API_PATH;
  const query = `?customerUserId=${encodeURIComponent(customerUserId)}`;
  const payload = await requestJson(`${basePath}${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => {
      const id = readConversationId(item);

      if (!id) {
        return null;
      }

      return {
        id,
        conversationCode: readConversationCode(item),
      };
    })
    .filter((item): item is { id: string; conversationCode: string | null } => Boolean(item));
}

export async function getChatConversationForCustomer(customerUserId: string, conversationId: string) {
  const basePath = import.meta.env.VITE_CHAT_API_PATH?.trim() || DEFAULT_CHAT_API_PATH;
  const payload = await requestJson(
    withCustomerPath(basePath, customerUserId, `/${encodeURIComponent(conversationId)}`),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return normalizeConversation(payload);
}

export async function markChatConversationRead(customerUserId: string, conversationId: string) {
  const basePath = import.meta.env.VITE_CHAT_API_PATH?.trim() || DEFAULT_CHAT_API_PATH;

  await requestJson(withCustomerPath(basePath, customerUserId, `/${encodeURIComponent(conversationId)}/read`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function sendChatMessage(params: {
  message: string;
  history: ChatMessagePayload[];
  sessionId?: string | null;
  userId: string;
  customerName: string;
}) {
  const basePath = import.meta.env.VITE_CHAT_API_PATH?.trim() || DEFAULT_CHAT_API_PATH;
  const conversation =
    params.sessionId
      ? {
          conversationId: params.sessionId,
          conversationCode: null,
          text: null,
        }
      : await createConversation(basePath, params.message, params.customerName, params.userId);

  if (!params.sessionId) {
    return {
      text: conversation.text,
      sessionId: conversation.conversationId,
      conversationCode: conversation.conversationCode,
    } satisfies ChatResponse;
  }

  const payload = await requestJson(
    withCustomerPath(basePath, params.userId, `/${encodeURIComponent(conversation.conversationId)}/messages`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': params.userId,
      },
      body: JSON.stringify({
        message: params.message,
      }),
    }
  );

  return {
    text: readDirectReply(payload),
    sessionId: readConversationId(payload) ?? conversation.conversationId,
    conversationCode: readConversationCode(payload) ?? conversation.conversationCode,
  } satisfies ChatResponse;
}

export async function getLatestChatConversation(customerUserId: string) {
  const conversations = await listChatConversations(customerUserId);
  const latestConversation = conversations[0];

  if (!latestConversation) {
    return null;
  }

  return getChatConversationForCustomer(customerUserId, latestConversation.id);
}
