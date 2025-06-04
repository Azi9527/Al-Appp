import { useQuery, useMutation } from '@tanstack/react-query';

// 基础API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// 通用请求函数 - 增加超时设置
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 创建AbortController用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10分钟超时
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText
        };
      }
      
      // 详细错误信息
      const errorMessage = `请求失败 [${response.status}]\n` +
        `状态: ${response.statusText}\n` +
        `详情: ${errorDetails.message || errorDetails.error || '未知错误'}\n` +
        `URL: ${url}\n` +
        `时间: ${new Date().toLocaleString()}`;
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`请求超时 (超过5分钟)\n` +
        `URL: ${url}\n` +
        `时间: ${new Date().toLocaleString()}`);
    }
    
    // 网络错误或其他错误
    if (error.message.includes('请求失败')) {
      throw error; // 已经是格式化的错误
    }
    
    throw new Error(`网络错误\n` +
      `详情: ${error.message}\n` +
      `URL: ${url}\n` +
      `时间: ${new Date().toLocaleString()}`);
  }
};

export { fetchAPI };