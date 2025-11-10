# 多模型输出对比工具

一个基于React的多模型AI输出对比工具，支持同时调用多个硅基流动API模型进行回答对比。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# 硅基流动API配置
VITE_SILICON_FLOW_API_KEY=your_api_key_here
VITE_SILICON_FLOW_API_URL=https://api.siliconflow.cn/v1/chat/completions

# 模型列表（用逗号分隔）
VITE_MODEL_LIST=deepseek-ai/DeepSeek-V3.1-Terminus,moonshotai/Kimi-K2-Instruct-0905,zai-org/GLM-4.5

# 应用配置
VITE_APP_TITLE=多模型输出对比
VITE_APP_DESCRIPTION=同时对比多个AI模型的回答输出
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 开始使用。

## ⚙️ 环境变量配置说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_SILICON_FLOW_API_KEY` | 硅基流动API密钥 | 必填 |
| `VITE_SILICON_FLOW_API_URL` | API地址 | `https://api.siliconflow.cn/v1/chat/completions` |
| `VITE_MODEL_LIST` | 模型列表，逗号分隔 | 三个默认模型 |
| `VITE_APP_TITLE` | 应用标题 | `多模型输出对比` |
| `VITE_APP_DESCRIPTION` | 应用描述 | `同时对比多个AI模型的回答输出` |

## 🎯 功能特点

- ✅ **多模型对比**: 同时调用多个AI模型
- ✅ **实时输出**: 支持流式响应，实时显示生成过程
- ✅ **状态监控**: 清晰显示每个模型的状态
- ✅ **环境配置**: 支持通过环境变量灵活配置
- ✅ **响应式设计**: 适配移动端和桌面端
- ✅ **进度显示**: 实时显示生成进度

## 🔧 自定义模型

要添加或修改模型，只需编辑 `.env` 文件中的 `VITE_MODEL_LIST`：

```env
VITE_MODEL_LIST=model1,model2,model3,model4
```

模型名称应该使用硅基流动支持的正确模型名称。

## 📝 注意事项

1. **API密钥**: 请妥善保管你的API密钥，不要提交到代码仓库
2. **模型可用性**: 确保选择的模型在你的硅基流动账户中可用
3. **网络连接**: 需要稳定的网络连接才能正常使用

## 🛠️ 技术栈

- React 18
- Vite
- CSS3
- 硅基流动API