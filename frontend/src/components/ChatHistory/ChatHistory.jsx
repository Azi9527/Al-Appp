import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  IconButton,
  Flex,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

const ChatHistory = ({ onNewChat, chatHistory = [], currentChatId, onSelectChat, onDeleteChat }) => {
  const sidebarBg = useColorModeValue('rgba(247, 250, 252, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const hoverBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(45, 55, 72, 0.8)');
  // 修改：为浅色和深色主题使用不同的激活背景
  const activeBg = useColorModeValue('gray.200', 'linear(to-r, #667eea, #764ba2)');
  const textColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  // 修改：选中状态的文字颜色也要动态调整
  const activeTextColor = useColorModeValue('gray.800', 'white');
  const activeLabelColor = useColorModeValue('gray.600', 'whiteAlpha.800');
  const buttonTextColor = useColorModeValue('gray.800', 'white');
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      w="300px"
      h="100vh"
      bg={sidebarBg}
      backdropFilter="blur(10px)"
      p={6}
      borderRight="none"
      color={textColor}
    >
      <Button
        bg={buttonBg}  // 使用淡色背景
        color={buttonTextColor}  // 使用动态文字颜色
        w="full"
        mb={6}
        onClick={onNewChat}
        borderRadius="xl"
        py={6}
        fontSize="md"
        fontWeight="600"
        _hover={{
          bg: buttonHoverBg,
          transform: 'translateY(-1px)',
          boxShadow: 'xl'
        }}
        transition="all 0.2s ease"
      >
        ✨ 新建对话
      </Button>
      
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" fontWeight="600" color={labelColor} mb={2} px={2}>
          历史对话
        </Text>
        
        {chatHistory.map((chat) => (
          <Box
            key={chat.id}
            p={4}
            borderRadius="xl"
            cursor="pointer"
            bg={currentChatId === chat.id ? activeBg : 'transparent'}
            // 移除这里的color设置，让子元素单独控制颜色
            _hover={{ 
              bg: currentChatId === chat.id ? activeBg : hoverBg,
              transform: 'translateX(4px)'
            }}
            onClick={() => onSelectChat(chat.id)}
            transition="all 0.2s ease"
            position="relative"
            overflow="hidden"
          >
            <Flex align="center">
              <Text 
                mr={3} 
                fontSize="lg"
                color={currentChatId === chat.id ? activeTextColor : textColor}
              >
                💬
              </Text>
              <Box flex={1} overflow="hidden">
                <Text 
                  fontSize="sm" 
                  fontWeight="500" 
                  noOfLines={1}
                  color={currentChatId === chat.id ? activeTextColor : textColor}
                >
                  {chat.title || '新对话'}
                </Text>
                <Text 
                  fontSize="xs" 
                  color={currentChatId === chat.id ? activeLabelColor : labelColor}
                  noOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </Box>
              <IconButton
                aria-label="删除对话"
                size="sm"
                variant="ghost"
                colorScheme="red"
                borderRadius="lg"
                opacity={0.7}
                _hover={{ opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                🗑️
              </IconButton>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ChatHistory;