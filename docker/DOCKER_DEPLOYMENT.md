# Vue.js 前端项目 Docker 部署指南

## 概述

本文档提供了完整的 Docker 部署解决方案，包括多阶段构建、Nginx 配置、Docker Compose 编排等。

### 📋 主要特性

- **多阶段构建**：
  - 构建阶段：安装所有依赖（包括开发依赖如vue-cli-service）
  - 生产阶段：只保留构建后的静态文件，镜像体积小且安全
- **Nginx 配置**：包含 Gzip 压缩、缓存策略、安全头设置
- **便捷脚本**：支持 Windows 和 Linux/Mac 的一键部署
- **完整文档**：详细的部署指南和故障排除
- **生产就绪**：包含监控、日志、安全等最佳实践

## 项目结构

```
login-demo/
├── src/                    # Vue.js 源代码
├── public/                 # 静态资源
├── package.json           # 项目依赖
└── docker/                # Docker 相关配置文件
    ├── Dockerfile             # Docker 镜像构建文件
    ├── nginx.conf             # Nginx 配置文件
    ├── docker-compose.yml     # Docker Compose 配置
    ├── .dockerignore          # Docker 忽略文件
    ├── deploy.sh              # Linux/Mac 部署脚本
    ├── deploy.bat             # Windows 部署脚本
    └── DOCKER_DEPLOYMENT.md   # 部署文档（本文件）
```

## 前置要求

### 系统要求
- Docker Engine 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

### 安装 Docker

#### Windows
1. 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. 启动 Docker Desktop
3. 验证安装：`docker --version`

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### macOS
1. 下载并安装 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. 启动 Docker Desktop
3. 验证安装：`docker --version`

## 快速部署

### 方法一：使用部署脚本（推荐）

#### Windows
```cmd
# 进入 docker 目录
cd docker

# 完整部署
deploy.bat deploy

# 查看日志
deploy.bat logs

# 停止服务
deploy.bat stop
```

#### Linux/Mac
```bash
# 进入 docker 目录
cd docker

# 给脚本执行权限
chmod +x deploy.sh

# 完整部署
./deploy.sh deploy

# 查看日志
./deploy.sh logs

# 停止服务
./deploy.sh stop
```

### 方法二：手动部署

```bash
# 1. 进入 docker 目录
cd docker

# 2. 构建镜像
docker-compose build

# 3. 启动服务
docker-compose up -d

# 4. 查看状态
docker-compose ps

# 5. 查看日志
docker-compose logs -f
```

## 配置说明

### Dockerfile 解析

```dockerfile
# 多阶段构建
FROM node:18-alpine AS build-stage  # 构建阶段
FROM nginx:alpine AS production-stage  # 生产阶段
```

**优势：**
- 最终镜像体积小（约 25MB）
- 不包含开发依赖
- 安全性更高

### Nginx 配置特性

- **SPA 路由支持**：`try_files $uri $uri/ /index.html`
- **Gzip 压缩**：减少传输大小
- **静态资源缓存**：提高加载速度
- **安全头**：增强安全性
- **API 代理**：支持后端服务代理

### Docker Compose 配置

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # 主机端口:容器端口
    healthcheck:     # 健康检查
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
```

## 环境配置

### 开发环境
```bash
# 使用开发配置
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 生产环境
```bash
# 使用生产配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### 环境变量

创建 `.env` 文件：
```env
# 应用配置
APP_PORT=3000
NODE_ENV=production

# API 配置
API_BASE_URL=http://localhost:8090

# Nginx 配置
NGINX_WORKER_PROCESSES=auto
NGINX_WORKER_CONNECTIONS=1024
```

## 高级配置

### SSL/HTTPS 支持

1. 创建 SSL 证书目录：
```bash
mkdir -p ssl
```

2. 放置证书文件：
```
ssl/
├── cert.pem
└── key.pem
```

3. 修改 `nginx.conf`：
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... 其他配置
}
```

4. 更新 `docker-compose.yml`：
```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
ports:
  - "443:443"
```

### 多环境部署

创建不同环境的配置文件：

**docker-compose.dev.yml**
```yaml
version: '3.8'
services:
  frontend:
    environment:
      - NODE_ENV=development
    volumes:
      - ./src:/app/src  # 热重载
```

