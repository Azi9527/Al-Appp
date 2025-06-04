import { useEffect } from 'react';
import useChatStore from '../store/chatStore';
import { saveChatHistory, loadChatHistory } from '../utils/helpers';

const useChat = () => {
  const { messages, addMessage, clearMessages, setLoading, loading, error } = useChatStore();
  
  // 加载聊天历史
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      // 清空当前消息并添加历史消息
      clearMessages();
      history.forEach(msg => addMessage(msg));
    }
  }, []);
  
  // 保存聊天历史
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);
  
  return {
    messages,
    addMessage,
    clearMessages,
    setLoading,
    loading,
    error,
  };
};

export default useChat;