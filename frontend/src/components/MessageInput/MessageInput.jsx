import React, { useState, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Button, 
  IconButton,
  useColorModeValue,
  Textarea,
  FormControl,
  Text,
  HStack,
  VStack,
  Image,
  CloseButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip
} from '@chakra-ui/react';
import { AI_TYPES } from '../../store/aiStore';
import useAIStore from '../../store/aiStore';

const MessageInput = ({ onSendMessage, aiType, isLoading }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { currentAI, setCurrentAI, aiTypes } = useAIStore();
  
  const isFileUploadEnabled = aiType !== AI_TYPES.TEXT_CHAT;
  const isImageAnalysis = aiType === AI_TYPES.IMAGE_ANALYSIS;
  
  // 将所有useColorModeValue调用移到组件顶部
  const bgColor = useColorModeValue('white', 'gray.800');
  const filePreviewBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  // 修改：发送按钮文字颜色改为动态
  const buttonTextColor = useColorModeValue('gray.800', 'white');
  // 修改：发送按钮背景改为更淡的颜色
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const menuItemTextColor = useColorModeValue('gray.800', 'white');
  const menuItemDescColor = useColorModeValue('gray.500', 'gray.400');
  
  // AI工具图标和描述映射
  const aiToolsConfig = {
    [AI_TYPES.TEXT_CHAT]: {
      icon: '💬',
      name: '智能对话',
      description: '通用AI对话助手'
    },
    [AI_TYPES.IMAGE_ANALYSIS]: {
      icon: '👁️',
      name: '智能信息提取', 
      description: '智能图像内容分析与信息提取'
    },
    [AI_TYPES.CONTRACT_REVIEW]: {
      icon: '📄',
      name: '智能合同审查',
      description: '智能合同条款分析与风险识别'
    },
    [AI_TYPES.DATA_ANALYSIS]: {
      icon: '📊',
      name: '智能数据分析',
      description: '智能数据洞察与趋势分析'
    }
  };
  
  const currentTool = aiToolsConfig[currentAI] || aiToolsConfig[AI_TYPES.TEXT_CHAT];
  
  const handleSend = () => {
    if (isLoading) return;
    
    if (isImageAnalysis && files.length > 0) {
      if (!message.trim()) {
        toast({
          title: '请输入提示词',
          description: '图片识别需要输入提示词来指导AI分析',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      console.log('MessageInput - 发送图片消息:', {
        file: files[0].name,
        prompt: message.trim(),
        promptLength: message.trim().length
      });
      onSendMessage(files[0], 'file', message.trim());
    } else if (message.trim()) {
      onSendMessage(message.trim(), 'text');
    }
    
    setMessage('');
    setFiles([]);
    setPreviewUrl(null);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      setFiles([file]);
      
      if (isImageAnalysis && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = () => {
    setFiles([]);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getPlaceholder = () => {
    if (isImageAnalysis && files.length > 0) {
      return '请输入提示词来指导AI分析图片内容...';
    }
    
    switch (currentAI) {
      case AI_TYPES.IMAGE_ANALYSIS:
        return '上传图片并输入提示词进行分析...';
      case AI_TYPES.CONTRACT_REVIEW:
        return '上传合同文件或输入合同内容进行审核...';
      case AI_TYPES.DATA_ANALYSIS:
        return '上传数据文件或输入数据进行分析...';
      default:
        return '输入您的问题...';
    }
  };
  
  return (
    <Box 
      p={6} 
      bg={bgColor}
      borderRadius="24px 24px 0 0"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor={borderColor}  // 使用预定义变量
      color={textColor}
    >
      {/* 文件预览区域 */}
      {files.length > 0 && (
        <Box mb={4}>
          {files.map((file, index) => (
            <Box
              key={index}
              p={3}
              bg={filePreviewBg}
              borderRadius="xl"
              mb={2}
              position="relative"
            >
              <Flex align="center" gap={3}>
                {isImageAnalysis && previewUrl ? (
                  <Image 
                    src={previewUrl} 
                    alt="预览图片" 
                    maxW="100px" 
                    maxH="100px" 
                    borderRadius="lg"
                    objectFit="cover"
                  />
                ) : (
                  <Text fontSize="lg">📎</Text>
                )}
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color={placeholderColor}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </VStack>
              </Flex>
              <CloseButton 
                size="sm" 
                position="absolute"
                top={2}
                right={2}
                onClick={removeFile} 
              />
            </Box>
          ))}
        </Box>
      )}
      
      <FormControl>
        <Flex align="end" gap={3}>
          {/* AI功能选择按钮 */}
          <Menu>
            <Tooltip label={currentTool.description} placement="top">
              <MenuButton
                as={IconButton}
                icon={<Text fontSize="xl">{currentTool.icon}</Text>}
                variant="ghost"
                borderRadius="xl"
                size="lg"
                aria-label={currentTool.description}
                bg="linear(to-r, #667eea, #764ba2)"
                color="white"
                _hover={{
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s ease"
              />
            </Tooltip>
            <MenuList>
              {Object.entries(aiToolsConfig).map(([key, config]) => (
                <MenuItem
                  key={key}
                  onClick={() => setCurrentAI(key)}
                  bg={currentAI === key ? 'blue.50' : 'transparent'}
                  _hover={{ bg: 'blue.50' }}
                >
                  <HStack spacing={3}>
                    <Text fontSize="lg">{config.icon}</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium" color={menuItemTextColor}>{config.name}</Text>
                      <Text fontSize="xs" color={menuItemDescColor}>{config.description}</Text>
                    </VStack>
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          
          {/* 文件上传按钮 */}
          {isFileUploadEnabled && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept={isImageAnalysis ? 'image/*' : '.pdf,.doc,.docx,.txt,.csv,.xlsx'}
              />
              <Tooltip label="上传文件" placement="top">
                <IconButton
                  icon={<Text fontSize="xl">{isImageAnalysis ? '🖼️' : '📎'}</Text>}
                  onClick={triggerFileInput}
                  aria-label="上传文件"
                  variant="ghost"
                  size="lg"
                  borderRadius="xl"
                  color={textColor}
                  _hover={{
                    bg: hoverBg,
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s ease"
                />
              </Tooltip>
            </>
          )}
          
          {/* 输入框 */}
          <Textarea
            placeholder={getPlaceholder()}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            resize="none"
            rows={1}
            flexGrow={1}
            borderRadius="xl"
            border="none"
            bg="transparent"
            color={textColor}
            _placeholder={{
              color: placeholderColor
            }}
            _focus={{
              outline: 'none',
              boxShadow: 'none'
            }}
            fontSize="md"
            py={3}
          />
          
          {/* 发送按钮 */}
          <Button
            bg={buttonBg}  // 使用淡色背景
            color={buttonTextColor}  // 使用动态文字颜色
            onClick={handleSend}
            isLoading={isLoading}
            loadingText="发送中"
            isDisabled={isLoading || (isImageAnalysis && files.length > 0 && !message.trim())}
            borderRadius="xl"
            px={6}
            py={3}
            fontWeight="600"
            _hover={{
              bg: buttonHoverBg,
              transform: 'translateY(-1px)',
              boxShadow: 'xl'
            }}
            transition="all 0.2s ease"
          >
            发送
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default MessageInput;