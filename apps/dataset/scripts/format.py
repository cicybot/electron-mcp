#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据格式转换脚本
支持在不同LLM框架格式间转换
"""

import json
import argparse
from pathlib import Path
from typing import List, Dict, Any


class DataFormatter:
    def __init__(self):
        self.supported_formats = ["alpaca", "chatml", "sharegpt", "llama2"]

    def to_alpaca_format(self, data: List[Dict]) -> List[Dict]:
        """转换为Alpaca格式"""
        formatted_data = []

        for item in data:
            if "instruction" in item:
                # 指令微调格式
                formatted_item = {
                    "instruction": item.get("instruction", ""),
                    "input": item.get("input", ""),
                    "output": item.get("output", ""),
                }
            elif "conversations" in item:
                # 对话格式转指令格式
                conversation = item["conversations"]
                user_messages = [
                    msg["value"] for msg in conversation if msg["from"] == "human"
                ]
                assistant_messages = [
                    msg["value"] for msg in conversation if msg["from"] == "gpt"
                ]

                if user_messages and assistant_messages:
                    formatted_item = {
                        "instruction": user_messages[0],
                        "input": "",
                        "output": assistant_messages[0],
                    }
                else:
                    continue
            else:
                continue

            formatted_data.append(formatted_item)

        return formatted_data

    def to_chatml_format(self, data: List[Dict]) -> List[Dict]:
        """转换为ChatML格式"""
        formatted_data = []

        for item in data:
            messages = []

            if "instruction" in item:
                # 指令格式转对话格式
                if item.get("input"):
                    user_content = f"{item['instruction']}\n\n{item['input']}"
                else:
                    user_content = item["instruction"]

                messages.append({"role": "user", "content": user_content})

                messages.append({"role": "assistant", "content": item["output"]})

            elif "conversations" in item:
                # 保持对话格式
                for conv in item["conversations"]:
                    role = "user" if conv["from"] == "human" else "assistant"
                    messages.append({"role": role, "content": conv["value"]})

            if messages:
                formatted_data.append({"messages": messages})

        return formatted_data

    def to_sharegpt_format(self, data: List[Dict]) -> List[Dict]:
        """转换为ShareGPT格式"""
        formatted_data = []

        for item in data:
            if "conversations" in item:
                # 已经是ShareGPT格式
                formatted_data.append(item)
            elif "instruction" in item:
                # 指令格式转对话格式
                conversations = []

                # 添加用户消息
                user_content = item["instruction"]
                if item.get("input"):
                    user_content += f"\n\n{item['input']}"

                conversations.append({"from": "human", "value": user_content})

                # 添加助手回复
                conversations.append({"from": "gpt", "content": item["output"]})

                formatted_data.append({"conversations": conversations})

        return formatted_data

    def to_llama2_format(self, data: List[Dict]) -> List[str]:
        """转换为LLaMA-2格式（纯文本）"""
        formatted_texts = []

        for item in data:
            if "instruction" in item:
                instruction = item["instruction"]
                input_text = item.get("input", "")
                output = item["output"]

                if input_text:
                    text = (
                        f"<s>[INST] {instruction}\n\n{input_text} [/INST] {output}</s>"
                    )
                else:
                    text = f"<s>[INST] {instruction} [/INST] {output}</s>"

                formatted_texts.append(text)

            elif "conversations" in item:
                # 对话格式转为LLaMA-2格式
                conversations = item["conversations"]
                text_parts = ["<s>"]

                for i, conv in enumerate(conversations):
                    if conv["from"] == "human":
                        if i == 0:
                            text_parts.append(f"[INST] {conv['value']} [/INST]")
                        else:
                            text_parts.append(f"</s><s>[INST] {conv['value']} [/INST]")
                    else:
                        text_parts.append(conv["value"])

                text_parts.append("</s>")
                formatted_texts.append("".join(text_parts))

        return formatted_texts

    def convert_data(self, input_file: str, output_file: str, target_format: str):
        """转换数据格式"""
        if target_format not in self.supported_formats:
            raise ValueError(f"不支持的格式: {target_format}")

        # 读取原始数据
        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 转换格式
        if target_format == "alpaca":
            converted_data = self.to_alpaca_format(data)
        elif target_format == "chatml":
            converted_data = self.to_chatml_format(data)
        elif target_format == "sharegpt":
            converted_data = self.to_sharegpt(data)
        elif target_format == "llama2":
            converted_data = self.to_llama2_format(data)

        # 保存转换后的数据
        with open(output_file, "w", encoding="utf-8") as f:
            if target_format == "llama2":
                # LLaMA-2格式保存为纯文本，每行一个样本
                f.write("\n".join(converted_data))
            else:
                json.dump(converted_data, f, ensure_ascii=False, indent=2)

        print(f"转换完成: {len(data)} -> {len(converted_data)} 条数据")
        print(f"输出格式: {target_format}")
        print(f"保存到: {output_file}")


def main():
    parser = argparse.ArgumentParser(description="数据格式转换工具")
    parser.add_argument("--input", "-i", required=True, help="输入文件路径")
    parser.add_argument("--output", "-o", required=True, help="输出文件路径")
    parser.add_argument(
        "--format",
        "-f",
        required=True,
        choices=["alpaca", "chatml", "sharegpt", "llama2"],
        help="目标格式",
    )

    args = parser.parse_args()

    formatter = DataFormatter()
    formatter.convert_data(args.input, args.output, args.format)


if __name__ == "__main__":
    main()
