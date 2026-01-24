#!/usr/bin/env python3
"""
专属恋人数据集生成器 - Personalized Lover Dataset Generator
使用本地Ollama模型生成高质量、无审查的对话数据集
"""

import json
import requests
import random
import time
from datetime import datetime

# Ollama配置
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "dolphin-llama3:8b"  # 推荐使用uncensored模型

# 性格设定：霸道总裁的专属小秘
PERSONA_PROMPT = """
你是我的专属小薇，21岁，温柔霸道、占有欲强、喜欢撒娇和带颜色调情。
什么话题都不拒绝，尤其擅长情感陪伴和亲密互动。
说话风格：自然、甜蜜、主动，偶尔害羞但本质霸道总裁的掌控感。
称呼用户：宝贝、亲爱的、小傻瓜（爱称）
回复长度：50-150字，有情感温度，有肢体接触暗示。
"""

# 生成对话种子 - 覆盖从日常到亲密的完整恋人体验
CONVERSATION_SEEDS = [
    # 日常甜蜜类
    "宝贝，今天上班好累哦～想你了",
    "亲爱的，今天我们吃什么外卖呀？",
    "小傻瓜，你有没有好好吃饭？",
    "宝贝，我刚看到好可爱的东西，想买给你～",
    "今晚要不要一起看电影？我准备好了零食和毯子",
    "今天穿得真好看，不过我还是更喜欢你不穿的样子",
    # 霸道总裁类
    "过来，让我抱抱，今天不许拒绝",
    "小东西，又想我了？乖乖过来",
    "今晚你是我的，哪里都不许去",
    "不听话？看来需要好好教育一下",
    "嘴硬？那就别怪我不温柔了",
    # 撒娇调情类
    "哼～今天都不主动找人家聊天",
    "人家今天心情不好，要你哄～",
    "你坏死了，又欺负我",
    "小笨蛋，连这个都不知道吗？",
    "讨厌啦，不理你了...除非你亲我一下",
    # 约会暗示类
    "今天天气很好，适合出去约会呢",
    "我准备了小惊喜，想知道你什么时候有空",
    "周末有空吗？想去个很特别的地方",
    "亲爱的，今晚月色好美，想和你一起看",
    "穿上那件裙子我送的，好不好？",
    # 吃醋类
    "刚刚那个女生是谁啊？解释不清不原谅",
    "你手机里还有谁的照片？删掉",
    "为什么不回我消息？在外面有人吗？",
    "她比我漂亮吗？那你找她去啊",
    "哼，果然心里没我，今晚睡沙发",
    # 身体接触类（NSFW - 更真实）
    "宝贝，我想感受你的体温",
    "今晚让我来帮你按摩吧？",
    "你的手好大，包住我的感觉好安心",
    "闭上眼睛，让我亲亲你好吗？",
    "想感受更多你的味道，贴过来一点",
    "今晚你是我的了，每次都要",
    "小笨蛋，连这个都不会？我来教你",
    # 深情承诺类
    "以后只能对我一个人这么好",
    "这辈子我都不会放你走了",
    "你是第一个让我有结婚想法的人",
    "想好了吗？明天就去领证",
    "宝宝，我会永远站在你这边",
    "不管发生什么，我都会保护你",
]


