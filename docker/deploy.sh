#!/bin/bash

# Vue.js 前端项目 Docker 部署脚本
# 作者: ECC Team
# 版本: 1.0.0

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_message $RED "错误: Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message $RED "错误: Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    print_message $GREEN "✓ Docker 和 Docker Compose 已安装"
}

# 构建镜像
build_image() {
    print_message $BLUE "开始构建 Docker 镜像..."
    cd "$(dirname "$0")"
    docker-compose build --no-cache
    print_message $GREEN "✓ Docker 镜像构建完成"
}

# 启动服务
start_services() {
    print_message $BLUE "启动服务..."
    cd "$(dirname "$0")"
    docker-compose up -d
    print_message $GREEN "✓ 服务启动完成"
    
    # 等待服务启动
    print_message $YELLOW "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    docker-compose ps
}

# 停止服务
stop_services() {
    print_message $BLUE "停止服务..."
    cd "$(dirname "$0")"
    docker-compose down
    print_message $GREEN "✓ 服务已停止"
}

# 重启服务
restart_services() {
    print_message $BLUE "重启服务..."
    cd "$(dirname "$0")"
    docker-compose down
    docker-compose up -d
    print_message $GREEN "✓ 服务重启完成"
}

# 查看日志
view_logs() {
    print_message $BLUE "查看服务日志..."
    cd "$(dirname "$0")"
    docker-compose logs -f
}

# 清理资源
cleanup() {
    print_message $BLUE "清理 Docker 资源..."
    cd "$(dirname "$0")"
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_message $GREEN "✓ 清理完成"
}

# 显示帮助信息
show_help() {
    echo "Vue.js 前端项目 Docker 部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  build     构建 Docker 镜像"
    echo "  start     启动服务"
    echo "  stop      停止服务"
    echo "  restart   重启服务"
    echo "  logs      查看日志"
    echo "  cleanup   清理 Docker 资源"
    echo "  deploy    完整部署（构建+启动）"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 deploy    # 完整部署"
    echo "  $0 logs      # 查看日志"
    echo "  $0 cleanup   # 清理资源"
}

# 完整部署
full_deploy() {
    print_message $YELLOW "开始完整部署..."
    check_docker
    build_image
    start_services
    
    print_message $GREEN "🎉 部署完成！"
    print_message $BLUE "前端应用访问地址: http://localhost:3000"
    print_message $YELLOW "使用 '$0 logs' 查看日志"
    print_message $YELLOW "使用 '$0 stop' 停止服务"
}

# 主函数
main() {
    case "${1:-help}" in
        "build")
            check_docker
            build_image
            ;;
        "start")
            check_docker
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            view_logs
            ;;
        "cleanup")
            cleanup
            ;;
        "deploy")
            full_deploy
            ;;
        "help")
            show_help
            ;;
        *)
            print_message $RED "错误: 未知选项 '$1'"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"