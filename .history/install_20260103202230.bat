@echo off
echo ===============================
echo Character Counter 插件安装脚本
echo ===============================

echo.
echo [1/3] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 错误: npm install 失败
    pause
    exit /b 1
)

echo.
echo [2/3] 编译扩展...
call npm run compile
if %errorlevel% neq 0 (
    echo 错误: 编译失败
    pause
    exit /b 1
)

echo.
echo [3/3] 安装完成！
echo.
echo 使用方法:
echo 1. 按 F5 启动调试 Extension Development Host
echo 2. 打开一个 .txt, .md 或 .html 文件
echo 3. 状态栏会显示汉字数量
echo 4. 使用 <counter>标签</counter> 进行字符计数
echo.
echo 详细文档请查看 USAGE_GUIDE.md
echo.

pause
