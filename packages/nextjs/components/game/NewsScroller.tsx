"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "~~/hooks/useLanguage";

// 中文StarkNet相关新闻
const STARKNET_NEWS_ZH = [
  "StarkNet TVL 突破 6.29 亿美元，成为最大 ZK-Rollup 网络",
  "Layer 2 去中心化进程加速，StarkNet 安全性显著提升",
  "最新收益协议 Forge Yields Alpha 上线，吸引用户增长",
  "StarkNet 推出空投检查工具，奖励早期贡献者，吸引新用户",
  "重大更新：StarkNet 集成比特币，连接以太坊与 BTC",
  "StarkNet 生态项目激增，2024 年增长 168%",
  "StarkNet 基金会公布 STRK 质押 v2 计划，提升网络安全",
  "StarkNet Stack 公开上线，开发者可定制 ZK 链",
  "StarkNet 与 Alt Layer 合作，简化 Rollup 部署",
  "STRK 代币解锁即将来临，市场关注流动性变化",
  "以太坊与比特币开发者看好 StarkNet 执行层能力",
  "StarkNet 生态代币 STRK 或因新功能迎来价格波动",
  "知名钱包 Xverse 支持 StarkNet，推动比特币 DeFi",
  "StarkNet 跨链桥接能力增强，连接多链生态",
  "开发者报告：StarkNet 部署成本持续优化",
  "StarkNet 社区活动升温，开发者参与度创新高",
  "StarkNet 去中心化交易所优化用户体验",
  "StarkNet 用户基础扩大，生态活跃度攀升",
  "StarkNet 加深与 Layer 1 的集成，提升数据效率",
  "区块链技术巨头关注 StarkNet 的 ZK 潜力",
];

// 英文StarkNet相关新闻
const STARKNET_NEWS_EN = [
  "StarkNet TVL reaches $629 million, becomes largest ZK-Rollup network",
  "Layer 2 decentralization accelerates, StarkNet security significantly improved",
  "Latest yield protocol Forge Yields Alpha launches, attracting user growth",
  "StarkNet launches airdrop checker tool, rewards early contributors, attracts new users",
  "Major update: StarkNet integrates Bitcoin, connecting Ethereum with BTC",
  "StarkNet ecosystem projects surge, 168% growth in 2024",
  "StarkNet Foundation announces STRK staking v2 plan, enhancing network security",
  "StarkNet Stack goes public, developers can customize ZK chains",
  "StarkNet partners with Alt Layer, simplifying Rollup deployment",
  "STRK token unlock approaching, market focuses on liquidity changes",
  "Ethereum and Bitcoin developers optimistic about StarkNet execution layer",
  "StarkNet ecosystem token STRK may see price volatility due to new features",
  "Popular wallet Xverse supports StarkNet, promoting Bitcoin DeFi",
  "StarkNet cross-chain bridging capabilities enhanced, connecting multi-chain ecosystems",
  "Developer report: StarkNet deployment costs continuously optimized",
  "StarkNet community activities heat up, developer participation reaches new highs",
  "StarkNet decentralized exchanges optimize user experience",
  "StarkNet user base expands, ecosystem activity climbs",
  "StarkNet deepens integration with Layer 1, improving data efficiency",
  "Blockchain technology giants focus on StarkNet's ZK potential",
];

export const NewsScroller = () => {
  const { resolvedTheme } = useTheme();
  const { t, language } = useLanguage();
  const isDarkMode = resolvedTheme === "dark";
  const [news, setNews] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // 根据当前语言获取新闻内容
  const getCurrentNews = () => {
    return language === 'en' ? STARKNET_NEWS_EN : STARKNET_NEWS_ZH;
  };

  // 立即加载新闻并监听语言变化
  useEffect(() => {
    setNews(getCurrentNews());

    // 新闻轮换
    const interval = setInterval(() => {
      setNews((prev) => {
        const rotated = [...prev];
        rotated.push(rotated.shift() as string);
        return rotated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [language]); // 添加language依赖

  // 如果新闻还没加载，显示加载中
  if (news.length === 0) {
    return (
      <div
        className={`w-full rounded-md p-2 overflow-hidden ${
          isDarkMode
            ? "bg-base-300 text-base-content"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="text-center">
          {language === 'en' 
            ? 'Loading StarkNet latest updates...' 
            : '加载 StarkNet 最新动态...'}
        </div>
      </div>
    );
  }

  // 准备显示的新闻内容 - 重复两次以确保平滑滚动
  const displayNews = [...news, ...news];

  return (
    <div
      className={`w-full rounded-md p-2 overflow-hidden ${
        isDarkMode
          ? "bg-base-300 text-base-content"
          : "bg-gray-100 text-gray-900"
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
