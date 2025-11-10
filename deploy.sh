#!/bin/bash

echo "🚀 开始部署多模型AI对比工具..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node --version)
echo "当前Node.js版本: $node_version"

# 提取主版本号
major_version=$(echo $node_version | cut -d'.' -f1 | cut -d'v' -f2)

if [ "$major_version" -lt 14 ]; then
    echo "❌ Node.js版本过低，需要14+版本"
    echo "正在升级Node.js..."
    
    # 升级Node.js到18版本
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    echo "✅ Node.js升级完成"
else
    echo "✅ Node.js版本正常"
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 启动服务
echo "🌐 启动服务..."
npx serve -s dist -p 3000 &

echo "✅ 部署完成！应用运行在 http://localhost:3000"
echo "📖 使用说明："
echo "  - 确保已设置环境变量"
echo "  - 访问 http://服务器IP:3000"
echo "  - 按 Ctrl+C 停止服务"