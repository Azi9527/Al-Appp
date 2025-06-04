import { STORAGE_KEYS } from './constants';

// 保存聊天历史到本地存储
export const saveChatHistory = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('保存聊天历史失败:', error);
    return false;
  }
};

// 从本地存储加载聊天历史
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('加载聊天历史失败:', error);
    return [];
  }
};

// 格式化日期时间
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};