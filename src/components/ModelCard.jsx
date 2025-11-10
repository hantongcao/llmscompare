import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ModelCard = ({ model, status, content, error, progress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC键收起
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
      // 空格键切换
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        toggleExpand();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'loading':
        return (
          <span className="model-status status-loading">
            <span className="loading-spinner"></span>
            生成中...
          </span>
        );
      case 'complete':
        return <span className="model-status status-complete">完成</span>;
      case 'error':
        return <span className="model-status status-error">错误</span>;
      default:
        return <span className="model-status status-ready">就绪</span>;
    }
  };

  const getCardClass = () => {
    let className = 'model-card';
    if (status === 'loading') className += ' loading';
    if (status === 'complete') className += ' active';
    if (status === 'error') className += ' error';
    return className;
  };

  return (
    <div className={getCardClass()}>
      <div className="model-header">
        <div className="model-name">{model}</div>
        <div className="model-actions">
          {status === 'complete' && content && (
            <button 
              className="expand-btn"
              onClick={toggleExpand}
              title={isExpanded ? "缩小" : "放大"}
            >
              {isExpanded ? '🔍' : '🔍'}
            </button>
          )}
          {getStatusDisplay()}
        </div>
      </div>
      
      <div className={`model-content ${isExpanded ? 'expanded' : ''}`}>
        {status === 'loading' && (
          <div>
            <p>正在生成回答...</p>
            {progress > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
        
        {isExpanded && (
            <div className="expanded-header">
              <button className="collapse-btn" onClick={toggleExpand}>
                收起
              </button>
            </div>
          )}
          {status === 'complete' && content && (
            <div className="content-wrapper">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                💡 提示：按空格键切换放大/缩小，ESC键收起
              </div>
            </div>
          )}
        
        {status === 'error' && (
          <div className="error-message">
            <p>错误: {error}</p>
          </div>
        )}
        
        {status === 'ready' && (
          <p style={{ color: '#999' }}>等待输入...</p>
        )}
      </div>
    </div>
  );
};

export default ModelCard;