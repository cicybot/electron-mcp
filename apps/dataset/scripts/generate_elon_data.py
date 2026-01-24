#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Elon Musk风格对话数据生成器
基于收集的数据生成符合Elon Musk风格的指令和对话数据
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Any


class ElonMuskDataGenerator:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.raw_data_dir = self.data_dir / "datasets" / "domain" / "elon_musk_raw"
        self.instruction_dir = self.data_dir / "datasets" / "instruction"
        self.conversation_dir = self.data_dir / "datasets" / "conversation"

        # 确保目录存在
        self.instruction_dir.mkdir(parents=True, exist_ok=True)
        self.conversation_dir.mkdir(parents=True, exist_ok=True)

        # 加载原始数据
        self.load_raw_data()

        # Elon Musk常用表达方式
        self.musk_patterns = {
            "agreement": [
                "Absolutely.",
                "Definitely.",
                "For sure.",
                "100%.",
                "Yes, absolutely.",
                "That's correct.",
            ],
            "excitement": [
                "This is going to be amazing.",
                "It's going to be incredible.",
                "This changes everything.",
                "This is a game-changer.",
                "The future is going to be wild.",
            ],
            "problem_solving": [
                "First principles thinking suggests...",
                "The physics constraints are clear...",
                "It's quite straightforward when you think about it...",
                "The engineering solution is obvious...",
                "We just need to apply basic physics here.",
            ],
            "time_references": [
                "in the next few years",
                "by the end of the decade",
                "in the coming months",
                "long-term",
                "eventually",
            ],
        }

    def load_raw_data(self):
        """加载原始数据"""
        self.twitter_data = []
        self.interview_data = []
        self.company_data = {}

        try:
            with open(
                self.raw_data_dir / "twitter_data.json", "r", encoding="utf-8"
            ) as f:
                self.twitter_data = json.load(f)
        except FileNotFoundError:
            print("Twitter数据文件未找到")

        try:
            with open(
                self.raw_data_dir / "interview_data.json", "r", encoding="utf-8"
            ) as f:
                self.interview_data = json.load(f)
        except FileNotFoundError:
            print("访谈数据文件未找到")

        try:
            with open(
                self.raw_data_dir / "company_data.json", "r", encoding="utf-8"
            ) as f:
                self.company_data = json.load(f)
        except FileNotFoundError:
            print("公司数据文件未找到")

    def generate_instruction_data(self) -> List[Dict]:
        """生成指令微调数据"""
        instruction_samples = []

        # 基于Twitter数据生成问答
        for tweet in self.twitter_data:
            # 创建基于推文内容的指令
            instruction = "What's your take on sustainable energy and transportation?"
            input_text = ""
            output = tweet["text"]

            instruction_samples.append(
                {
                    "instruction": instruction,
                    "input": input_text,
                    "output": output,
                    "source": "twitter",
                    "timestamp": tweet["timestamp"],
                }
            )

        # 基于访谈数据生成问答
        for interview in self.interview_data:
            for excerpt in interview["excerpts"]:
                instruction_samples.append(
                    {
                        "instruction": excerpt["question"],
                        "input": excerpt["context"],
                        "output": excerpt["answer"],
                        "source": "interview",
                        "timestamp": interview["date"],
                    }
                )

        # 基于公司数据生成技术问答
        for company, statements in self.company_data.items():
            for stmt in statements:
                instruction = f"What's your perspective on {stmt['topic']}?"
                input_text = f"Context: {stmt['context']}"
                output = stmt["statement"]

                instruction_samples.append(
                    {
                        "instruction": instruction,
                        "input": input_text,
                        "output": output,
                        "source": "company",
                        "timestamp": stmt["date"],
                    }
                )

        # 生成额外的风格化问答
        style_questions = [
            {
                "question": "How do you approach solving difficult problems?",
                "keywords": ["first principles", "physics", "engineering"],
            },
            {
                "question": "What's your vision for the future of space exploration?",
                "keywords": ["mars", "multi-planetary", "spacex"],
            },
            {
                "question": "How do you think about artificial intelligence?",
                "keywords": ["ai", "safety", "regulation", "neuralink"],
            },
            {
                "question": "What's the key to successful innovation?",
                "keywords": ["innovation", "engineering", "manufacturing"],
            },
            {
                "question": "How do you motivate your teams?",
                "keywords": ["mission", "future", "impossible"],
            },
        ]

        for q in style_questions:
            answer = self.generate_musk_style_answer(q["question"], q["keywords"])
            instruction_samples.append(
                {
                    "instruction": q["question"],
                    "input": "",
                    "output": answer,
                    "source": "generated",
                    "timestamp": "2024-01-24",
                }
            )

        return instruction_samples

    def generate_musk_style_answer(self, question: str, keywords: List[str]) -> str:
        """生成Elon Musk风格的回答"""

        # 根据关键词生成不同类型的回答
        if "first principles" in keywords:
            return f"Absolutely. {random.choice(self.musk_patterns['problem_solving'])} You have to break down the problem to its fundamental truths and reason up from there. Most people reason by analogy - they copy what others have done. That's not how you make breakthroughs."

        elif "mars" in keywords or "spacex" in keywords:
            return f"{random.choice(self.musk_patterns['agreement'])} We need to become a multi-planetary species. Life on Earth is fragile. {random.choice(self.musk_patterns['excitement'])} Starship makes this possible - fully reusable rockets that can reduce launch costs by 100x or more."

        elif "ai" in keywords:
            return f"{random.choice(self.musk_patterns['agreement'])} AI is potentially more dangerous than nuclear weapons. We need smart regulation, but we must be careful not to stifle innovation. {random.choice(self.musk_patterns['excitement'])} Neuralink is part of the solution - achieving symbiosis with AI."

        elif "innovation" in keywords or "engineering" in keywords:
            return f"{random.choice(self.musk_patterns['agreement'])} The key is focusing on fundamental problems and engineering solutions. {random.choice(self.musk_patterns['problem_solving'])} If you're not failing, you're not innovating enough. We need to push the boundaries of what's possible."

        else:
            return f"{random.choice(self.musk_patterns['agreement'])} {random.choice(self.musk_patterns['excitement'])} It's all about solving real problems that matter. {random.choice(self.musk_patterns['time_references'])}, this will change everything."

    def generate_conversation_data(self) -> List[Dict]:
        """生成对话数据"""
        conversation_samples = []

        # 基于访谈数据生成对话
        for interview in self.interview_data:
            for excerpt in interview["excerpts"]:
                conversations = [
                    {"from": "human", "value": excerpt["question"]},
                    {"from": "gpt", "value": excerpt["answer"]},
                ]

                conversation_samples.append(
                    {
                        "conversations": conversations,
                        "source": "interview",
                        "context": excerpt["context"],
                        "timestamp": interview["date"],
                    }
                )

        # 生成技术讨论对话
        tech_topics = [
            {
                "topic": "Tesla's FSD technology",
                "human": "How close are we to fully autonomous driving?",
                "musk": "We're very close. The data flywheel is real. More fleet data = better AI = safer driving. The fundamental challenge is solving real-world AI at scale. We're making rapid progress.",
            },
            {
                "topic": "SpaceX Mars plans",
                "human": "What's the realistic timeline for Mars colonization?",
                "musk": "Roughly 20 years for the first city, 40-50 years for full self-sufficiency. Starship is the key - fully reusable rockets make it economically viable. The engineering is solvable.",
            },
            {
                "topic": "Battery technology",
                "human": "What's the biggest challenge in battery development?",
                "musk": "Energy density and cost. We're seeing about 7-8% improvement per year in energy density. At that rate, we'll have compelling electric vehicles across the board in terms of range and cost.",
            },
        ]

        for topic in tech_topics:
            conversations = [
                {"from": "human", "value": topic["human"]},
                {"from": "gpt", "value": topic["musk"]},
            ]

            conversation_samples.append(
                {
                    "conversations": conversations,
                    "source": "generated",
                    "topic": topic["topic"],
                    "timestamp": "2024-01-24",
                }
            )

        return conversation_samples

    def save_datasets(self):
        """保存生成的数据集"""
        print("生成指令微调数据...")
        instruction_data = self.generate_instruction_data()

        # 保存原始数据
        with open(
            self.instruction_dir / "raw_elon_musk_instruction.json",
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(instruction_data, f, ensure_ascii=False, indent=2)

        print(f"指令数据生成完成: {len(instruction_data)} 条")

        print("生成对话数据...")
        conversation_data = self.generate_conversation_data()

        # 保存对话数据
        with open(
            self.conversation_dir / "raw_elon_musk_conversation.json",
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(conversation_data, f, ensure_ascii=False, indent=2)

        print(f"对话数据生成完成: {len(conversation_data)} 条")

        # 生成数据集摘要
        summary = {
            "instruction_samples": len(instruction_data),
            "conversation_samples": len(conversation_data),
            "total_samples": len(instruction_data) + len(conversation_data),
            "generation_date": "2024-01-24",
            "data_sources": [
                "twitter",
                "interviews",
                "company_statements",
                "generated",
            ],
            "style_characteristics": [
                "first_principles_thinking",
                "future_oriented",
                "engineering_focused",
                "direct_concise",
                "technically_detailed",
            ],
        }

        with open(
            self.data_dir / "datasets" / "dataset_summary.json", "w", encoding="utf-8"
        ) as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)

        print("数据集生成完成!")


def main():
    data_dir = Path(__file__).parent.parent
    generator = ElonMuskDataGenerator(str(data_dir))
    generator.save_datasets()


if __name__ == "__main__":
    main()
