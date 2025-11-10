// 从环境变量获取配置
const API_BASE_URL = import.meta.env.VITE_SILICON_FLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODELS = 'deepseek-ai/DeepSeek-V3.1-Terminus,moonshotai/Kimi-K2-Instruct-0905,zai-org/GLM-4.5';

class SiliconFlowService {
  constructor() {
    // 从环境变量获取模型列表，如果没有则使用默认列表
    const modelsEnv = import.meta.env.VITE_MODEL_LIST || DEFAULT_MODELS;
    this.models = modelsEnv.split(',').map(model => model.trim()).filter(Boolean);
  }

  async callModel(model, message, token, onProgress) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              result += content;
              
              if (onProgress) {
                onProgress({
                  content: result,
                  done: false
                });
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
      
      if (onProgress) {
        onProgress({
          content: result,
          done: true
        });
      }
      
      return { success: true, content: result };
    } catch (error) {
      console.error(`Error calling model ${model}:`, error);
      return { 
        success: false, 
        error: error.message || 'Failed to call model' 
      };
    }
  }

  async callAllModels(message, token, onModelUpdate) {
    const results = {};
    
    const promises = this.models.map(async (model) => {
      results[model] = {
        status: 'loading',
        content: '',
        error: null,
        progress: 0
      };
      
      if (onModelUpdate) {
        onModelUpdate(model, results[model]);
      }
      
      const result = await this.callModel(model, message, token, (update) => {
        results[model].content = update.content;
        results[model].progress = update.done ? 100 : Math.min(90, results[model].content.length / 10);
        
        if (onModelUpdate) {
          onModelUpdate(model, results[model]);
        }
      });
      
      if (result.success) {
        results[model].status = 'complete';
        results[model].content = result.content;
        results[model].progress = 100;
      } else {
        results[model].status = 'error';
        results[model].error = result.error;
      }
      
      if (onModelUpdate) {
        onModelUpdate(model, results[model]);
      }
    });
    
    await Promise.allSettled(promises);
    return results;
  }
}

export default new SiliconFlowService();