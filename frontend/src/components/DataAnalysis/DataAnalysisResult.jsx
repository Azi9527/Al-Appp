import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useColorModeValue,
  Button,
  useToast,
  Code,
  Divider
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import * as vegaEmbed from 'vega-embed';

const DataAnalysisResult = ({ records, vega, sql, isLoading, error }) => {
  const chartRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const sqlBgColor = useColorModeValue('gray.50', 'gray.900');
  
  // 渲染Vega图表
  useEffect(() => {
    if (vega && vega.vegaSpec && chartRef.current) {
      vegaEmbed.default(chartRef.current, vega.vegaSpec, {
        theme: 'light',
        actions: false,
        renderer: 'svg'
      }).catch(error => {
        console.error('Vega图表渲染失败:', error);
      });
    }
  }, [vega]);
  
  // 复制SQL到剪贴板
  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      toast({
        title: "SQL已复制到剪贴板",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动选择并复制SQL语句",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  if (isLoading) {
    return (
      <Center py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" />
          <Text>正在分析数据...</Text>
        </VStack>
      </Center>
    );
  }
  
  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text>数据分析失败: {error}</Text>
      </Alert>
    );
  }
  
  if (!records && !vega && !sql) {
    return null;
  }
  
  return (
    <VStack spacing={6} align="stretch">
      {/* SQL查询语句 */}
      {sql && (
        <Box
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
        >
          <VStack align="stretch" spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                🔍 执行的SQL查询
              </Text>
              <Button
                size="sm"
                leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
                colorScheme={copied ? "green" : "blue"}
                variant="outline"
                onClick={handleCopySQL}
              >
                {copied ? "已复制" : "复制SQL"}
              </Button>
            </Box>
            <Box
              bg={sqlBgColor}
              p={4}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              fontFamily="mono"
              fontSize="sm"
              overflow="auto"
              maxH="200px"
            >
              <Code
                display="block"
                whiteSpace="pre-wrap"
                bg="transparent"
                p={0}
                fontSize="sm"
                fontFamily="'Fira Code', 'Monaco', 'Consolas', monospace"
              >
                {sql}
              </Code>
            </Box>
          </VStack>
        </Box>
      )}
      
      {/* 数据表格 */}
      {records && records.records && records.records.length > 0 && (
        <Box
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            📊 查询结果
          </Text>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {records.columns?.map((column, index) => (
                    <Th key={index}>{column.name}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {records.records.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {records.columns?.map((column, colIndex) => (
                      <Td key={colIndex}>{row[column.name]}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Text fontSize="sm" color="gray.500" mt={2}>
            总计 {records.totalRows} 行数据
          </Text>
        </Box>
      )}

      {/* Vega图表 */}
      {vega && vega.vegaSpec && (
        <Box
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            📈 数据可视化
          </Text>
          <Box
            ref={chartRef}
            minH="300px"
            w="100%"
            borderRadius="md"
            overflow="hidden"
          />
        </Box>
      )}
    </VStack>
  );
};

export default DataAnalysisResult;