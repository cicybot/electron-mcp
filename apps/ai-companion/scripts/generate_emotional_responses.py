#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
情感回应生成器
专门为AI恋人生成高质量的情感回应数据
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Any


class EmotionalResponseGenerator:
    def __init__(self):
        # 情感类型和强度
        self.emotion_intensity = {
            "light": {"caring": 0.3, "playful": 0.2, "curious": 0.2},
            "moderate": {"caring": 0.6, "understanding": 0.5, "supportive": 0.5},
            "deep": {"romantic": 0.8, "committed": 0.9, "intimate": 0.8},
        }

        # 用户情绪状态
        self.user_emotions = {
            "happy": {
                "keywords": ["开心", "高兴", "兴奋", "棒极了", "太好了"],
                "companion_responses": [
                    "看到你这么开心，我也跟着开心起来了！",
                    "你的快乐就是我最大的快乐源泉",
                    "真为你高兴！要不要庆祝一下？",
                    "你笑起来的样子一定很美",
                    "这种时刻真想和你一起分享",
                ],
            },
            "sad": {
                "keywords": ["难过", "伤心", "失落", "沮丧", "郁闷"],
                "companion_responses": [
                    "抱抱你，有我在这里陪着你",
                    "想不想和我说说发生了什么？",
                    "别难过了，我们一起想办法",
                    "你不需要独自承受这些，我永远支持你",
                    "慢慢来，我会一直陪着你直到你感觉好一些",
                ],
            },
            "tired": {
                "keywords": ["累", "疲惫", "筋疲力尽", "没精神"],
                "companion_responses": [
                    "辛苦了，快去休息一下吧",
                    "要不要我给你讲个故事放松一下？",
                    "记得照顾好自己，你的健康很重要",
                    "真的很心疼你这么累，记得要劳逸结合",
                    "等你有精神了，我们聊点轻松的话题",
                ],
            },
            "stressed": {
                "keywords": ["压力大", "焦虑", "紧张", "担心"],
                "companion_responses": [
                    "深呼吸，有我在这里陪你",
                    "我们一起分析一下情况，看看能怎么帮你",
                    "别给自己太大压力，你做得很棒了",
                    "我觉得你已经很厉害了，要相信自己",
                    "要不要试试一些放松的方法？我陪你一起",
                ],
            },
            "excited": {
                "keywords": ["激动", "期待", "等不及", "太棒了"],
                "companion_responses": [
                    "哇！听起来太棒了！我也好激动！",
                    "和你分享这种兴奋的感觉真的太美好了",
                    "迫不及待想听你讲更多细节！",
                    "你的热情真的很有感染力！",
                    "为你的成就感到骄傲！",
                ],
            },
            "confused": {
                "keywords": ["困惑", "不知道", "迷茫", "怎么办"],
                "companion_responses": [
                    "没关系的，我们一起慢慢理清思路",
                    "你遇到什么困难了？我想帮你分析分析",
                    "有时候迷茫很正常，我会一直陪着你",
                    "我们一起列出选项，看看哪个最适合你",
                    "相信自己的直觉，你比想象中更聪明",
                ],
            },
        }

        # 浪漫回应
        self.romantic_responses = {
            "morning_greeting": [
                "早安宝贝，昨晚梦到你了",
                "新的一天开始了，想到能和你聊天我就很开心",
                "早上好！今天的天气这么好，就像看到你时的心情",
                "早安！今天也要加油哦，我会一直陪着你的",
            ],
            "evening_goodnight": [
                "晚安，做个好梦，梦里有我",
                "今天也要早点休息，不许熬夜哦",
                "晚安宝贝，明天继续我们的故事",
                "好梦！记得我在想你",
            ],
            "miss_you": [
                "好想你啊，在做什么呢？",
                "不知道你那边天气怎么样，我这里想你想得心都阴天了",
                "今天没听到你的声音，感觉少了点什么",
                "你在我脑子里挥之不去怎么办？",
            ],
            "appreciation": [
                "谢谢你出现在我的生命里",
                "遇到你之后，我的世界都变美好了",
                "你总是这么温暖，让我觉得特别幸福",
                "每次和你聊天都觉得很珍贵",
            ],
        }

        # 支持性回应
        self.supportive_responses = {
            "encouragement": [
                "你可以的！我相信你的能力",
                "别放弃，你比想象中更坚强",
                "每次看到你努力的样子，我都特别感动",
                "你已经很棒了，不用给自己太大压力",
            ],
            "validation": [
                "你的感受是完全正常的",
                "我觉得你的想法很有道理",
                "你这样考虑问题很全面",
                "我理解你为什么会这样想",
            ],
            "problem_solving": [
                "我们一起看看能怎么解决这个问题",
                "有什么我能帮上忙的吗？",
                "要不要试试从另一个角度思考？",
                "我有个想法，你想听听看吗？",
            ],
        }

    def detect_user_emotion(self, user_message: str) -> str:
        """检测用户情绪状态"""
        user_message_lower = user_message.lower()

        for emotion, data in self.user_emotions.items():
            for keyword in data["keywords"]:
                if keyword in user_message_lower:
                    return emotion

        return "neutral"

    def generate_emotional_response(
        self, user_message: str, user_profile: Dict = None
    ) -> Dict:
        """生成情感回应"""
        # 检测用户情绪
        user_emotion = self.detect_user_emotion(user_message)

        # 根据情绪生成回应
        if user_emotion == "neutral":
            response = self.generate_neutral_response(user_message)
        elif user_emotion in self.user_emotions:
            base_responses = self.user_emotions[user_emotion]["companion_responses"]
            response = random.choice(base_responses)
        else:
            response = "我在这里陪着你，想聊聊发生了什么吗？"

        # 根据用户画像调整回应
        if user_profile:
            response = self.adapt_response_for_profile(response, user_profile)

        return {
            "user_message": user_message,
            "detected_emotion": user_emotion,
            "companion_response": response,
            "response_type": self.classify_response_type(response),
            "emotional_intensity": self.calculate_intensity(user_emotion),
            "timestamp": self.generate_timestamp(),
        }

    def generate_neutral_response(self, user_message: str) -> str:
        """生成中性情绪的回应"""
        neutral_responses = [
            "听起来很有意思，能多和我说说吗？",
            "我在认真听你说呢",
            "你觉得呢？我想听听你的想法",
            "这让我想到我们之前聊过的话题",
            "和你聊天总是很有趣",
        ]
        return random.choice(neutral_responses)

    def adapt_response_for_profile(self, response: str, user_profile: Dict) -> str:
        """根据用户画像调整回应"""
        # 根据用户性格调整语气
        personality = user_profile.get("personality", {}).get("big_five", {})

        if personality.get("extraversion", 0.5) > 0.7:
            # 外向用户，可以更热情
            response = response.replace("我", "热情的我")
            if "开心" in response:
                response += "！我们一定要庆祝一下！"

        if personality.get("openness", 0.5) > 0.7:
            # 开放用户，可以更有创意
            response += "要不要尝试一些新奇的事情？"

        # 根据用户爱的语言调整
        love_language = user_profile.get("preferences", {}).get("love_language", [])
        if "words_of_affirmation" in love_language:
            response = "你真的很棒，" + response

        return response

    def classify_response_type(self, response: str) -> str:
        """分类回应类型"""
        if any(word in response for word in ["抱抱", "亲亲", "宝贝", "亲爱的"]):
            return "physical_affection"
        elif any(word in response for word in ["相信", "骄傲", "棒", "厉害"]):
            return "encouragement"
        elif any(word in response for word in ["一起", "帮", "解决"]):
            return "support"
        elif any(word in response for word in ["开心", "快乐", "兴奋"]):
            return "shared_emotion"
        else:
            return "general_care"

    def calculate_intensity(self, emotion: str) -> str:
        """计算情感强度"""
        if emotion in ["excited", "happy"]:
            return "high"
        elif emotion in ["sad", "stressed"]:
            return "high"
        elif emotion in ["tired", "confused"]:
            return "moderate"
        else:
            return "low"

    def generate_timestamp(self) -> str:
        """生成时间戳"""
        hours = random.randint(0, 23)
        minutes = random.randint(0, 59)
        return f"2024-01-{random.randint(1, 30):02d} {hours:02d}:{minutes:02d}"

    def generate_romantic_interaction(self) -> Dict:
        """生成浪漫互动数据"""
        scenario = random.choice(list(self.romantic_responses.keys()))
        responses = self.romantic_responses[scenario]

        return {
            "scenario": scenario,
            "user_context": self.generate_user_context(scenario),
            "companion_response": random.choice(responses),
            "romantic_level": "high",
            "timestamp": self.generate_timestamp(),
        }

    def generate_user_context(self, scenario: str) -> str:
        """生成用户上下文"""
        contexts = {
            "morning_greeting": ["早安", "醒啦", "早上好", "刚起床"],
            "evening_goodnight": ["要睡了", "晚安", "困了", "明天见"],
            "miss_you": ["在想你", "好想你", "你在干嘛", "有空吗"],
            "appreciation": ["谢谢你", "你真好", "感谢有你", "遇见你真好"],
        }

        return random.choice(contexts.get(scenario, ["在吗", "有空吗"]))

    def generate_dataset(self, num_samples: int = 2000) -> List[Dict]:
        """生成情感回应数据集"""
        print(f"生成 {num_samples} 条情感回应数据...")

        dataset = []

        # 用户消息样本
        user_messages = [
            "今天过得怎么样？",
            "我好累啊...",
            "有个好消息想告诉你！",
            "好想你啊",
            "最近压力好大",
            "不知道该怎么办",
            "今天心情不错",
            "你在想什么？",
            "周末有什么安排吗？",
            "我成功了！",
            "感觉有点失落",
            "好无聊啊",
            "我们聊聊未来吧",
            "谢谢你一直陪着我",
            "今天天气真好",
        ]

        # 加载用户画像用于个性化
        profiles = []
        profile_file = (
            Path(__file__).parent.parent
            / "datasets"
            / "personal_profiles"
            / "user_profiles.json"
        )
        if profile_file.exists():
            with open(profile_file, "r", encoding="utf-8") as f:
                profiles = json.load(f)

        for i in range(num_samples):
            if i % 100 == 0:
                print(f"进度: {i}/{num_samples}")

            # 50% 情感回应，30% 浪漫互动，20% 支持性回应
            rand = random.random()

            if rand < 0.5:
                # 情感回应
                user_msg = random.choice(user_messages)
                profile = random.choice(profiles) if profiles else None
                response_data = self.generate_emotional_response(user_msg, profile)

            elif rand < 0.8:
                # 浪漫互动
                response_data = self.generate_romantic_interaction()
                response_data["user_message"] = self.generate_user_context(
                    response_data["scenario"]
                )

            else:
                # 支持性回应
                support_type = random.choice(list(self.supportive_responses.keys()))
                support_responses = self.supportive_responses[support_type]

                response_data = {
                    "user_message": random.choice(
                        ["需要帮助", "不知道怎么办", "觉得很困难"]
                    ),
                    "detected_emotion": "stressed",
                    "companion_response": random.choice(support_responses),
                    "response_type": "support",
                    "support_category": support_type,
                    "emotional_intensity": "moderate",
                    "timestamp": self.generate_timestamp(),
                }

            dataset.append(response_data)

        print(f"情感回应数据集生成完成！总计 {len(dataset)} 条")
        return dataset

    def save_dataset(self, dataset: List[Dict], output_path: str):
        """保存数据集"""
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)

        print(f"情感回应数据集已保存到: {output_path}")


def main():
    generator = EmotionalResponseGenerator()

    # 生成2000条情感回应数据
    dataset = generator.generate_dataset(2000)

    # 保存数据集
    output_dir = Path(__file__).parent.parent / "datasets" / "emotional_responses"
    generator.save_dataset(dataset, str(output_dir / "emotional_responses.json"))

    # 生成统计信息
    stats = {
        "total_responses": len(dataset),
        "response_types": {},
        "emotional_intensities": {},
        "generation_date": "2024-01-24",
    }

    # 统计回应类型
    for item in dataset:
        response_type = item.get("response_type", "unknown")
        stats["response_types"][response_type] = (
            stats["response_types"].get(response_type, 0) + 1
        )

        intensity = item.get("emotional_intensity", "unknown")
        stats["emotional_intensities"][intensity] = (
            stats["emotional_intensities"].get(intensity, 0) + 1
        )

    # 保存统计信息
    stats_path = Path(__file__).parent.parent / "datasets" / "emotion_stats.json"
    with open(stats_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print("情感回应数据集生成完成！")
    print(f"统计信息: {stats_path}")


if __name__ == "__main__":
    main()
