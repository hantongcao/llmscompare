#!/bin/bash

echo "🚀 Node.js升级脚本 - 针对部署服务器"
echo "=================================="

# 检查当前版本
echo "📋 当前Node.js版本:"
node --version
echo ""

echo "🔧 开始升级到Node.js 18..."
echo ""

# 方法1：使用NodeSource（推荐）
echo "方法1：使用NodeSource升级..."
sudo apt-get update

# 移除旧版本（可选）
echo "📦 准备添加NodeSource仓库..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

echo "📥 安装Node.js 18..."
sudo apt-get install -y nodejs

# 验证升级
echo "✅ 升级完成！"
echo "新的Node.js版本:"
node --version
echo "新的npm版本:"
npm --version

# 如果NodeSource方法失败，提供备选方案
if [[ $(node --version) == v12.* ]] || [[ $(node --version) == v13.* ]]; then
    echo ""
    echo "⚠️  方法1失败，尝试方法2：使用NVM..."
    
    # 安装NVM
    echo "🔧 安装NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # 加载NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # 安装Node.js 18
    echo "📦 使用NVM安装Node.js 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
    
    echo "✅ NVM安装完成！"
    echo "新的Node.js版本:"
    node --version
fi

echo ""
echo "🎉 Node.js升级完成！"
echo "现在你可以运行："
echo "  npm install"
echo "  npm run build"
echo "  npm run dev"