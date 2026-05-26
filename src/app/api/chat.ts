import { API_BASE_URL, FALLBACK_API_BASE_URL } from "./client";

const DEFAULT_CHAT_API_PATH = "/api/chat/conversations";

export interface ChatMessagePayload {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  text: string;
  sessionId?: string | null;
  conversationCode?: string | null;
}

const DEFAULT_CHAT_CUSTOMER_NAME = "Khách hàng website";

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

function isAssistantRole(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  const normalizedValue = value.trim().toUpperCase();
  return ["ASSISTANT", "AI", "BOT", "SYSTEM", "ADMIN", "STAFF"].includes(normalizedValue);
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readTextFromUnknown(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const directKeys = ["reply", "response", "answer", "content", "text", "message", "body"];

  for (const key of directKeys) {
    const nestedValue = record[key];
    if (typeof nestedValue === "string" && nestedValue.trim()) {
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

  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

function readConversationCode(value: unknown): string | null {
  const record = readRecord(value);
  if (!record) {
    return null;
  }

  const nestedConversation = readRecord(record.conversation);
  const candidate = record.conversationCode ?? record.code ?? nestedConversation?.conversationCode ?? nestedConversation?.code ?? null;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

function readAssistantReply(value: unknown): string | null {
  const record = readRecord(value);
  if (!record) {
    return readTextFromUnknown(value);
  }

  const directText = readTextFromUnknown(record);
  if (directText) {
    return directText;
  }

  const messageCollections = [record.messages, record.items, record.content];

  for (const collection of messageCollections) {
    if (!Array.isArray(collection)) {
      continue;
    }

    const assistantMessage = [...collection]
      .reverse()
      .find((item) => {
        const messageRecord = readRecord(item);
        if (!messageRecord) {
          return false;
        }

        return isAssistantRole(
          messageRecord.role ??
            messageRecord.senderRole ??
            messageRecord.senderType ??
            messageRecord.authorRole ??
            messageRecord.authorType
        );
      });

    const assistantText = readTextFromUnknown(assistantMessage);
    if (assistantText) {
      return assistantText;
    }
  }

  return null;
}

async function extractErrorText(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = await response.json();
      const text = readTextFromUnknown(payload);

      if (text) {
        return text;
      }

      if (Array.isArray((payload as Record<string, unknown>)?.message)) {
        return ((payload as Record<string, unknown>).message as unknown[]).join(", ");
      }

      return JSON.stringify(payload);
    } catch {
      return `Request failed: ${response.status}`;
    }
  }

  const text = (await response.text()).trim();
  return text || `Request failed: ${response.status}`;
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

async function createConversation(basePath: string, initialMessage: string, customerName: string, userId: string) {
  const resolvedCustomerName = customerName.trim() || import.meta.env.VITE_CHAT_CUSTOMER_NAME?.trim() || DEFAULT_CHAT_CUSTOMER_NAME;
  const response = await performRequest(basePath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
    },
    body: JSON.stringify({
      customerName: resolvedCustomerName,
      message: initialMessage,
    }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Không tìm thấy chat API tại ${basePath}.`);
    }

    throw new Error(await extractErrorText(response));
  }

  const payload = await response.json();
  const conversationId = readConversationId(payload);

  if (!conversationId) {
    throw new Error("Chat API đã tạo hội thoại nhưng frontend chưa đọc được conversation id.");
  }

  return {
    conversationId,
    conversationCode: readConversationCode(payload),
    text:
      readAssistantReply(payload) ??
      "Tin nhắn của bạn đã được gửi. Tư vấn viên sẽ phản hồi sớm nhất có thể.",
  };
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
      text: conversation.text ?? "Tin nhắn của bạn đã được gửi.",
      sessionId: conversation.conversationId,
      conversationCode: conversation.conversationCode,
    } satisfies ChatResponse;
  }

  const response = await performRequest(`${basePath}/${conversation.conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": params.userId,
    },
    body: JSON.stringify({
      message: params.message,
    }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Không tìm thấy endpoint gửi tin nhắn tại ${basePath}/${conversation.conversationId}/messages.`);
    }

    throw new Error(await extractErrorText(response));
  }

  const payload = await response.json();
  const text = readAssistantReply(payload);

  if (!text) {
    throw new Error("Chat API đã nhận tin nhắn nhưng chưa trả về nội dung phản hồi của assistant.");
  }

  return {
    text,
    sessionId: readConversationId(payload) ?? conversation.conversationId,
    conversationCode: readConversationCode(payload) ?? conversation.conversationCode,
  } satisfies ChatResponse;
}
