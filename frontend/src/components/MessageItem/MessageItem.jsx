import React, { useRef } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Avatar, 
  useColorModeValue,
  Badge,
  VStack,
  Image
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import logoAvatar from '../../assets/logo-avatar.svg';

// Add formatTime utility function
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const MessageItem = ({ message, isUser }) => {
  const bgColor = useColorModeValue(
    isUser ? 'linear(to-br, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.95)',
    isUser ? 'linear(to-br, #667eea, #764ba2)' : 'rgba(45, 55, 72, 0.9)'
  );
  
  const textColor = useColorModeValue(
    isUser ? 'white' : 'gray.800',  // 修改：使用更深的颜色确保可读性
    isUser ? 'white' : 'gray.100'
  );
  
  // Move all useColorModeValue calls to component level
  const inlineCodeBg = useColorModeValue('gray.200', 'gray.600');  // 修改：使用更深的背景
  const aiCodeBg = useColorModeValue('gray.200', 'whiteAlpha.200');  // 修改：使用更深的背景
  const preCodeBg = useColorModeValue('gray.200', 'gray.800');  // 修改：使用更深的背景
  const codeTextColor = useColorModeValue('gray.800', 'gray.100');  // 新增：代码文字颜色
  
  return (
    <Flex 
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      align="flex-start"
      mb={2}
    >
      {!isUser && (
        <Avatar 
          size="sm" 
          bg="transparent"
          mr={3}
          icon={<Image src={logoAvatar} alt="TriSense AI" boxSize="24px" />}
        />
      )}
      
      <VStack 
        align={isUser ? 'flex-end' : 'flex-start'}
        spacing={1}
        maxW="80%"
      >
        <Box
          bgGradient={bgColor}
          backdropFilter="blur(10px)"
          p={5}
          borderRadius={isUser ? '24px 24px 8px 24px' : '24px 24px 24px 8px'}
          color={textColor}
          boxShadow="xl"
          border="none"
          position="relative"
          transition="all 0.2s ease"
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: '2xl'
          }}
        >
          {/* 消息内容 */}
          {message.type === 'image' ? (
            <VStack spacing={3} align="start">
              <Image 
                src={message.content} 
                alt="上传的图片" 
                maxW="300px" 
                borderRadius="xl"
                boxShadow="lg"
              />
              {message.text && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    p: ({children}) => <Text mb={2} lineHeight="1.6">{children}</Text>,
                    code: ({children}) => (
                      <Text 
                        as="code" 
                        bg={inlineCodeBg}
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        fontSize="sm"
                      >
                        {children}
                      </Text>
                    )
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </VStack>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                p: ({children}) => <Text mb={2} lineHeight="1.7" fontSize="md">{children}</Text>,
                h1: ({children}) => <Text fontSize="xl" fontWeight="bold" mb={3}>{children}</Text>,
                h2: ({children}) => <Text fontSize="lg" fontWeight="semibold" mb={2}>{children}</Text>,
                code: ({children}) => (
                  <Text 
                    as="code" 
                    bg={aiCodeBg}
                    color={codeTextColor}  // 新增：明确设置代码文字颜色
                    px={2} 
                    py={1} 
                    borderRadius="md" 
                    fontSize="sm"
                  >
                    {children}
                  </Text>
                ),
                pre: ({children}) => (
                  <Box 
                    as="pre" 
                    bg={preCodeBg}
                    color={codeTextColor}  // 新增：明确设置代码块文字颜色
                    p={4} 
                    borderRadius="xl" 
                    overflow="auto"
                    my={3}
                    fontSize="sm"
                  >
                    {children}
                  </Box>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </Box>
        
        <Text fontSize="xs" color="gray.400" px={2}>
          {formatTime(message.timestamp)}
        </Text>
      </VStack>
      
      {isUser && (
        <Avatar 
          size="sm" 
          bg="linear(to-r, #667eea, #764ba2)"
          color="white"
          ml={3}
          icon={<Text fontSize="md">👤</Text>}
        />
      )}
    </Flex>
  );
};

export default MessageItem;