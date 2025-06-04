import { create } from 'zustand';

// 在现有的chatStore中添加以下功能
const useChatStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  
  // 添加新消息
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  // 设置加载状态
  setLoading: (status) => set({ loading: status }),
  
  // 设置错误
  setError: (error) => set({ error }),
  
  // 清空消息
  clearMessages: () => set({ messages: [] }),
  
  chatHistory: [],
  currentChatId: null,
  
  // 创建新对话
  createNewChat: () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: '新对话',
      lastMessage: '',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    set((state) => ({
      chatHistory: [newChat, ...state.chatHistory],
      currentChatId: newChatId,
      messages: []
    }));
  },
  
  // 选择对话
  selectChat: (chatId) => {
    const chat = get().chatHistory.find(c => c.id === chatId);
    if (chat) {
      set({
        currentChatId: chatId,
        messages: chat.messages || []
      });
    }
  },
  
  // 删除对话
  deleteChat: (chatId) => {
    set((state) => ({
      chatHistory: state.chatHistory.filter(c => c.id !== chatId),
      currentChatId: state.currentChatId === chatId ? null : state.currentChatId
    }));
  },
  
  // 更新当前对话
  updateCurrentChat: () => {
    const { currentChatId, messages, chatHistory } = get();
    if (currentChatId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      set((state) => ({
        chatHistory: state.chatHistory.map(chat => 
          chat.id === currentChatId 
            ? {
                ...chat,
                lastMessage: lastMessage.content.substring(0, 50) + '...',
                messages: messages,
                title: messages[0]?.content.substring(0, 20) + '...' || '新对话'
              }
            : chat
        )
      }));
    }
  }
}));

export default useChatStore;