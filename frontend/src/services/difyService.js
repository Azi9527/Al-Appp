// Dify工作流服务
const DIFY_API_BASE = 'http://localhost';
const DIFY_API_KEY = 'app-2uck2Y8otLdKb84D1V0CDjqH';

export const callDifyWorkflow = async (question) => {
  try {
    const response = await fetch(`${DIFY_API_BASE}/v1/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          type: 'TXT',
          question: question
        },
        response_mode: 'blocking',
        user: 'abc-123'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 检查工作流是否成功
    if (data.data.status !== 'succeeded') {
      throw new Error(`工作流执行失败: ${data.data.error || '未知错误'}`);
    }

    // 在解析返回数据的部分，添加sql字段的处理

    // 解析返回的数据
    const { records_str, vega_str, sql } = data.data.outputs;

    let parsedRecords = null;
    let parsedVega = null;
    let parsedSql = null;

    try {
      parsedRecords = JSON.parse(records_str);
    } catch (e) {
      console.warn('解析records_str失败:', e);
    }

    try {
      parsedVega = JSON.parse(vega_str);
    } catch (e) {
      console.warn('解析vega_str失败:', e);
    }

    // 处理SQL字段
    console.log('=== SQL调试信息开始 ===');
    console.log('原始sql数据:', sql);
    console.log('sql数据类型:', typeof sql);
    console.log('sql是否为null:', sql === null);
    console.log('sql是否为undefined:', sql === undefined);
    
    try {
      // SQL应该保持为字符串格式用于显示
      if (typeof sql === 'string') {
        console.log('sql是字符串，内容:', sql);
        // 如果是双重JSON编码，先解析一次获取实际的SQL字符串
        try {
          const parsed = JSON.parse(sql);
          console.log('JSON解析结果:', parsed);
          console.log('解析结果类型:', typeof parsed);
          
          // 如果解析结果是字符串，使用解析后的字符串
          // 如果解析结果是对象且有sql字段，使用该字段
          if (typeof parsed === 'string') {
            parsedSql = parsed;
            console.log('使用解析后的字符串:', parsedSql);
          } else if (parsed && typeof parsed.sql === 'string') {
            parsedSql = parsed.sql;
            console.log('使用对象的sql字段:', parsedSql);
          } else {
            parsedSql = sql; // 使用原始字符串
            console.log('使用原始字符串:', parsedSql);
          }
        } catch (e) {
          parsedSql = sql; // 解析失败，使用原始字符串
          console.log('JSON解析失败，使用原始字符串:', parsedSql);
        }
      } else if (sql && typeof sql.sql === 'string') {
        // 如果sql是对象且有sql字段，使用该字段
        parsedSql = sql.sql;
        console.log('sql是对象，使用sql字段:', parsedSql);
      } else {
        // 其他情况，转换为字符串
        parsedSql = sql ? String(sql) : null;
        console.log('其他情况，转换为字符串:', parsedSql);
      }
    } catch (e) {
      console.warn('解析sql失败:', e);
      parsedSql = sql ? String(sql) : null;
      console.log('异常处理，转换为字符串:', parsedSql);
    }
    
    console.log('最终parsedSql:', parsedSql);
    console.log('最终parsedSql类型:', typeof parsedSql);
    console.log('=== SQL调试信息结束 ===');
    return {
      success: true,
      task_id: data.task_id,
      workflow_run_id: data.workflow_run_id,
      records: parsedRecords,
      vega: parsedVega,
      sql: parsedSql,  // 确保这一行存在
      raw_data: data
    };

  } catch (error) {
    console.error('Dify工作流调用失败:', error);
    return {
      success: false,
      error: error.message,
      records: null,
      vega: null
    };
  }
};