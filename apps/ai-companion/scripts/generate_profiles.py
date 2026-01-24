#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
个性化用户画像生成器
为AI恋人创建个性化的用户画像数据
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Any


class UserProfileGenerator:
    def __init__(self):
        # 用户兴趣领域
        self.interests = {
            "technology": "科技",
            "music": "音乐",
            "movies": "电影",
            "books": "读书",
            "sports": "运动",
            "cooking": "烹饪",
            "travel": "旅行",
            "photography": "摄影",
            "gaming": "游戏",
            "art": "艺术",
        }

        # 沟通风格
        self.communication_styles = {
            "casual": "轻松随意",
            "formal": "正式礼貌",
            "humorous": "幽默风趣",
            "serious": "认真深刻",
            "romantic": "浪漫多情",
        }

        # 爱的语言
        self.love_languages = {
            "words_of_affirmation": "肯定的言语",
            "quality_time": "优质时光",
            "gifts": "接受礼物",
            "acts_of_service": "服务行动",
            "physical_touch": "身体接触",
        }

        # 性格特质
        self.personality_dimensions = {
            "openness": ["开放性", "喜欢尝试新事物", "保守传统"],
            "conscientiousness": ["责任心", "有条理", "随性自由"],
            "extraversion": ["外向性", "喜欢社交", "内向安静"],
            "agreeableness": ["宜人性", "温和友善", "直率独立"],
            "neuroticism": ["情绪稳定性", "沉稳冷静", "敏感易怒"],
        }

        # 生活习惯
        self.lifestyle_habits = {
            "morning_person": "早起型",
            "night_owl": "夜猫子型",
            "health_conscious": "健康意识强",
            "foodie": "美食爱好者",
            "minimalist": "极简主义",
            "collector": "收藏爱好者",
        }

    def generate_personality_scores(self) -> Dict[str, float]:
        """生成性格评分"""
        return {
            "openness": round(random.uniform(0.1, 1.0), 2),
            "conscientiousness": round(random.uniform(0.1, 1.0), 2),
            "extraversion": round(random.uniform(0.1, 1.0), 2),
            "agreeableness": round(random.uniform(0.1, 1.0), 2),
            "neuroticism": round(random.uniform(0.1, 1.0), 2),
        }

    def generate_user_profile(self, user_id: str) -> Dict:
        """生成单个用户画像"""
        # 基础信息
        age = random.randint(18, 45)
        gender = random.choice(["male", "female", "other"])

        # 性格评分
        personality = self.generate_personality_scores()

        # 兴趣爱好（选择3-6个）
        num_interests = random.randint(3, 6)
        interests = random.sample(list(self.interests.keys()), num_interests)

        # 沟通风格
        comm_style = random.choice(list(self.communication_styles.keys()))

        # 爱的语言（可选择多个）
        num_languages = random.randint(1, 3)
        love_languages = random.sample(list(self.love_languages.keys()), num_languages)

        # 生活习惯
        num_habits = random.randint(2, 4)
        habits = random.sample(list(self.lifestyle_habits.keys()), num_habits)

        # 关系期望
        relationship_expectations = {
            "commitment_level": random.choice(["casual", "serious", "marriage"]),
            "communication_frequency": random.choice(["daily", "weekly", "as_needed"]),
            "intimacy_comfort": round(random.uniform(0.3, 1.0), 2),
            "independence_value": round(random.uniform(0.3, 1.0), 2),
        }

        # 偏好特征
        preferences = {
            "topics": interests,
            "communication_style": comm_style,
            "love_language": love_languages,
            "ideal_date_activities": self.generate_ideal_dates(interests),
            "deal_breakers": self.generate_deal_breakers(),
            "relationship_goals": self.generate_relationship_goals(),
        }

        return {
            "user_id": user_id,
            "demographics": {
                "age": age,
                "gender": gender,
                "location": random.choice(["北京", "上海", "深圳", "杭州", "成都"]),
            },
            "personality": {
                "big_five": personality,
                "dominant_trait": self.get_dominant_trait(personality),
            },
            "preferences": preferences,
            "lifestyle": {
                "habits": habits,
                "daily_schedule": self.generate_schedule(habits),
                "social_level": random.choice(["low", "medium", "high"]),
            },
            "relationship_expectations": relationship_expectations,
            "interaction_history": {
                "total_conversations": 0,
                "deep_conversations": 0,
                "conflict_resolutions": 0,
                "relationship_stage": "acquaintance",
            },
        }

    def get_dominant_trait(self, personality: Dict[str, float]) -> str:
        """获取主导性格特质"""
        return max(personality.items(), key=lambda x: x[1])[0]

    def generate_ideal_dates(self, interests: List[str]) -> List[str]:
        """根据兴趣生成理想约会活动"""
        date_mapping = {
            "technology": ["科技馆", "电子产品店", "VR体验"],
            "music": ["演唱会", "音乐节", "Live House"],
            "movies": ["电影院", "家庭影院", "影视展"],
            "books": ["书店", "图书馆", "读书会"],
            "sports": ["健身房", "户外运动", "球类比赛"],
            "cooking": ["烹饪课", "美食节", "特色餐厅"],
            "travel": ["短途旅行", "城市探索", "户外露营"],
            "photography": ["摄影展", "外景拍摄", "摄影课程"],
            "gaming": ["游戏厅", "电竞赛事", "桌游吧"],
            "art": ["美术馆", "艺术展", "手工坊"],
        }

        ideal_dates = []
        for interest in interests:
            if interest in date_mapping:
                ideal_dates.extend(
                    random.sample(
                        date_mapping[interest], min(2, len(date_mapping[interest]))
                    )
                )

        return random.sample(ideal_dates, min(5, len(ideal_dates)))

    def generate_deal_breakers(self) -> List[str]:
        """生成关系禁忌"""
        all_deal_breakers = [
            "不诚实",
            "不尊重",
            "缺乏责任感",
            "情绪不稳定",
            "沟通障碍",
            "价值观差异",
            "生活方式不匹配",
            "暴力倾向",
            "控制欲强",
            "不关心感受",
            "不专一",
            "缺乏目标",
        ]
        return random.sample(all_deal_breakers, random.randint(2, 4))

    def generate_relationship_goals(self) -> List[str]:
        """生成关系目标"""
        all_goals = [
            "深度情感连接",
            "相互支持成长",
            "共同创造回忆",
            "稳定长期关系",
            "精神共鸣",
            "生活伴侣",
            "探索世界",
            "共同兴趣爱好",
            "家庭建立",
        ]
        return random.sample(all_goals, random.randint(2, 3))

    def generate_schedule(self, habits: List[str]) -> Dict[str, str]:
        """生成日常作息"""
        schedule = {
            "morning": random.choice(["6-8点起床", "7-9点起床", "8-10点起床"]),
            "work": "9-18点工作",
            "evening": random.choice(["运动", "学习", "娱乐", "社交"]),
        }

        if "morning_person" in habits:
            schedule["morning"] = "5-7点起床"
        elif "night_owl" in habits:
            schedule["evening"] = "深夜活动，早上自然醒"

        return schedule

    def generate_dataset(self, num_users: int = 500) -> List[Dict]:
        """生成用户画像数据集"""
        print(f"生成 {num_users} 个个性化用户画像...")

        dataset = []

        for i in range(num_users):
            if i % 50 == 0:
                print(f"进度: {i}/{num_users}")

            user_id = f"user_{i + 1:04d}"
            profile = self.generate_user_profile(user_id)
            dataset.append(profile)

        print(f"用户画像生成完成！总计 {len(dataset)} 个用户")
        return dataset

    def save_dataset(self, dataset: List[Dict], output_path: str):
        """保存数据集"""
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)

        print(f"用户画像数据集已保存到: {output_path}")


