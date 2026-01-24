#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据预处理脚本
用于清洗和标准化LLM微调数据
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any


class DataPreprocessor:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.datasets_dir = self.data_dir / "datasets"

    def clean_text(self, text: str) -> str:
        """清洗文本内容"""
        if not text:
            return ""

        # 移除多余空白字符
        text = re.sub(r"\s+", " ", text.strip())

        # 移除特殊字符（保留中文、英文、数字、标点）
        text = re.sub(r'[^\w\s\u4e00-\u9fff.,!?;:()""' '""—-]', "", text)

        return text.strip()

    def validate_instruction_data(self, item: Dict[str, Any]) -> bool:
        """验证指令数据格式"""
        required_fields = ["instruction", "output"]
        return all(field in item and item[field] for field in required_fields)

    def validate_conversation_data(self, item: Dict[str, Any]) -> bool:
        """验证对话数据格式"""
        if "conversations" not in item or not isinstance(item["conversations"], list):
            return False

        for conv in item["conversations"]:
            if not isinstance(conv, dict) or "from" not in conv or "value" not in conv:
                return False
            if conv["from"] not in ["human", "gpt"]:
                return False

        return True

    def process_instruction_data(self, input_file: str, output_file: str):
        """处理指令微调数据"""
        processed_data = []

        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            if not self.validate_instruction_data(item):
                continue

            processed_item = {
                "instruction": self.clean_text(item["instruction"]),
                "input": self.clean_text(item.get("input", "")),
                "output": self.clean_text(item["output"]),
            }

            processed_data.append(processed_item)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)

        print(f"处理完成: {len(processed_data)} 条数据")

    def process_conversation_data(self, input_file: str, output_file: str):
        """处理对话微调数据"""
        processed_data = []

        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            if not self.validate_conversation_data(item):
                continue

            processed_item = {"conversations": []}

            for conv in item["conversations"]:
                processed_item["conversations"].append(
                    {"from": conv["from"], "value": self.clean_text(conv["value"])}
                )

            processed_data.append(processed_item)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)

        print(f"处理完成: {len(processed_data)} 条对话数据")


def main():
    data_dir = Path(__file__).parent.parent
    preprocessor = DataPreprocessor(data_dir)

    # 处理指令数据
    instruction_dir = preprocessor.datasets_dir / "instruction"
    for file_path in instruction_dir.glob("raw_*.json"):
        output_path = instruction_dir / f"processed_{file_path.name[4:]}"
        preprocessor.process_instruction_data(str(file_path), str(output_path))

    # 处理对话数据
    conversation_dir = preprocessor.datasets_dir / "conversation"
    for file_path in conversation_dir.glob("raw_*.json"):
        output_path = conversation_dir / f"processed_{file_path.name[4:]}"
        preprocessor.process_conversation_data(str(file_path), str(output_path))


if __name__ == "__main__":
    main()
