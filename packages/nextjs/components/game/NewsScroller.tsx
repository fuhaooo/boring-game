"use client";

import { useState, useEffect } from "react";

// 示例新闻
const DEMO_NEWS = [
  "StarkNet TVL 突破 2 亿美元，创历史新高",
  "Layer 2 活动量持续上升，StarkNet 日交易量增长 30%",
  "最新 DeFi 协议在 StarkNet 上线，TVL 迅速攀升",
  "StarkNet 推出新的开发者工具包，简化 dApp 构建流程",
  "重大更新：StarkNet 即将发布新版本，性能提升 50%",
  "NFT 交易量在 StarkNet 生态中呈爆发式增长",
  "著名 DAO 宣布迁移至 StarkNet，看好其扩容能力",
];

export const NewsScroller = () => {
  const [news, setNews] = useState(DEMO_NEWS);
  
  // 在实际应用中，可以从API获取新闻
  useEffect(() => {
    // 模拟定期获取新闻
    const interval = setInterval(() => {
      // 在真实应用中，这里可以调用API
      // 这里只是简单地轮换新闻
      setNews(prev => {
        const rotated = [...prev];
        rotated.push(rotated.shift() as string);
        return rotated;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full bg-gray-100 rounded-md p-2 overflow-hidden">
      <div className="relative whitespace-nowrap">
        <div className="inline-block animate-marquee">
          {news.map((item, index) => (
            <span key={index} className="inline-block mx-4">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 