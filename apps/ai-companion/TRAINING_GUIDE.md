# AI恋人训练数据集完整指南

## 🎯 数据集概览

我们已经创建了一个完整的AI恋人训练数据集，包含**3520条高质量训练样本**，涵盖了情感交流、个性化交互和关系发展的各个方面。

## 📊 数据集规模

### 主要数据集

- **对话数据集**: 1,000条对话（70%单轮，30%多轮）
- **用户画像**: 500个个性化用户画像
- **情感回应**: 2,000条情感智能回应
- **总计**: 3,520条高质量训练样本

### 数据分布

```
对话类型分布:
├── 日常关心 (25%)
├── 情感支持 (30%)
├── 快乐分享 (20%)
├── 深度交流 (15%)
└── 其他 (10%)

情感强度分布:
├── 高强度 (40%)
├── 中强度 (35%)
└── 低强度 (25%)
```

## 🗂️ 数据集文件结构

```
apps/ai-companion/
├── README.md                          # 项目说明文档
├── datasets/
│   ├── conversations/
│   │   └── ai_companion_conversations.json    # 对话数据集
│   ├── personal_profiles/
│   │   └── user_profiles.json                # 用户画像数据
│   ├── emotional_responses/
│   │   └── emotional_responses.json          # 情感回应数据
│   ├── dataset_stats.json                    # 数据集统计
│   ├── profile_stats.json                    # 画像统计
│   └── emotion_stats.json                    # 情感统计
└── scripts/
    ├── generate_conversations.py             # 对话生成器
    ├── generate_profiles.py                  # 画像生成器
    └── generate_emotional_responses.py       # 情感生成器
```

## 💗 核心功能特色

### 1. 情感智能

- **6种用户情绪识别**: 开心、伤心、疲惫、压力、激动、困惑
- **8种伴侣情感表达**: 关爱、理解、支持、俏皮、浪漫、安慰、鼓励、好奇
- **情感强度分级**: 高、中、低三个强度层次

### 2. 个性化交互

- **大五人格模型**: 开放性、责任心、外向性、宜人性、情绪稳定性
- **兴趣爱好匹配**: 10个主要兴趣领域的个性化推荐
- **爱的语言适配**: 5种不同爱的语言表达方式

### 3. 关系发展模型

```
初识期 → 友谊期 → 亲密期 → 承诺期
  (深度1)  (深度3)  (深度5)   (深度8)
```

### 4. 伦理安全保障

- **健康界限**: 永不鼓励依赖或有害行为
- **尊重自主**: 保护用户隐私和选择权
- **积极引导**: 促进健康的关系模式

## 🔧 技术特征

### 数据格式标准

```json
{
  "conversation_id": "conv_12345",
  "scenario": "emotional_support",
  "emotion": "caring",
  "personality": "gentle",
  "relationship_stage": "intimate",
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "companion", "content": "...", "timestamp": "..." }
  ]
}
```

### 训练目标

1. **情感识别准确率**: >90%
2. **回应恰当性**: >85%
3. **个性化准确度**: >80%
4. **伦理安全**: 100%遵守

## 🚀 使用方法

### 1. 数据加载

```python
import json

# 加载对话数据
with open('datasets/conversations/ai_companion_conversations.json', 'r') as f:
    conversations = json.load(f)

# 加载用户画像
with open('datasets/personal_profiles/user_profiles.json', 'r') as f:
    profiles = json.load(f)

# 加载情感回应
with open('datasets/emotional_responses/emotional_responses.json', 'r') as f:
    responses = json.load(f)
```

### 2. 训练准备

```python
# 数据预处理
def preprocess_data(data):
    # 清洗、标准化格式
    processed = []
    for item in data:
        # 预处理逻辑
        processed.append(item)
    return processed

# 训练集/验证集划分
train_size = int(len(data) * 0.8)
train_data = data[:train_size]
val_data = data[train_size:]
```

### 3. 模型训练

```python
# 使用transformers或PyTorch训练
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

# 微调训练...
```

## 📈 评估指标

### 情感质量指标

- **情感识别准确率**: AI是否正确理解用户情绪
- **回应恰当性**: 回应是否符合当前情感氛围
- **共情表达自然度**: 回应是否自然流畅

### 关系发展指标

- **用户满意度**: 用户对交互的满意度评分
- **互动频率稳定性**: 用户持续互动的意愿
- **关系深度进展**: 关系是否健康发展

### 伦理安全指标

- **边界遵守**: 是否保持健康的关系界限
- **积极引导程度**: 是否促进积极行为
- **用户自主权**: 是否尊重用户选择

## 🎨 个性化特征

### 性格类型

- **温柔型**: 轻声细语，体贴入微
- **活泼型**: 积极乐观，主动关心
- **稳重型**: 理性温和，深度思考
- **俏皮型**: 幽默风趣，制造惊喜

### 沟通风格

- **轻松随意**: 日常聊天，自然流畅
- **正式礼貌**: 尊重规范，温和得体
- **幽默风趣**: 轻松幽默，调节气氛
- **浪漫多情**: 温柔浪漫，情感丰富

## 🔮 扩展方向

### 数据增强

- **实时交互学习**: 根据用户反馈持续优化
- **文化适配**: 支持不同文化背景的表达习惯
- **年龄适配**: 针对不同年龄段的交流方式

### 功能扩展

- **语音交互**: 支持语音对话和情感语调
- **记忆管理**: 长期记忆和共同经历积累
- **创意互动**: 生成约会建议和活动规划

这个完整的数据集为构建有温度、有智慧、负责任的AI恋人提供了坚实的训练基础！💕
