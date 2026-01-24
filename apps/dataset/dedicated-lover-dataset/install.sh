#!/bin/bash

# 专属恋人数据集 - 快速安装脚本
echo "🌸 专属恋人数据集安装器"
echo "=================================="

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 未安装Python3"
    echo "📦 请先安装: https://www.python.org/downloads/"
    exit 1
fi

# 安装requests库
echo "📦 安装Python依赖..."
pip3 install requests --quiet

# 检查Ollama
echo "🔍 检查Ollama状态..."
if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo "❌ Ollama未运行"
    echo ""
    echo "🚀 启动步骤:"
    echo "1. 下载模型 (首次):"
    echo "   curl -fsSL https://ollama.ai/download/dolphin-llama3:8b -o dolphin-llama3:8b"
    echo ""
    echo "2. 启动Ollama服务:"
    echo "   ollama serve dolphin-llama3:8b"
    echo ""
    echo "3. 重新运行安装脚本"
    exit 1
else
    echo "✅ Ollama正在运行"
    
    # 检查模型
    if curl -s http://localhost:11434/api/tags | grep -q "dolphin-llama3:8b"; then
        echo "✅ dolphin-llama3:8b模型已就绪"
    else
        echo "⚠️  推荐下载模型:"
        echo "   ollama pull dolphin-llama3:8b"
        echo ""
        read -p "是否现在下载？(y/n): " download_model
        if [[ $download_model == "y" || $download_model == "Y" ]]; then
            echo "📥 下载模型中..."
            ollama pull dolphin-llama3:8b
        fi
    fi
fi

echo ""
echo "🎯 开始生成数据集..."
python3 generate_dedicated_lover_dataset.py

echo ""
echo "🎉 数据集生成完成！"
echo "📋 查看 apps/dataset/dedicated-lover-dataset/ 目录获取生成的文件"