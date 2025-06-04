import { create } from 'zustand';

// AI功能类型
const AI_TYPES = {
  TEXT_CHAT: 'text_chat',
  IMAGE_ANALYSIS: 'image_analysis',
  CONTRACT_REVIEW: 'contract_review',
  DATA_ANALYSIS: 'data_analysis'
};

const useAIStore = create((set) => ({
  // 当前选择的AI功能
  currentAI: AI_TYPES.TEXT_CHAT,
  
  // AI功能列表
  aiTypes: [
    { id: AI_TYPES.TEXT_CHAT, name: '智能对话', icon: 'chat' },
    { id: AI_TYPES.IMAGE_ANALYSIS, name: '智能信息提取', icon: 'image' },
    { id: AI_TYPES.CONTRACT_REVIEW, name: '智能合同审查', icon: 'description' },
    { id: AI_TYPES.DATA_ANALYSIS, name: '智能数据分析', icon: 'analytics' }
  ],
  
  // 切换AI功能
  setCurrentAI: (aiType) => set({ currentAI: aiType }),
}));

export { AI_TYPES };
export default useAIStore;