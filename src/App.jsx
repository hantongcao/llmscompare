import React, { useState } from 'react';
import ModelCard from './components/ModelCard';
import siliconFlowService from './services/siliconFlowService';

// 从环境变量获取配置
const APP_TITLE = import.meta.env.VITE_APP_TITLE || '多模型输出对比';
const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || '同时对比多个AI模型的回答输出';

function App() {
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState(import.meta.env.VITE_SILICON_FLOW_API_KEY || '');
  const [modelResults, setModelResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 检查是否已有环境变量中的API密钥
  const hasEnvToken = Boolean(import.meta.env.VITE_SILICON_FLOW_API_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('请输入问题');
      return;
    }
    
    if (!token.trim()) {
      alert('请输入API Token');
      return;
    }

    setIsLoading(true);
    
    const initialResults = {};
    siliconFlowService.models.forEach(model => {
      initialResults[model] = {
        status: 'ready',
        content: '',
        error: null,
        progress: 0
      };
    });
    setModelResults(initialResults);

    try {
      await siliconFlowService.callAllModels(question, token, (model, result) => {
        setModelResults(prev => ({
          ...prev,
          [model]: result
        }));
      });
    } catch (error) {
      console.error('Error calling models:', error);
      alert('调用模型时出错，请检查网络连接和API Token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>{APP_TITLE}</h1>
        <p>{APP_DESCRIPTION}</p>
      </div>

      <div className="input-section">
        <form onSubmit={handleSubmit}>
          {!hasEnvToken && (
            <div className="input-group">
              <label htmlFor="token">API Token (硅基流动):</label>
              <input
                id="token"
                type="password"
                className="token-input"
                placeholder="请输入您的硅基流动API Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="question">问题:</label>
            <textarea
              id="question"
              placeholder="请输入您想问的问题，例如：2025年中国大模型行业将面临哪些机遇和挑战？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '生成中...' : '开始对比'}
          </button>
        </form>
      </div>

      <div className="models-section">
        <h2>模型对比结果</h2>
        <div className="models-grid">
          {siliconFlowService.models.map(model => (
            <ModelCard
              key={model}
              model={model}
              status={modelResults[model]?.status || 'ready'}
              content={modelResults[model]?.content || ''}
              error={modelResults[model]?.error || null}
              progress={modelResults[model]?.progress || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;