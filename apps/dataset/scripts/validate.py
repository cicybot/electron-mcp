#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据质量验证脚本
验证数据集的质量、格式一致性和去重
"""

import json
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Set


class DataValidator:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.datasets_dir = self.data_dir / "datasets"

        # 验证统计
        self.stats = {
            "total_samples": 0,
            "duplicates": 0,
            "invalid_format": 0,
            "empty_content": 0,
            "quality_issues": 0,
        }

    def compute_text_hash(self, text: str) -> str:
        """计算文本的哈希值用于去重"""
        return hashlib.md5(text.strip().lower().encode("utf-8")).hexdigest()

    def validate_instruction_data(self, data: List[Dict]) -> Dict:
        """验证指令数据集"""
        print("验证指令数据集...")

        seen_hashes = set()
        valid_data = []
        duplicates = 0

        for item in data:
            # 检查必填字段
            if not all(key in item for key in ["instruction", "output"]):
                self.stats["invalid_format"] += 1
                continue

            # 检查内容是否为空
            if not item["instruction"].strip() or not item["output"].strip():
                self.stats["empty_content"] += 1
                continue

            # 检查长度合理性
            if len(item["instruction"]) > 1000 or len(item["output"]) > 2000:
                self.stats["quality_issues"] += 1
                continue

            # 去重检查
            combined_text = f"{item['instruction']} {item['output']}"
            text_hash = self.compute_text_hash(combined_text)

            if text_hash in seen_hashes:
                duplicates += 1
                continue

            seen_hashes.add(text_hash)
            valid_data.append(item)

        print(
            f"指令数据验证完成: 原始 {len(data)} 条, 有效 {len(valid_data)} 条, 重复 {duplicates} 条"
        )

        return {
            "valid_data": valid_data,
            "duplicates": duplicates,
            "valid_count": len(valid_data),
        }

    def validate_conversation_data(self, data: List[Dict]) -> Dict:
        """验证对话数据集"""
        print("验证对话数据集...")

        seen_hashes = set()
        valid_data = []
        duplicates = 0

        for item in data:
            # 检查必填字段
            if "conversations" not in item or not isinstance(
                item["conversations"], list
            ):
                self.stats["invalid_format"] += 1
                continue

            # 检查对话结构
            conversations = item["conversations"]
            if len(conversations) < 2:
                self.stats["quality_issues"] += 1
                continue

            # 检查对话格式
            valid_conv = []
            for conv in conversations:
                if not all(key in conv for key in ["from", "value"]):
                    self.stats["invalid_format"] += 1
                    break

                if conv["from"] not in ["human", "gpt"]:
                    self.stats["invalid_format"] += 1
                    break

                if not conv["value"].strip():
                    self.stats["empty_content"] += 1
                    break

                valid_conv.append(conv)

            if len(valid_conv) != len(conversations):
                continue

            # 去重检查
            combined_text = " ".join([conv["value"] for conv in conversations])
            text_hash = self.compute_text_hash(combined_text)

            if text_hash in seen_hashes:
                duplicates += 1
                continue

            seen_hashes.add(text_hash)
            valid_data.append(item)

        print(
            f"对话数据验证完成: 原始 {len(data)} 条, 有效 {len(valid_data)} 条, 重复 {duplicates} 条"
        )

        return {
            "valid_data": valid_data,
            "duplicates": duplicates,
            "valid_count": len(valid_data),
        }

    def analyze_data_quality(self, data: List[Dict], data_type: str) -> Dict:
        """分析数据质量"""
        analysis = {
            "total_samples": len(data),
            "avg_length": 0,
            "max_length": 0,
            "min_length": 0,
            "length_distribution": {"short": 0, "medium": 0, "long": 0},
            "topic_coverage": [],
            "style_markers": {
                "first_principles": 0,
                "future_oriented": 0,
                "technical_terms": 0,
                "direct_answers": 0,
            },
        }

        if data_type == "instruction":
            total_length = 0
            lengths = []

            for item in data:
                # 计算文本长度
                text = f"{item.get('instruction', '')} {item.get('output', '')}"
                length = len(text)
                lengths.append(length)
                total_length += length

                # 长度分布
                if length < 200:
                    analysis["length_distribution"]["short"] += 1
                elif length < 600:
                    analysis["length_distribution"]["medium"] += 1
                else:
                    analysis["length_distribution"]["long"] += 1

                # 风格标记检测
                text_lower = text.lower()
                if "first principle" in text_lower:
                    analysis["style_markers"]["first_principles"] += 1
                if any(
                    word in text_lower
                    for word in ["future", "will", "going to", "eventually"]
                ):
                    analysis["style_markers"]["future_oriented"] += 1
                if any(
                    word in text_lower
                    for word in [
                        "engineering",
                        "technology",
                        "physics",
                        "battery",
                        "rocket",
                    ]
                ):
                    analysis["style_markers"]["technical_terms"] += 1
                if text.strip().startswith(
                    ("Absolutely", "Definitely", "Yes", "No", "It's")
                ):
                    analysis["style_markers"]["direct_answers"] += 1

            if lengths:
                analysis["avg_length"] = total_length / len(lengths)
                analysis["max_length"] = max(lengths)
                analysis["min_length"] = min(lengths)

        elif data_type == "conversation":
            for item in data:
                conversations = item.get("conversations", [])
                for conv in conversations:
                    text = conv.get("value", "")
                    # 类似的分析逻辑
                    pass

        return analysis

    def generate_validation_report(
        self, instruction_result: Dict, conversation_result: Dict
    ):
        """生成验证报告"""
        report = {
            "validation_date": "2024-01-24",
            "instruction_data": {
                "valid_samples": instruction_result["valid_count"],
                "duplicates_removed": instruction_result["duplicates"],
                "quality_analysis": self.analyze_data_quality(
                    instruction_result["valid_data"], "instruction"
                ),
            },
            "conversation_data": {
                "valid_samples": conversation_result["valid_count"],
                "duplicates_removed": conversation_result["duplicates"],
                "quality_analysis": self.analyze_data_quality(
                    conversation_result["valid_data"], "conversation"
                ),
            },
            "overall_stats": self.stats,
            "recommendations": self.generate_recommendations(
                instruction_result, conversation_result
            ),
        }

        return report

    def generate_recommendations(
        self, instruction_result: Dict, conversation_result: Dict
    ) -> List[str]:
        """生成改进建议"""
        recommendations = []

        total_valid = (
            instruction_result["valid_count"] + conversation_result["valid_count"]
        )

        if total_valid < 1000:
            recommendations.append("数据量偏少，建议收集更多训练数据以达到1000+样本")

        if instruction_result["duplicates"] > instruction_result["valid_count"] * 0.1:
            recommendations.append("重复数据较多，建议检查数据收集流程")

        if self.stats["quality_issues"] > 0:
            recommendations.append("存在数据质量问题，建议加强数据清洗")

        recommendations.append("建议添加更多技术细节相关的问答以增强专业性")
        recommendations.append("建议增加多样化的提问方式和回答风格")

        return recommendations

    def validate_all_data(self):
        """验证所有数据集"""
        print("开始数据质量验证...")

        # 验证指令数据
        instruction_file = (
            self.datasets_dir / "instruction" / "processed_elon_musk_instruction.json"
        )
        if instruction_file.exists():
            with open(instruction_file, "r", encoding="utf-8") as f:
                instruction_data = json.load(f)
            instruction_result = self.validate_instruction_data(instruction_data)
        else:
            print("指令数据文件不存在")
            instruction_result = {"valid_data": [], "duplicates": 0, "valid_count": 0}

        # 验证对话数据
        conversation_file = (
            self.datasets_dir / "conversation" / "processed_elon_musk_conversation.json"
        )
        if conversation_file.exists():
            with open(conversation_file, "r", encoding="utf-8") as f:
                conversation_data = json.load(f)
            conversation_result = self.validate_conversation_data(conversation_data)
        else:
            print("对话数据文件不存在")
            conversation_result = {"valid_data": [], "duplicates": 0, "valid_count": 0}

        # 生成验证报告
        report = self.generate_validation_report(
            instruction_result, conversation_result
        )

        # 保存验证报告
        report_file = self.data_dir / "validation_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"验证完成! 报告已保存到: {report_file}")

        # 保存清洗后的数据
        if instruction_result["valid_data"]:
            clean_instruction_file = (
                self.datasets_dir / "instruction" / "clean_elon_musk_instruction.json"
            )
            with open(clean_instruction_file, "w", encoding="utf-8") as f:
                json.dump(
                    instruction_result["valid_data"], f, ensure_ascii=False, indent=2
                )
            print(f"清洗后的指令数据已保存到: {clean_instruction_file}")

        if conversation_result["valid_data"]:
            clean_conversation_file = (
                self.datasets_dir / "conversation" / "clean_elon_musk_conversation.json"
            )
            with open(clean_conversation_file, "w", encoding="utf-8") as f:
                json.dump(
                    conversation_result["valid_data"], f, ensure_ascii=False, indent=2
                )
            print(f"清洗后的对话数据已保存到: {clean_conversation_file}")


def main():
    data_dir = Path(__file__).parent.parent
    validator = DataValidator(str(data_dir))
    validator.validate_all_data()


if __name__ == "__main__":
    main()
