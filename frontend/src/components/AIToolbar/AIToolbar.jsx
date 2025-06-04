import React from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const AIToolbar = () => {
  const toolbarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={toolbarBg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
    >
      <Flex align="center" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          企业智能助手
        </Text>
      </Flex>
    </Box>
  );
};

export default AIToolbar;