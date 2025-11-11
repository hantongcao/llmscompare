import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ModelCard = ({ model, result, isGenerating }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return '#10b981';
      case 'loading':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete':
        return '完成';
      case 'loading':
        return '生成中';
      case 'error':
        return '错误';
      default:
        return '等待中';
    }
  };

  const formatModelName = (modelId) => {
    const parts = modelId.split('/');
    return parts[parts.length - 1].replace(/-/g, ' ');
  };

  return (
    <div className={`model-card ${isGenerating ? 'generating' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="model-header">
        <div className="model-info">
          <h3 className="model-name">{formatModelName(model)}</h3>
          <span className="model-id">{model}</span>
      </div>
      <div className="model-status">
        <span 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor(result?.status) }}
        />
        <span className="status-text">
          {result ? getStatusText(result.status) : '等待中'}
        </span>
        {result?.content && (
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? '缩小' : '放大'}
          >
            {isExpanded ? '↗' : '⤢'}
          </button>
        )}
      </div>
      </div>

      {result?.progress > 0 && (
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${result.progress}%` }}
          />
        </div>
      )}

      <div className="model-content">
        {result?.status === 'loading' && !result.content && (
          <div className="loading-placeholder">
            <div className="loading-spinner" />
            <p>模型正在思考中...</p>
          </div>
        )}

        {result?.content && (
          <div className="output-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.content}
            </ReactMarkdown>
          </div>
        )}

        {result?.status === 'error' && (
          <div className="error-message">
            <span>❌</span>
            <p>{result.error || '调用模型时发生错误'}</p>
          </div>
        )}
      </div>

      {result?.content && (
        <div className="model-footer">
          <span className="char-count">
            {result.content.length} 字符
          </span>
        </div>
      )}

      {/* 放大模态框 */}
      {isExpanded && result?.content && (
        <div className="modal-overlay" onClick={() => setIsExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{formatModelName(model)}</h3>
              <span className="model-id">{model}</span>
              <button 
                className="modal-close"
                onClick={() => setIsExpanded(false)}
                title="关闭"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCard;