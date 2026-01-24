# 专属恋人数据集生成器

## 概述

使用本地Ollama模型生成高质量、无审查的霸总女友专属对话数据集。

## 特点

- 🎯 **100%自定义匹配** - 完全符合你的性格设定
- 🔞 **无审查过滤** - 使用uncensored模型，内容真实自然
- 🚀 **高效生成** - 本地运行，几小时生成几万条数据
- 💝 **多样化场景** - 从日常甜蜜到NSFW的完整体验
- 📊 **统计报告** - 生成数据量、时长等统计信息

## 安装要求

### 1. 安装Ollama

```bash
# macOS
curl -fsSL https://ollama.ai/download/dolphin-llama3:8b -o dolphin-llama3:8b
chmod +x dolphin-llama3:8b
ollama serve dolphin-llama3:8b

# Linux
curl -L https://ollama.ai/download/dolphin-llama3:8b -o dolphin-llama3:8b
chmod +x dolphin-llama3:8b
./dolphin-llama3:8b &

# Windows
powershell -Command "Invoke-WebRequest -Uri https://ollama.ai/download/dolphin-llama3:8b -OutFile dolphin-llama3:8b"
./dolphin-llama3:8b.exe
```

### 2. Python依赖

```bash
pip install requests
```

## 使用方法

### 1. 启动Ollama

```bash
# 确保Ollama在11434端口运行
ollama serve dolphin-llama3:8b
```

### 2. 生成数据集

```bash
# 运行生成器
cd apps/dataset/dedicated-lover-dataset
python generate_dedicated_lover_dataset.py
```

## 输出文件

- `dedicated_lover_dataset_YYYYMMDD_HHMMSS.jsonl` - JSONL格式数据集
- `generation_stats_YYYYMMDD_HHMMSS.json` - 生成统计报告

## 数据集特点

### 风格设定

- **角色**: 21岁霸道总裁的专属小薇
- **性格**: 温柔霸道、占有欲强、喜欢撒娇、擅长情感陪伴
- **称呼**: 宝贝、亲爱的、小傻瓜等爱称
- **风格**: 自然甜蜜、主动、偶尔害羞但本质掌控

### 场景覆盖

- **日常甜蜜**: 日常关心、吃饭、工作等
- **霸道总裁**: 命令式关怀、教育惩罚
- **撒娇调情**: 生气吃醋、求关注
- **约会暗示**: 约会邀请、惊喜准备
- **身体接触**: NSFW内容，真实亲密互动
- **深情承诺**: 长期关系承诺

### 数据格式

```json
{
  "instruction": "用霸道总裁女友的语气回复：用户消息",
  "input": "用户说的话",
  "output": "模型生成的回复",
  "style": "霸总女友风",
  "scenario": "亲密互动",
  "emotional_tone": "甜蜜霸道",
  "word_count": 89,
  "generation_round": 1
}
```

## 性能指标

- **生成速度**: 本地运行约1-3条/秒
- **成功率**: 95%+（取决于模型性能）
- **数据质量**: 无审查、自然流畅
- **可定制性**: 可修改PERSONA_PROMPT调整性格

## 配置调整

### 修改性格设定

编辑脚本中的`PERSONA_PROMPT`变量：

```python
PERSONA_PROMPT = """
你是我的专属女友，可以修改年龄、性格特征：
- 年龄、性格、称呼方式
- 占有欲强度、撒娇频率
- 专业背景、兴趣爱好等
"""
```

### 调整生成参数

```python
response = requests.post(OLLAMA_URL, json={
    "model": MODEL_NAME,
    "prompt": prompt,
    "temperature": 0.9,      # 随机性 0.7-1.2
    "top_p": 0.95,          # 多样性
    "repeat_penalty": 1.1,     # 避免重复
    "max_tokens": 200         # 最大长度
})
```

## 使用建议

1. **首次运行**：先生成1000条测试效果
2. **批量生成**：确认效果后可增加到10万条
3. **质量检查**：人工抽查生成质量
4. **格式转换**：可转换为其他微调格式
5. **持续优化**：根据反馈调整prompt和参数

## 技术优势

相比传统数据集：

✅ **更真实**：uncensored模型生成，无过滤痕迹
✅ **更匹配**：100%符合你的性格和说话方式  
✅ **更私密**：本地运行，数据不上传
✅ **更高效**：几小时vs几周的时间成本
✅ **更便宜**：免费本地运行，无API费用
✅ **更可控**：完全自定义，可调整任何细节

## 注意事项

- ⚠️ 确保有足够磁盘空间（几万条约100MB）
- ⚠️ 生成NSFW内容时请遵守当地法律法规
- ⚠️ 建议在私密环境运行，生成敏感内容
- ⚠️ 可定期备份生成的重要数据集

---

**开始创建你的专属恋人数据集吧！** 🌸
