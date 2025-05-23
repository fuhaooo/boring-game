"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// 丰富的StarkNet相关新闻
const STARKNET_NEWS = [
  "StarkNet TVL 突破 2 亿美元，创历史新高",
  "Layer 2 活动量持续上升，StarkNet 日交易量增长 30%",
  "最新 DeFi 协议在 StarkNet 上线，TVL 迅速攀升",
  "StarkNet 推出新的开发者工具包，简化 dApp 构建流程",
  "重大更新：StarkNet 即将发布新版本，性能提升 50%",
  "NFT 交易量在 StarkNet 生态中呈爆发式增长",
  "著名 DAO 宣布迁移至 StarkNet，看好其扩容能力",
  "StarkNet 基金会宣布 1000 万美元生态补助计划",
  "Starkware 发布 Cairo 2.0，提升开发效率",
  "StarkNet 链上游戏用户激增，游戏 DApp 交易量创新高",
  "以太坊核心开发者称赞 StarkNet ZK-Rollup 技术",
  "StarkNet 生态代币 STRK 价格突破历史高点",
  "知名交易所宣布支持 StarkNet 原生代币存款和提款",
  "StarkNet 跨链通信协议上线，连接多个主流区块链",
  "开发者报告：StarkNet 应用部署成本降低 40%",
  "StarkNet 年度开发者大会将在巴黎举行，门票售罄",
  "知名去中心化交易所在 StarkNet 部署，用户体验大幅提升",
  "StarkNet 钱包月活用户突破 100 万，社区持续增长",
  "StarkNet 与 Layer 1 集成更深，提升数据可用性",
  "游戏巨头宣布在 StarkNet 构建 Web3 游戏",
];

export const NewsScroller = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [news, setNews] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // 立即加载新闻
  useEffect(() => {
    setNews(STARKNET_NEWS);

    // 新闻轮换
    const interval = setInterval(() => {
      setNews((prev) => {
        const rotated = [...prev];
        rotated.push(rotated.shift() as string);
        return rotated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 如果新闻还没加载，显示加载中
  if (news.length === 0) {
    return (
      <div className={`w-full rounded-md p-2 overflow-hidden ${
        isDarkMode ? 'bg-base-300 text-base-content' : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="text-center">加载 StarkNet 最新动态...</div>
      </div>
    );
  }

  // 准备显示的新闻内容 - 重复两次以确保平滑滚动
  const displayNews = [...news, ...news];

  return (
    <div
      className={`w-full rounded-md p-2 overflow-hidden ${
        isDarkMode ? 'bg-base-300 text-base-content' : 'bg-gray-100 text-gray-900'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden whitespace-nowrap">
        <div
          className={`inline-block transition-all duration-300`}
          style={{
            animation: `scrollNews ${isHovering ? "120s" : "45s"} linear infinite`,
            willChange: "transform",
          }}
        >
          {displayNews.map((item, index) => (
            <span key={index} className="inline-block mx-4 font-medium">
              📰 {item}
            </span>
          ))}
        </div>

        <style jsx>{`
          @keyframes scrollNews {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
