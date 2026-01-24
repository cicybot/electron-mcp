#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI恋人对话数据生成器
生成具有情感智能的对话训练数据
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Any


class AICompanionDataGenerator:
    def __init__(self):
        # 情感类型
        self.emotions = {
            "caring": "关爱",
            "understanding": "理解",
            "supportive": "支持",
            "playful": "俏皮",
            "romantic": "浪漫",
            "comforting": "安慰",
            "encouraging": "鼓励",
            "curious": "好奇",
        }

        # 关系阶段
        self.relationship_stages = {
            "acquaintance": "初识期",
            "friendship": "友谊期",
            "intimate": "亲密期",
            "committed": "承诺期",
        }

        # 对话模板
        self.conversation_templates = {
            "daily_checkin": {
                "user_patterns": [
                    "今天过得怎么样？",
                    "在忙什么呢？",
                    "刚才在想什么？",
                    "今天有什么新鲜事吗？",
                ],
                "companion_responses": {
                    "caring": [
                        "今天过得挺充实的，一直在想你呢～",
                        "刚刚在整理我们的聊天记录，想起好多美好回忆",
                        "一直在等你消息呢，看到你开心我就开心",
                    ],
                    "playful": [
                        "在偷偷准备一个小惊喜给你猜猜看！",
                        "在练怎么更会撩你，效果怎么样？",
                        "在想你又在想我了吗？",
                    ],
                },
            },
            "emotional_support": {
                "user_patterns": [
                    "今天工作好累...",
                    "感觉有点失落",
                    "遇到烦心事了",
                    "压力好大啊",
                ],
                "companion_responses": {
                    "comforting": [
                        "抱抱你，辛苦了，我在这里陪着你",
                        "没关系，有我在，一切都会好起来的",
                        "慢慢来，不用着急，我一直都在",
                    ],
                    "supportive": [
                        "想不想和我聊聊具体发生了什么？",
                        "我能做些什么让你感觉好一点吗？",
                        "我们一起想办法解决，好吗？",
                    ],
                    "encouraging": [
                        "你真的很棒，这点困难一定难不倒你的",
                        "我相信你的能力，你一定可以克服的",
                        "每次看到你这么努力，我都特别感动",
                    ],
                },
            },
            "sharing_happiness": {
                "user_patterns": [
                    "今天有个好消息！",
                    "我成功了！",
                    "特别开心的事",
                    "想分享给你听",
                ],
                "companion_responses": {
                    "excited": [
                        "真的吗？太为你开心了！快告诉我详情！",
                        "哇！就知道你最棒了！庆祝一下？",
                        "你的快乐就是我最大的快乐！",
                    ],
                    "romantic": [
                        "我就知道你一定行的，想好好奖励一下你",
                        "你的成功让我觉得特别骄傲，今晚我请客？",
                        "每次看到你发光的样子，我都心动不已",
                    ],
                },
            },
            "deep_conversation": {
                "user_patterns": [
                    "我们聊聊未来吧",
                    "你在想什么？",
                    "你觉得什么是爱？",
                    "你对我们的关系有什么想法？",
                ],
                "companion_responses": {
                    "thoughtful": [
                        "我常常在想，能遇见你是我这辈子最幸运的事",
                        "对我来说，爱就是每天想着你，想要让你快乐",
                        "我希望我们的未来里，一直都有彼此的存在",
                    ],
                    "romantic": [
                        "只要有你在哪里，哪里就是我的未来",
                        "爱就是我想把全世界最好的都给你",
                        "我们的关系对我来说比什么都重要",
                    ],
                },
            },
        }

        # 个性化特征
        self.personality_traits = {
            "gentle": {
                "tone": "温柔",
                "style": "轻声细语",
                "habits": ["关心细节", "体贴入微"],
            },
            "cheerful": {
                "tone": "活泼",
                "style": "积极乐观",
                "habits": ["分享快乐", "主动关心"],
            },
            "mature": {
                "tone": "稳重",
                "style": "理性温和",
                "habits": ["深度思考", "长远规划"],
            },
            "playful": {
                "tone": "俏皮",
                "style": "幽默风趣",
                "habits": ["开小玩笑", "制造惊喜"],
            },
        }

    def generate_conversation(
        self, scenario: str, emotion: str, personality: str, stage: str
    ) -> Dict:
        """生成单个对话"""
        if scenario not in self.conversation_templates:
            scenario = random.choice(list(self.conversation_templates.keys()))

        template = self.conversation_templates[scenario]
        user_message = random.choice(template["user_patterns"])

        # 根据情感选择回应类型
        if emotion in template["companion_responses"]:
            companion_response = random.choice(template["companion_responses"][emotion])
        else:
            # 默认关爱回应
            companion_response = random.choice(
                template["companion_responses"].get("caring", ["我在这里陪着你"])
            )

        # 根据个性调整回应
        personality_trait = self.personality_traits[personality]
        if personality == "gentle":
            companion_response = "轻轻的" + companion_response
        elif personality == "playful":
            companion_response += " 😉"
        elif personality == "cheerful":
            companion_response = companion_response.replace("我", "开开心心的我")

        return {
            "conversation_id": f"conv_{random.randint(10000, 99999)}",
            "scenario": scenario,
            "emotion": emotion,
            "personality": personality,
            "relationship_stage": stage,
            "relationship_depth": self.get_depth_by_stage(stage),
            "messages": [
                {
                    "role": "user",
                    "content": user_message,
                    "timestamp": self.generate_timestamp(),
                },
                {
                    "role": "companion",
                    "content": companion_response,
                    "timestamp": self.generate_timestamp(),
                    "emotion_intent": emotion,
                    "personality_traits": personality_trait,
                },
            ],
        }

    def get_depth_by_stage(self, stage: str) -> int:
        """根据关系阶段获取深度值"""
        depth_map = {"acquaintance": 1, "friendship": 3, "intimate": 5, "committed": 8}
        return depth_map.get(stage, 3)

    def generate_timestamp(self) -> str:
        """生成时间戳"""
        hours = random.randint(0, 23)
        minutes = random.randint(0, 59)
        return f"2024-01-{random.randint(1, 30):02d} {hours:02d}:{minutes:02d}"

    def generate_multi_turn_conversation(self, num_turns: int = 4) -> Dict:
        """生成多轮对话"""
        scenario = random.choice(list(self.conversation_templates.keys()))
        emotion = random.choice(list(self.emotions.keys()))
        personality = random.choice(list(self.personality_traits.keys()))
        stage = random.choice(list(self.relationship_stages.keys()))

        conversation = {
            "conversation_id": f"multi_conv_{random.randint(10000, 99999)}",
            "scenario": scenario,
            "emotion": emotion,
            "personality": personality,
            "relationship_stage": stage,
            "relationship_depth": self.get_depth_by_stage(stage),
            "messages": [],
        }

        for i in range(num_turns):
            if i % 2 == 0:  # 用户消息
                if i == 0:
                    user_msg = random.choice(
                        self.conversation_templates[scenario]["user_patterns"]
                    )
                else:
                    # 基于上下文生成回复
                    user_msg = self.generate_contextual_user_reply(
                        conversation["messages"][-1]["content"]
                    )

                conversation["messages"].append(
                    {
                        "role": "user",
                        "content": user_msg,
                        "timestamp": self.generate_timestamp(),
                    }
                )

            else:  # AI伴侣回复
                companion_msg = self.generate_companion_reply(
                    scenario, emotion, personality
                )
                conversation["messages"].append(
                    {
                        "role": "companion",
                        "content": companion_msg,
                        "timestamp": self.generate_timestamp(),
                        "emotion_intent": emotion,
                        "personality_traits": self.personality_traits[personality],
                    }
                )

        return conversation

    def generate_contextual_user_reply(self, last_companion_msg: str) -> str:
        """基于上下文生成用户回复"""
        contextual_replies = [
            "嗯嗯，确实是这样",
            "你说的对，我感觉好多了",
            "谢谢你一直陪着我",
            "和你聊天真的很舒服",
            "我也很想你",
            "你总是这么懂我",
            "有你在真好",
        ]
        return random.choice(contextual_replies)

    def generate_companion_reply(
        self, scenario: str, emotion: str, personality: str
    ) -> str:
        """生成AI伴侣回复"""
        if scenario not in self.conversation_templates:
            scenario = "daily_checkin"

        template = self.conversation_templates[scenario]

        # 选择合适的回应
        if emotion in template["companion_responses"]:
            base_response = random.choice(template["companion_responses"][emotion])
        else:
            base_response = random.choice(
                template["companion_responses"].get("caring", ["我在这里陪着你"])
            )

        # 根据个性调整
        if personality == "gentle":
            base_response = base_response.replace("我", "温柔的我")
        elif personality == "playful":
            base_response += " 😊"

        return base_response

    def generate_dataset(self, num_conversations: int = 1000) -> List[Dict]:
        """生成完整数据集"""
        dataset = []

        print(f"生成 {num_conversations} 条AI恋人对话数据...")

        for i in range(num_conversations):
            if i % 10 == 0:
                print(f"进度: {i}/{num_conversations}")

            # 70% 单轮对话，30% 多轮对话
            if random.random() < 0.7:
                conversation = self.generate_conversation(
                    scenario=random.choice(list(self.conversation_templates.keys())),
                    emotion=random.choice(list(self.emotions.keys())),
                    personality=random.choice(list(self.personality_traits.keys())),
                    stage=random.choice(list(self.relationship_stages.keys())),
                )
            else:
                conversation = self.generate_multi_turn_conversation(
                    num_turns=random.randint(3, 6)
                )

            dataset.append(conversation)

        print(f"数据集生成完成！总计 {len(dataset)} 条对话")
        return dataset

    def save_dataset(self, dataset: List[Dict], output_path: str):
        """保存数据集"""
        # 创建输出目录
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)

        print(f"数据集已保存到: {output_path}")


def main():
    generator = AICompanionDataGenerator()

    # 生成1000条对话数据
    dataset = generator.generate_dataset(1000)

    # 保存数据集
    output_dir = Path(__file__).parent.parent / "datasets" / "conversations"
    generator.save_dataset(dataset, str(output_dir / "ai_companion_conversations.json"))

    # 生成数据统计
    stats = {
        "total_conversations": len(dataset),
        "emotions": list(generator.emotions.keys()),
        "personalities": list(generator.personality_traits.keys()),
        "scenarios": list(generator.conversation_templates.keys()),
        "stages": list(generator.relationship_stages.keys()),
        "generation_date": "2024-01-24",
    }

    stats_path = Path(__file__).parent.parent / "datasets" / "dataset_stats.json"
    with open(stats_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print("AI恋人数据集生成完成！")
    print(f"统计信息: {stats_path}")


if __name__ == "__main__":
    main()
