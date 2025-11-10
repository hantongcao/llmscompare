# 🚀 部署指南 - 解决Node.js版本问题

## 🔍 问题识别

你在部署服务器上遇到的问题是：
```
SyntaxError: Unexpected reserved word
await import('source-map-support').then((r) => r.default.install())
^^^^^
```

**根本原因**：部署服务器的Node.js版本太旧（v12.22.9），需要升级到14+版本。

## 🛠️ 解决方案

### ✅ 方案1：快速升级（推荐）

在部署服务器上执行：

```bash
# 下载升级脚本
curl -O https://raw.githubusercontent.com/hantongcao/llmscompare/main/upgrade-node.sh

# 给脚本执行权限
chmod +x upgrade-node.sh

# 运行升级脚本
./upgrade-node.sh
```

### ✅ 方案2：手动升级

```bash
# 1. 升级Node.js到18版本
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 验证版本
node --version  # 应该显示 v18.x.x

# 3. 部署项目
git clone https://github.com/hantongcao/llmscompare.git
cd llmscompare
npm install
npm run build
npx serve -s dist -p 3000
```

### ✅ 方案3：使用Docker（避免环境问题）

```bash
# 1. 安装Docker
curl -fsSL https://get.docker.com | sh

# 2. 克隆项目
git clone https://github.com/hantongcao/llmscompare.git
cd llmscompare

# 3. 使用Docker Compose部署
docker-compose up -d
```

### ✅ 方案4：使用部署脚本（全自动）

```bash
# 1. 克隆项目
git clone https://github.com/hantongcao/llmscompare.git
cd llmscompare

# 2. 运行增强版部署脚本
chmod +x deploy.sh
./deploy.sh
```

## 📋 版本要求

| 环境 | Node.js版本 | 状态 |
|------|-------------|------|
| 本地开发 | v24.7.0 | ✅ 正常 |
| 部署服务器 | v12.22.9 | ❌ 需要升级 |
| 最低要求 | v14.18+ | ⚠️ 必须升级 |
| 推荐版本 | v18+ | ✅ 最佳选择 |

## 🔧 验证升级成功

升级后，在部署服务器上运行：

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 测试项目
npm install
npm run build
```

## 🎯 成功标准

- ✅ Node.js版本显示 v18.x.x
- ✅ npm install 无错误
- ✅ npm run build 成功
- ✅ 浏览器访问 http://localhost:3000 正常

## 🆘 如果升级失败

1. **使用NVM**：
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   ```

2. **使用Docker**：完全避免Node.js版本问题

3. **下载预编译版本**：从Node.js官网下载二进制包

## 📞 技术支持

如果遇到问题，请提供：
1. 当前Node.js版本：`node --version`
2. 错误信息截图
3. 操作系统版本：`cat /etc/os-release`
4. 你尝试的解决方案