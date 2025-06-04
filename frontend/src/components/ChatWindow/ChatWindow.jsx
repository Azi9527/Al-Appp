import React, { useRef } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Spinner, 
  Center, 
  Flex,
  Badge,
  useColorModeValue,
  Divider,
  IconButton,
  useColorMode,
  Image
} from '@chakra-ui/react';
import MessageItem from '../MessageItem';
import MessageInput from '../MessageInput';
import DataAnalysisResult from '../DataAnalysis';
import useChatStore from '../../store/chatStore';
import useAIStore from '../../store/aiStore';
import { AI_TYPES } from '../../store/aiStore';
import { getServiceByType } from '../../services/aiServices';
import { useMutation } from '@tanstack/react-query';
import logoWelcome from '../../assets/logo-welcome.svg';

const ChatWindow = () => {
  const { messages, addMessage, setLoading, loading, error } = useChatStore();
  const { currentAI } = useAIStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const messagesEndRef = useRef(null);
  
  // 将所有useColorModeValue调用移到组件顶部
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, blue.50)',
    'linear(to-br, gray.900, gray.800)'
  );
  
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const loadingBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)');
  
  const glassEffect = {
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    border: 'none'
  };
  
  // 渲染消息内容
  // 渲染消息内容
  const renderMessageContent = (message) => {
    if (message.analysisResult) {
      return (
        <VStack spacing={4} align="stretch">
          <Text>{message.content}</Text>
          <DataAnalysisResult 
            records={message.analysisResult.records}
            vega={message.analysisResult.vega}
            sql={message.analysisResult.sql}  // 添加这一行
            isLoading={false}
            error={null}
          />
        </VStack>
      );
    }
    return <Text>{message.content}</Text>;
  };
  
  const handleSendMessage = async (content, type, prompt) => {
    try {
      setLoading(true);
      
      // 添加用户消息
      const userMessage = {
        id: Date.now(),
        content: type === 'file' ? URL.createObjectURL(content) : content, // 修改：为图片创建预览URL
        type: type === 'file' ? 'image' : 'text', // 添加：设置消息类型
        text: type === 'file' ? prompt : undefined, // 添加：保存提示词
        isUser: true,
        timestamp: new Date().toISOString()
      };
      addMessage(userMessage);
      
      // 调用AI服务
      const service = getServiceByType(currentAI);
      let response;
      
      if (type === 'file') {
        response = await service(content, prompt);
      } else {
        response = await service(content);
      }
      
      // 添加AI回复
      const aiMessage = {
        id: Date.now() + 1,
        content: response.content || response.result || response,
        isUser: false,
        timestamp: new Date().toISOString(),
        analysisResult: response.analysisResult || null
      };
      addMessage(aiMessage);
      
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: `发送失败: ${error.message}`,
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString()
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box 
      height="100%" 
      display="flex" 
      flexDirection="column"
      bg={bgGradient}
      position="relative"
    >
      {/* 现代化毛玻璃头部 */}
      <Box 
        p={6}
        bg={headerBg}
        {...glassEffect}
        position="sticky"
        top={0}
        zIndex={10}
        mx={4}
        mt={4}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Box 
              w={3} 
              h={3} 
              bg="green.400" 
              borderRadius="full" 
              mr={3}
              animation="pulse 2s infinite"
            />
            <Text fontWeight="600" fontSize="xl" letterSpacing="tight">AI助手</Text>
          </Flex>
          <Flex align="center" gap={3}>
            <Badge 
              colorScheme={loading ? 'yellow' : 'green'} 
              variant="subtle"
              borderRadius="full"
              px={4}
              py={1}
              fontSize="sm"
            >
              {loading ? '思考中...' : '在线'}
            </Badge>
            <IconButton
              aria-label="切换主题"
              icon={<Text fontSize="lg">{colorMode === 'light' ? '🌙' : '☀️'}</Text>}
              onClick={toggleColorMode}
              size="sm"
              variant="ghost"
              borderRadius="full"
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s ease"
            />
          </Flex>
        </Flex>
      </Box>
      
      {/* 消息区域 - 无边框设计 */}
      <Box 
        flex="1" 
        overflowY="auto" 
        px={6}
        py={4}
        position="relative"
      >
        {messages.length === 0 ? (
          <Center h="100%" flexDirection="column">
            <Image 
              src={logoWelcome} 
              alt="TriSense AI Assistant" 
              boxSize="120px"
              mb={6}
              opacity={0.8}
              animation="float 3s ease-in-out infinite"
              filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
            />
            <Text color="gray.500" fontSize="2xl" fontWeight="300" textAlign="center" mb={2}>
              您好！我是TriSense AI助手
            </Text>
            <Text color="gray.400" fontSize="md" textAlign="center" maxW="md">
              支持智能对话、信息提取、合同审查和数据分析
            </Text>
          </Center>
        ) : (
          <VStack spacing={8} align="stretch">
            {messages.map((message) => (
              <Box key={message.id}>
                {message.analysisResult ? (
                  renderMessageContent(message)
                ) : (
                  <MessageItem 
                    message={message} 
                    isUser={message.isUser} 
                  />
                )}
                {/* 删除这个重复的数据分析结果渲染部分 */}
                {/* 
                {message.type === 'data_analysis' && (
                  <DataAnalysisResult
                    records={message.data?.records}
                    vega={message.data?.vega}
                    sql={message.data?.sql}
                    isLoading={false}
                    error={message.error}
                  />
                )}
                */}
              </Box>
            ))}
            {loading && (
              <Center py={8}>
                <Flex align="center" 
                  bg={loadingBg}
                  p={6} 
                  borderRadius="2xl"
                  backdropFilter="blur(10px)"
                  boxShadow="xl"
                >
                  <Spinner size="md" mr={4} color="blue.500" thickness="3px" />
                  <Text fontWeight="500" fontSize="lg">AI正在分析中...</Text>
                </Flex>
              </Center>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>
      
      {/* 输入区域 - 浮动设计 */}
      <Box px={6} pb={6}>
        <MessageInput 
          onSendMessage={handleSendMessage}
          aiType={currentAI}
          isLoading={loading}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;