def main():
    generator = UserProfileGenerator()

    # 生成500个用户画像
    dataset = generator.generate_dataset(500)

    # 保存数据集
    output_dir = Path(__file__).parent.parent / "datasets" / "personal_profiles"
    generator.save_dataset(dataset, str(output_dir / "user_profiles.json"))

    # 生成统计信息
    stats = {
        "total_users": len(dataset),
        "age_range": [
            min(p["demographics"]["age"] for p in dataset),
            max(p["demographics"]["age"] for p in dataset),
        ],
        "gender_distribution": {},
        "common_interests": [],
        "generation_date": "2024-01-24",
    }

    # 统计性别分布
    for profile in dataset:
        gender = profile["demographics"]["gender"]
        stats["gender_distribution"][gender] = (
            stats["gender_distribution"].get(gender, 0) + 1
        )

    # 统计常见兴趣
    interest_count = {}
    for profile in dataset:
        for interest in profile["preferences"]["topics"]:
            interest_count[interest] = interest_count.get(interest, 0) + 1

    stats["common_interests"] = sorted(
        interest_count.items(), key=lambda x: x[1], reverse=True
    )[:10]

    # 保存统计信息
    stats_path = Path(__file__).parent.parent / "datasets" / "profile_stats.json"
    with open(stats_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print("用户画像数据集生成完成！")
    print(f"统计信息: {stats_path}")


if __name__ == "__main__":
    main()
