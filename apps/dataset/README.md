# 微调LLM数据集 (Fine-tuning LLM Dataset)

这个目录包含用于微调大语言模型的数据集。

## 目录结构

```
apps/dataset/
├── README.md           # 数据集说明文档
├── datasets/           # 具体的数据集文件
│   ├── instruction/    # 指令微调数据
│   ├── conversation/   # 对话微调数据
│   └── domain/         # 领域特定数据
├── scripts/            # 数据处理脚本
│   ├── preprocess.py   # 数据预处理
│   ├── format.py       # 格式转换
│   └── validate.py     # 数据验证
├── configs/            # 配置文件
│   └── dataset.yaml    # 数据集配置
└── examples/           # 示例数据
```

## 数据集格式

### 指令微调格式

```json
{
  "instruction": "用户指令",
  "input": "输入内容（可选）",
  "output": "期望输出"
}
```

### 对话微调格式

```json
{
  "conversations": [
    { "from": "human", "value": "用户消息" },
    { "from": "gpt", "value": "助手回复" }
  ]
}
```

## 使用说明

1. 将原始数据放入相应目录
2. 运行预处理脚本：`python scripts/preprocess.py`
3. 验证数据格式：`python scripts/validate.py`
4. 转换为目标格式：`python scripts/format.py`

## 数据质量要求

- 内容准确，无错误信息
- 语言规范，符合语法规则
- 多样性丰富，覆盖不同场景
- 长度适中，避免过长或过短
