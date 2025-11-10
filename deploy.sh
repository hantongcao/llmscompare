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
    echo "当前版本: $node_version"
    echo "正在升级Node.js到18版本..."
    
    # 尝试使用NodeSource升级
    echo "📦 添加NodeSource仓库..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    
    echo "📥 安装Node.js 18..."
    sudo apt-get install -y nodejs
    
    # 验证升级
    new_version=$(node --version)
    echo "升级后版本: $new_version"
    
    if [[ "$new_version" == v12.* ]] || [[ "$new_version" == v13.* ]]; then
        echo "⚠️  自动升级失败，尝试使用NVM..."
        
        # 安装NVM
        echo "🔧 安装NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        source ~/.bashrc
        
        # 使用NVM安装Node.js 18
        echo "📦 使用NVM安装Node.js 18..."
        nvm install 18
        nvm use 18
        
        # 重新检查版本
        node_version=$(node --version)
        echo "NVM安装后版本: $node_version"
    fi
    
    if [[ "$node_version" == v12.* ]] || [[ "$node_version" == v13.* ]]; then
        echo "❌ 升级失败，请手动升级Node.js到14+版本"
        echo "建议访问: https://nodejs.org/ 下载最新版本"
        exit 1
    fi
    
    echo "✅ Node.js升级完成"
else
    echo "✅ Node.js版本正常"
fi

# 检查npm版本
echo "📋 检查npm版本..."
npm --version

# 清理旧的node_modules（如果存在）
if [ -d "node_modules" ]; then
    echo "🧹 清理旧的依赖..."
    rm -rf node_modules package-lock.json
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

# 启动服务
echo "🌐 启动服务..."
echo "服务将在 http://localhost:3000 启动"
echo "按 Ctrl+C 可以停止服务"
echo ""

# 使用nohup在后台运行，或者使用serve
if command -v serve &> /dev/null; then
    serve -s dist -p 3000
else
    npx serve -s dist -p 3000
fi