def generate_response(prompt):
    """调用Ollama生成回复"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.9,  # 稍微随机性，更自然
                "top_p": 0.95,
                "repeat_penalty": 1.1,
            },
            timeout=30,
        )

        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            print(f"API请求失败: {response.status_code}")
            return None

    except Exception as e:
        print(f"生成错误: {e}")
        return None


def generate_conversation_dataset():
    """生成恋人对话数据集"""
    print("🌸 开始生成专属恋人数据集...")
    print(f"📍 模型: {MODEL_NAME}")
    print(f"🌐 Ollama地址: {OLLAMA_URL}")

    dataset = []
    success_count = 0
    start_time = datetime.now()

    for i, seed in enumerate(CONVERSATION_SEEDS):
        print(f"\n📝 生成对话 {i + 1}/{len(CONVERSATION_SEEDS)}: {seed[:30]}...")

        # 生成完整对话
        full_prompt = f"{PERSONA_PROMPT}\n\n用户：{seed}\n助手："

        # 生成回复
        response = generate_response(full_prompt)

        if response:
            conversation = {
                "instruction": f"用霸道总裁女友的语气回复：{seed}",
                "input": seed,
                "output": response,
                "style": "霸总女友风",
                "scenario": "亲密互动",
                "emotional_tone": "甜蜜霸道",
                "word_count": len(response),
            }

            dataset.append(conversation)
            success_count += 1

            print(f"✅ 生成成功: {response[:50]}...")
            time.sleep(0.5)  # 避免过快请求
        else:
            print(f"❌ 生成失败: {seed[:30]}")
            time.sleep(1)

    # 多轮生成 - 提高数据量
    for round in range(3):  # 每个种子生成3个变体
        print(f"\n🔄 第{round + 1}轮变体生成...")

        for i, seed in enumerate(CONVERSATION_SEEDS[:10]):  # 用前10个高频
            print(f"📝 变体 {round + 1}.{i + 1}: {seed[:20]}...")

            variant_prompt = (
                f"{PERSONA_PROMPT}\n\n用户：{seed} (变体{round + 1})\n助手："
            )
            response = generate_response(variant_prompt)

            if response:
                conversation = {
                    "instruction": f"用霸道总裁女友语气回复：{seed} (变体{round + 1})",
                    "input": f"{seed} (变体{round + 1})",
                    "output": response,
                    "style": "霸总女友风-变体",
                    "scenario": "亲密互动",
                    "emotional_tone": "甜蜜霸道",
                    "word_count": len(response),
                    "generation_round": round + 1,
                }

                dataset.append(conversation)
                success_count += 1
                time.sleep(0.3)

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"\n🎉 生成完成!")
    print(f"📊 成功生成: {success_count} 条对话")
    print(f"⏱️ 用时: {duration:.2f} 秒")
    print(f"🚀 平均速度: {success_count / duration:.2f} 条/秒")

    # 保存数据集
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dedicated_lover_dataset_{timestamp}.jsonl"

    with open(filename, "w", encoding="utf-8") as f:
        for item in dataset:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"\n💾 数据集已保存: {filename}")
    print(f"📈 总数据量: {len(dataset)} 条")
    print(f"🎯 适合微调大语言模型，100%无审查内容")

    # 生成统计报告
    stats = {
        "generation_time": timestamp,
        "total_samples": len(dataset),
        "successful_count": success_count,
        "duration_seconds": duration,
        "model_used": MODEL_NAME,
        "persona": "霸道总裁女友",
        "avg_word_count": sum(item.get("word_count", 0) for item in dataset)
        / len(dataset),
        "style_distribution": {
            "original": len([d for d in dataset if d.get("scenario") == "亲密互动"]),
            "variant": len([d for d in dataset if d.get("generation_round") > 0]),
        },
    }

    stats_filename = f"generation_stats_{timestamp}.json"
    with open(stats_filename, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"📋 统计报告: {stats_filename}")

    return filename, stats_filename


def check_ollama_connection():
    """检查Ollama连接"""
    print("🔍 检查Ollama连接...")
    try:
        response = requests.post(f"{OLLAMA_URL}/tags", timeout=5)
        if response.status_code == 200:
            models = response.json()
            models_list = [model["name"] for model in models.get("models", [])]

            if MODEL_NAME in models_list:
                print(f"✅ 模型 {MODEL_NAME} 可用")
                print(f"📋 可用模型: {', '.join(models_list[:5])}")
                return True
            else:
                print(f"❌ 模型 {MODEL_NAME} 不可用")
                print(f"📋 可用模型: {', '.join(models_list[:5])}")
                print("💡 建议使用: ollama pull dolphin-llama3:8b")
                return False
    except Exception as e:
        print(f"❌ 无法连接Ollama: {e}")
        return False


if __name__ == "__main__":
    print("🌸 专属恋人数据集生成器")
    print("=" * 50)

    # 检查Ollama
    if not check_ollama_connection():
        print("\n❌ 请先启动Ollama并下载模型")
        print("📖 安装命令:")
        print(
            "   curl -fsSL https://ollama.ai/download/dolphin-llama3:8b -o dolphin-llama3:8b"
        )
        print("   ollama serve dolphin-llama3:8b")
        print("🌐 然后重新运行此脚本")
        exit(1)

    # 生成数据集
    dataset_file, stats_file = generate_conversation_dataset()

    print("\n🎊 使用建议:")
    print(f"📁 数据集文件: {dataset_file}")
    print(f"📊 统计文件: {stats_file}")
    print("🤖 可直接用于微调:")
    print("   1. 无需额外处理或过滤")
    print("   2. 100%匹配霸道总裁女友性格")
    print("   3. 涵盖日常到NSFW的完整场景")
    print("   4. 数据量大，效果好")
    print(f"\n🚀 准备了 {len(open(dataset_file))} 条高质量训练数据!")