**docker-compose.prod.yml**
```yaml
version: '3.8'
services:
  frontend:
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 负载均衡

使用 Nginx 作为负载均衡器：

```yaml
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend-1
      - frontend-2

  frontend-1:
    build: .
    expose:
      - "80"

  frontend-2:
    build: .
    expose:
      - "80"
```

## 监控和日志

### 日志管理

```bash
# 查看实时日志
docker-compose logs -f frontend

# 查看最近 100 行日志
docker-compose logs --tail=100 frontend

# 导出日志到文件
docker-compose logs frontend > app.log
```

### 健康检查

```bash
# 检查容器健康状态
docker-compose ps

# 查看健康检查详情
docker inspect --format='{{.State.Health}}' container_name
```

### 性能监控

添加监控服务到 `docker-compose.yml`：

```yaml
services:
  # ... 其他服务
  
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## 故障排除

### 常见问题

#### 1. 端口冲突
```bash
# 错误：port is already allocated
# 解决：更改端口映射
ports:
  - "3001:80"  # 使用不同的主机端口
```

#### 2. 构建失败
```bash
# 错误：npm install 失败
# 解决：清理缓存重新构建
docker-compose build --no-cache
```

#### 3. vue-cli-service 未找到
```bash
# 错误：sh: vue-cli-service: not found
# 原因：Dockerfile 中使用了 --only=production，只安装了生产依赖
# 解决：确保 Dockerfile 中使用 npm ci（不带 --only=production）

# 检查 Dockerfile 构建阶段：
RUN npm ci  # 正确：安装所有依赖
# 而不是：
# RUN npm ci --only=production  # 错误：只安装生产依赖

# 重新构建镜像
docker-compose build --no-cache
```

#### 4. 容器无法启动
```bash
# 查看详细错误信息
docker-compose logs frontend

# 进入容器调试
docker-compose exec frontend sh
```

#### 5. 静态资源 404
```bash
# 检查构建输出
docker-compose exec frontend ls -la /usr/share/nginx/html

# 检查 Nginx 配置
docker-compose exec frontend nginx -t
```

### 调试命令

```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats

# 进入容器
docker-compose exec frontend sh

# 重启服务
docker-compose restart frontend

# 查看网络
docker network ls
docker network inspect login-demo_app-network
```

## 性能优化

### 镜像优化

1. **使用 Alpine 镜像**：体积更小
2. **多阶段构建**：排除开发依赖
3. **合并 RUN 指令**：减少镜像层数
4. **使用 .dockerignore**：减少构建上下文

### 运行时优化

1. **启用 Gzip 压缩**
2. **设置静态资源缓存**
3. **使用 CDN**
4. **启用 HTTP/2**

### 资源限制

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 安全最佳实践

### 1. 使用非 root 用户

```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### 2. 扫描漏洞

```bash
# 使用 Docker Scout 扫描
docker scout cves your-image:latest

# 使用 Trivy 扫描
trivy image your-image:latest
```

### 3. 最小权限原则

```yaml
services:
  frontend:
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
```

### 4. 网络安全

```yaml
networks:
  app-network:
    driver: bridge
    internal: true  # 内部网络
```

## 备份和恢复

### 备份

```bash
# 导出镜像
docker save -o frontend-backup.tar your-image:latest

# 备份数据卷
docker run --rm -v volume_name:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .
```

### 恢复

```bash
# 导入镜像
docker load -i frontend-backup.tar

# 恢复数据卷
docker run --rm -v volume_name:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

## 持续集成/持续部署 (CI/CD)

### GitHub Actions 示例

```yaml
# .github/workflows/deploy.yml
name: Deploy to Docker

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and Deploy
      run: |
        docker-compose build
        docker-compose up -d
```

### GitLab CI 示例

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker-compose build

deploy:
  stage: deploy
  script:
    - docker-compose up -d
  only:
    - main
```

## 总结

本部署方案提供了：

✅ **完整的 Docker 化解决方案**
✅ **多阶段构建优化**
✅ **生产级 Nginx 配置**
✅ **跨平台部署脚本**
✅ **详细的故障排除指南**
✅ **安全最佳实践**
✅ **性能优化建议**

通过本指南，您可以快速、安全、高效地部署 Vue.js 前端应用。

## 支持

如有问题，请查看：
1. [Docker 官方文档](https://docs.docker.com/)
2. [Nginx 官方文档](https://nginx.org/en/docs/)
3. [Vue.js 官方文档](https://vuejs.org/)

---

**作者**: ECC Team  
**版本**: 1.0.0  
**更新时间**: 2024年