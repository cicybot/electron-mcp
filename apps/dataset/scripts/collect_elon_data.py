#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Elon Musk 数据收集脚本
从各种公开源收集Elon Musk的言论数据
"""

import json
import time
import requests
from pathlib import Path
from typing import List, Dict, Any
from urllib.parse import urljoin


class ElonMuskDataCollector:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.raw_data_dir = self.data_dir / "datasets" / "domain" / "elon_musk_raw"
        self.raw_data_dir.mkdir(parents=True, exist_ok=True)

        # 数据源配置
        self.data_sources = {
            "twitter": {
                "base_url": "https://api.x.com/2/",
                "endpoints": ["tweets", "users"],
            },
            "reddit": {
                "base_url": "https://www.reddit.com/",
                "subreddits": ["r/elonmusk", "r/teslamotors", "r/spacex"],
            },
            "youtube": {
                "base_url": "https://www.youtube.com/",
                "channels": ["Tesla", "SpaceX", "Elon Musk Zone", "Full Sail"],
            },
        }

    def create_mock_twitter_data(self) -> List[Dict]:
        """创建模拟Twitter数据（实际应用中需要真实API）"""
        mock_tweets = [
            {
                "id": 1,
                "text": "Absolutely. The future of humanity is multi-planetary. We need to become a spacefaring civilization.",
                "timestamp": "2024-01-15T10:30:00Z",
                "platform": "twitter",
                "likes": 125000,
                "retweets": 45000,
                "replies": 3200,
                "hashtags": ["SpaceX", "Mars", "Future"],
            },
            {
                "id": 2,
                "text": "Tesla's mission is to accelerate the world's transition to sustainable energy. This is not optional.",
                "timestamp": "2024-01-14T15:45:00Z",
                "platform": "twitter",
                "likes": 98000,
                "retweets": 31000,
                "replies": 2100,
                "hashtags": ["Tesla", "SustainableEnergy", "Mission"],
            },
            {
                "id": 3,
                "text": "First principles thinking is critical. Break down problems to their fundamental truths and reason up from there.",
                "timestamp": "2024-01-13T08:20:00Z",
                "platform": "twitter",
                "likes": 87000,
                "retweets": 28000,
                "replies": 1800,
                "hashtags": ["FirstPrinciples", "Engineering", "ProblemSolving"],
            },
            {
                "id": 4,
                "text": "AI is potentially more dangerous than nuclear weapons. We need regulation, but we must be careful not to stifle innovation.",
                "timestamp": "2024-01-12T12:15:00Z",
                "platform": "twitter",
                "likes": 156000,
                "retweets": 52000,
                "replies": 4100,
                "hashtags": ["AI", "Safety", "Innovation"],
            },
            {
                "id": 5,
                "text": "The engineering challenges are immense, but solvable. That's what matters. We will solve them.",
                "timestamp": "2024-01-11T09:30:00Z",
                "platform": "twitter",
                "likes": 74000,
                "retweets": 23000,
                "replies": 1500,
                "hashtags": ["Engineering", "ProblemSolving", "Innovation"],
            },
        ]

        return mock_tweets

    def create_mock_interview_data(self) -> List[Dict]:
        """创建模拟访谈数据"""
        mock_interviews = [
            {
                "id": 1,
                "title": "Lex Fridman Podcast Interview",
                "date": "2023-12-01",
                "duration": "2h 30m",
                "platform": "podcast",
                "excerpts": [
                    {
                        "question": "How do you approach difficult engineering problems?",
                        "answer": "I try to apply first principles thinking. What are the fundamental physics constraints? What's the most efficient way to solve the problem given those constraints? Most people reason by analogy - they do what others have done. I try to reason from first principles.",
                        "context": "Discussing engineering philosophy and problem-solving approach",
                    },
                    {
                        "question": "What's your vision for the future of humanity?",
                        "answer": "I think we should aim to become a multi-planetary species. Life on Earth is fragile. We need a backup. Eventually, the sun will expand and make Earth uninhabitable. If we're a multi-planetary species, humanity survives. If not, we go extinct. It's that simple.",
                        "context": "Discussing long-term vision for space exploration",
                    },
                ],
            },
            {
                "id": 2,
                "title": "Tesla Shareholder Meeting 2023",
                "date": "2023-05-16",
                "duration": "3h 15m",
                "platform": "corporate",
                "excerpts": [
                    {
                        "question": "What are the main challenges for Full Self-Driving?",
                        "answer": "The problem is fundamentally about solving real-world AI at scale. We need to handle edge cases - the rare situations that can happen in driving. But we're making progress. The data flywheel is real. More fleet data = better AI = safer driving = more customers = more data. This positive feedback loop is powerful.",
                        "context": "Explaining Tesla's FSD technology and approach",
                    }
                ],
            },
        ]

        return mock_interviews

    def create_mock_company_data(self) -> Dict[str, List[Dict]]:
        """创建公司相关数据"""
        company_data = {
            "tesla": [
                {
                    "id": 1,
                    "topic": "Battery Technology",
                    "statement": "Battery energy density is improving at about 7-8% per year. At that rate, we'll have some really compelling electric vehicles in terms of range and cost.",
                    "context": "Discussing battery technology improvements",
                    "date": "2024-01-10",
                },
                {
                    "id": 2,
                    "topic": "Manufacturing",
                    "statement": "The factory is the product. Building the machine that builds the machine is actually harder than building the product itself. We're learning this lesson over and over again.",
                    "context": "Talking about manufacturing challenges and solutions",
                    "date": "2024-01-08",
                },
            ],
            "spacex": [
                {
                    "id": 1,
                    "topic": "Starship Development",
                    "statement": "Starship is designed to be fully reusable. That's the key breakthrough. If you can reuse the entire rocket, the cost per launch drops by factor of 100 or more. That changes everything.",
                    "context": "Explaining Starship design philosophy",
                    "date": "2024-01-12",
                },
                {
                    "id": 2,
                    "topic": "Mars Colonization",
                    "statement": "Mars is going to need about a million people to be self-sustaining. The timeline is roughly 20 years for the first city, 40-50 years for full self-sufficiency. It's ambitious, but achievable.",
                    "context": "Discussing Mars colonization timeline and requirements",
                    "date": "2024-01-09",
                },
            ],
            "neuralink": [
                {
                    "id": 1,
                    "topic": "Brain-Computer Interface",
                    "statement": "In the long term, Neuralink can solve a lot of brain-related disorders. But the big picture is achieving symbiosis with AI. Humans need to merge with AI to remain relevant.",
                    "context": "Explaining Neuralink's long-term vision",
                    "date": "2024-01-11",
                }
            ],
        }

        return company_data

    def save_data(self, data: Any, filename: str):
        """保存数据到文件"""
        filepath = self.raw_data_dir / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到: {filepath}")

    def collect_all_data(self):
        """收集所有类型的数据"""
        print("开始收集Elon Musk数据...")

        # 收集Twitter数据
        print("收集Twitter数据...")
        twitter_data = self.create_mock_twitter_data()
        self.save_data(twitter_data, "twitter_data.json")

        # 收集访谈数据
        print("收集访谈数据...")
        interview_data = self.create_mock_interview_data()
        self.save_data(interview_data, "interview_data.json")

        # 收集公司数据
        print("收集公司相关数据...")
        company_data = self.create_mock_company_data()
        self.save_data(company_data, "company_data.json")

        # 创建数据汇总
        summary = {
            "total_twitter_posts": len(twitter_data),
            "total_interview_excerpts": sum(
                len(item["excerpts"]) for item in interview_data
            ),
            "total_company_statements": sum(
                len(statements) for statements in company_data.values()
            ),
            "data_collection_date": "2024-01-24",
            "status": "mock_data_for_testing",
        }

        self.save_data(summary, "data_summary.json")
        print("数据收集完成!")


def main():
    data_dir = Path(__file__).parent.parent
    collector = ElonMuskDataCollector(str(data_dir))
    collector.collect_all_data()


if __name__ == "__main__":
    main()
