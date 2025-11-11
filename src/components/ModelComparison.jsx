import React, { useState, useCallback } from 'react';
import ModelCard from './ModelCard';
import siliconFlowService from '../services/siliconFlowService';

const ModelComparison = () => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState({});
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_SILICON_FLOW_API_KEY || '');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('请输入问题或提示词');
      return;
    }

    if (!apiKey.trim()) {
      setError('请配置硅基流动API密钥');
      return;
    }

    setIsGenerating(true);
    setError('');
    setResults({});

    try {
      await siliconFlowService.callAllModels(
        inputText.trim(),
        apiKey.trim(),
        (model, result) => {
          setResults(prev => ({
            ...prev,
            [model]: result
          }));
        }
      );
    } catch (err) {
      setError('调用API时发生错误: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, apiKey]);

  const handleClear = () => {
    setInputText('');
    setResults({});
    setError('');
  };

  const models = siliconFlowService.models;

  return (
    <div className="model-comparison">
      <div className="input-section">
        <form onSubmit={handleSubmit} className="input-form">

          
          <div className="form-group">
            <label htmlFor="prompt-input">输入问题或提示词:</label>
            <textarea
              id="prompt-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入你想要对比的问题或提示词..."
              rows="4"
              className="prompt-input"
            />
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isGenerating || !inputText.trim() || !apiKey}
              className="submit-btn"
            >
              {isGenerating ? '生成中...' : '开始对比'}
            </button>
            
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-btn"
              disabled={isGenerating}
            >
              清空
            </button>
          </div>
        </form>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h2>模型输出对比</h2>
          <span className="models-count">
            {models.length} 个模型
          </span>
        </div>

        <div className="models-grid">
          {models.map(model => (
            <ModelCard
              key={model}
              model={model}
              result={results[model]}
              isGenerating={isGenerating}
            />
          ))}
        </div>

        {Object.keys(results).length === 0 && !isGenerating && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>开始对比模型输出</h3>
            <p>输入问题并点击"开始对比"按钮，即可同时调用多个AI模型进行回答对比。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelComparison;