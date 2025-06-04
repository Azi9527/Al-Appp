// 替换这行
// import { CopyIcon } from '@chakra-ui/icons';

// 使用这个临时解决方案
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

// 在组件开始处添加
console.log('=== DataAnalysisResult组件调试 ===');
console.log('接收到的sql prop:', sql);
console.log('sql prop类型:', typeof sql);
console.log('sql是否为对象:', typeof sql === 'object');
if (typeof sql === 'object' && sql !== null) {
  console.log('sql对象的keys:', Object.keys(sql));
  console.log('sql对象内容:', JSON.stringify(sql, null, 2));
}
console.log('=== DataAnalysisResult组件调试结束 ===');