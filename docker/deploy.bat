@echo off
REM Vue.js 前端项目 Docker 部署脚本 (Windows)
REM 作者: jasonlat
REM 版本: 1.0.0

setlocal enabledelayedexpansion

REM 检查 Docker 是否安装
:check_docker
echo 检查 Docker 安装状态...
docker --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

echo ✓ Docker 和 Docker Compose 已安装
goto :eof

REM 构建镜像
:build_image
echo 开始构建 Docker 镜像...
cd /d "%~dp0"
docker-compose build --no-cache
if errorlevel 1 (
    echo 错误: 镜像构建失败
    pause
    exit /b 1
)
echo ✓ Docker 镜像构建完成
goto :eof

REM 启动服务
:start_services
echo 启动服务...
cd /d "%~dp0"
docker-compose up -d
if errorlevel 1 (
    echo 错误: 服务启动失败
    pause
    exit /b 1
)
echo ✓ 服务启动完成

echo 等待服务启动...
timeout /t 10 /nobreak >nul

echo 检查服务状态:
docker-compose ps
goto :eof

REM 停止服务
:stop_services
echo 停止服务...
cd /d "%~dp0"
docker-compose down
echo ✓ 服务已停止
goto :eof

REM 重启服务
:restart_services
echo 重启服务...
cd /d "%~dp0"
docker-compose down
docker-compose up -d
echo ✓ 服务重启完成
goto :eof

REM 查看日志
:view_logs
echo 查看服务日志...
cd /d "%~dp0"
docker-compose logs -f
goto :eof

REM 清理资源
:cleanup
echo 清理 Docker 资源...
cd /d "%~dp0"
docker-compose down -v --remove-orphans
docker system prune -f
echo ✓ 清理完成
goto :eof

REM 显示帮助信息
:show_help
echo Vue.js 前端项目 Docker 部署脚本 (Windows)
echo.
echo 用法: %~nx0 [选项]
echo.
echo 选项:
echo   build     构建 Docker 镜像
echo   start     启动服务
echo   stop      停止服务
echo   restart   重启服务
echo   logs      查看日志
echo   cleanup   清理 Docker 资源
echo   deploy    完整部署（构建+启动）
echo   help      显示此帮助信息
echo.
echo 示例:
echo   %~nx0 deploy    # 完整部署
echo   %~nx0 logs      # 查看日志
echo   %~nx0 cleanup   # 清理资源
echo.
pause
goto :eof

REM 完整部署
:full_deploy
echo 开始完整部署...
call :check_docker
call :build_image
call :start_services

echo.
echo 🎉 部署完成！
echo 前端应用访问地址: http://localhost:3000
echo 使用 '%~nx0 logs' 查看日志
echo 使用 '%~nx0 stop' 停止服务
echo.
pause
goto :eof

REM 主函数
if "%1"=="" goto show_help
if "%1"=="build" (
    call :check_docker
    call :build_image
    pause
) else if "%1"=="start" (
    call :check_docker
    call :start_services
    pause
) else if "%1"=="stop" (
    call :stop_services
    pause
) else if "%1"=="restart" (
    call :restart_services
    pause
) else if "%1"=="logs" (
    call :view_logs
) else if "%1"=="cleanup" (
    call :cleanup
    pause
) else if "%1"=="deploy" (
    call :full_deploy
) else if "%1"=="help" (
    call :show_help
) else (
    echo 错误: 未知选项 '%1'
    call :show_help
)