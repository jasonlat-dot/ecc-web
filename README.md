# Docker 部署配置

这个文件夹包含了 Vue.js 前端项目的 Docker 部署配置文件。

## 快速开始

### Windows 用户
```cmd
# 完整部署
deploy.bat deploy
```

### Linux/Mac 用户
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 完整部署
./deploy.sh deploy
```

## 文件说明

- `Dockerfile` - Docker 镜像构建文件
- `nginx.conf` - Nginx 服务器配置
- `docker-compose.yml` - Docker Compose 服务编排
- `.dockerignore` - Docker 构建忽略文件
- `deploy.sh` - Linux/Mac 部署脚本
- `deploy.bat` - Windows 部署脚本
- `DOCKER_DEPLOYMENT.md` - 详细部署文档

## 访问应用

部署成功后，访问 http://localhost:3000 查看应用。

## 更多信息

详细的部署说明请查看 [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)。