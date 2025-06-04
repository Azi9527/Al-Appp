import { fetchAPI } from './api';
import { AI_TYPES } from '../store/aiStore';
import { callDifyWorkflow } from './difyService';

// 基础API配置
// 更新API地址 - 使用localhost进行本地开发
const IMAGE_API_URL = 'http://localhost:8008/internvl/chat';
// 或者如果需要局域网访问，保持原地址
// const IMAGE_API_URL = 'http://192.168.3.8:8008/internvl/chat';

// 发送文本消息
export const sendTextMessage = async (message) => {
  // 这里可以集成您的文本聊天API
  return { result: `回复: ${message}` };
};

// 上传并分析图片 - 修改为发送base64格式
export const analyzeImage = async (imageFile, prompt = '') => {
  // 将图片转换为base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // 创建AbortController用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10分钟超时

  try {
    console.log(`开始图片识别请求: ${new Date().toLocaleString()}`);
    console.log(`文件名: ${imageFile.name}`);
    console.log(`文件大小: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`接收到的原始prompt: "${prompt}"`);
    console.log(`prompt参数类型: ${typeof prompt}`);
    console.log(`prompt参数长度: ${prompt ? prompt.length : 'null/undefined'}`);

    // 转换图片为base64
    const base64Image = await convertToBase64(imageFile);
    
    // 使用用户输入的prompt，如果为空才使用默认值
    const actualPrompt = prompt && prompt.trim() ? prompt.trim() : '请描述这张图片';
    
    console.log(`实际使用的提示词: "${actualPrompt}"`);
    
    // 准备JSON数据
    const requestData = {
      image: base64Image,
      question: actualPrompt
    };
    
    // 添加调试日志
    console.log('准备发送的请求数据 question 字段:', requestData.question);

    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`收到响应: ${new Date().toLocaleString()}`);
    console.log(`响应状态: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.text();
      } catch {
        errorDetails = '无法读取错误详情';
      }
      
      throw new Error(`图片识别API错误 [${response.status}] ${errorDetails}`);
    }

    const data = await response.json();
    console.log(`API响应数据:`, data);
    
    return {
      result: data.response || data.result || '识别完成，但未返回结果',
      success: true
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('图片识别请求超时');
      throw new Error('图片识别请求超时，请重试');
    }
    
    console.error('图片识别错误:', error);
    throw error;
  }
};

// 审查合同
export const reviewContract = async (contractFile) => {
  const formData = new FormData();
  formData.append('contract', contractFile);
  
  return fetchAPI('/review-contract', {
    method: 'POST',
    headers: {}, // 不设置Content-Type，让浏览器自动设置
    body: formData,
  });
};

// 更新数据分析函数
export const analyzeData = async (content) => {
  try {
    // 调用Dify工作流
    const result = await callDifyWorkflow(content);
    
    if (!result.success) {
      throw new Error(result.error || '数据分析失败');
    }

    return {
      success: true,
      content: '数据分析完成',
      analysisResult: {
        records: result.records,
        vega: result.vega,
        sql: result.sql,  // 确保这一行存在
        task_id: result.task_id,
        workflow_run_id: result.workflow_run_id
      }
    };
  } catch (error) {
    console.error('数据分析失败:', error);
    throw new Error(`数据分析失败: ${error.message}`);
  }
};

// 辅助函数：读取文件内容
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// 根据AI类型获取对应的服务函数
export const getServiceByType = (type) => {
  switch (type) {
    case AI_TYPES.TEXT_CHAT:
      return sendTextMessage;
    case AI_TYPES.IMAGE_ANALYSIS:
      return analyzeImage;
    case AI_TYPES.CONTRACT_REVIEW:
      return reviewContract;
    case AI_TYPES.DATA_ANALYSIS:
      return analyzeData;
    default:
      return sendTextMessage;
  }
};