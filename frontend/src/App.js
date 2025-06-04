import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Flex, IconButton, useColorMode, useColorModeValue, Text } from '@chakra-ui/react';
import ChatWindow from './components/ChatWindow';
import ChatHistory from './components/ChatHistory';
// 删除这行：import AIToolbar from './components/AIToolbar';
import useChatStore from './store/chatStore';

// 创建React Query客户端
const queryClient = new QueryClient();

// 内部组件，使用Chakra hooks
function AppContent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { chatHistory, currentChatId, createNewChat, selectChat, deleteChat } = useChatStore();

  return (
    <Box 
      minH="100vh" 
      bg={bgColor}
      color={textColor}
    >
      {/* 删除：移除原来的主题切换按钮 */}
      
      <Flex h="100vh">
        {/* 左侧边栏 - 历史聊天记录 */}
        <ChatHistory
          onNewChat={createNewChat}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />
        
        {/* 主体区域 */}
        <Flex direction="column" flex={1}>
          {/* 聊天窗口 */}
          <Box flex={1} overflow="hidden">
            <ChatWindow />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

// 主App组件
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
