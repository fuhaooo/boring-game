"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { MovingIcon } from "~~/components/game/MovingIcon";
import { LofiPlayer } from "~~/components/game/LofiPlayer";
import { NewsScroller } from "~~/components/game/NewsScroller";
import { RainEffect } from "~~/components/game/RainEffect";
import { ThunderstormEffect } from "~~/components/game/ThunderstormEffect";
import { AchievementNotification } from "~~/components/game/AchievementNotification";
import Image from "next/image";

// 定义Achievement接口
interface Achievement {
  id: number;
  name: string;
  description: string;
  requirement: number;
}

// 组件解锁门槛
const UNLOCK_THRESHOLDS = {
  movingIcon: 50,
  lofiPlayer: 150,
  newsScroller: 300,
  rainEffect: 500,
  thunderstorm: 800
};

// 成就定义
const ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: "初学者", description: "达到100积分", requirement: 100 },
  { id: 2, name: "进阶者", description: "达到500积分", requirement: 500 },
  { id: 3, name: "达人", description: "达到1000积分", requirement: 1000 }
];

const BoringGame = () => {
  const { address } = useAccount();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [movingIconCount, setMovingIconCount] = useState(0); // 移动图标计数
  const [hasLofiPlayer, setHasLofiPlayer] = useState(false); // 是否已购买Lofi播放器
  const [hasNewsScroller, setHasNewsScroller] = useState(false); // 是否已购买新闻滚动
  const [hasRainEffect, setHasRainEffect] = useState(false); // 是否已购买雨声
  const [hasThunderstorm, setHasThunderstorm] = useState(false); // 是否已购买雷雨
  const [clicksPerSecond, setClicksPerSecond] = useState(0); // 每秒点击率
  const [totalClicks, setTotalClicks] = useState(0); // 总点击次数
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  
  // 保存已解锁的组件状态
  const [unlockedFeatures, setUnlockedFeatures] = useState({
    movingIcon: false,
    lofiPlayer: false,
    newsScroller: false,
    rainEffect: false,
    thunderstorm: false
  });
  
  // 实时根据分数显示可用组件
  const availableComponents = {
    movingIcon: unlockedFeatures.movingIcon || score >= UNLOCK_THRESHOLDS.movingIcon,
    lofiPlayer: unlockedFeatures.lofiPlayer || score >= UNLOCK_THRESHOLDS.lofiPlayer,
    newsScroller: unlockedFeatures.newsScroller || score >= UNLOCK_THRESHOLDS.newsScroller,
    rainEffect: unlockedFeatures.rainEffect || score >= UNLOCK_THRESHOLDS.rainEffect,
    thunderstorm: unlockedFeatures.thunderstorm || score >= UNLOCK_THRESHOLDS.thunderstorm
  };
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // 开发模式下临时使用下面的函数代替合约交互
  const startGame = async () => {
    console.log("游戏开始");
    return true;
  };

  const recordScore = async (args: any) => {
    console.log("记录分数", args);
    return true;
  };

  const mintNFT = async (args: any) => {
    console.log("铸造NFT", args);
    return true;
  };

  // 定期保存分数
  useEffect(() => {
    if (gameStarted && score > 0) {
      const interval = setInterval(() => {
        recordScore({ args: [score] })
          .catch(err => console.error("Error recording score:", err));
      }, 30000); // 每30秒记录一次

      return () => clearInterval(interval);
    }
  }, [gameStarted, score]);

  // 计算每秒点击率
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = (now - lastClickTime) / 1000;
        if (elapsedSeconds > 0) {
          setClicksPerSecond(Math.round((totalClicks / elapsedSeconds) * 10) / 10);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStarted, lastClickTime, totalClicks]);

  // 游戏开始时初始化 - 删除这个自动设置图标的效果
  useEffect(() => {
    if (gameStarted) {
      // 不再自动创建移动图标
      // 只记录游戏已开始状态
    }
  }, [gameStarted]);

  // 检查解锁组件 - 一旦解锁就永久解锁
  useEffect(() => {
    // 更新已解锁的功能
    setUnlockedFeatures(prev => ({
      movingIcon: prev.movingIcon || score >= UNLOCK_THRESHOLDS.movingIcon,
      lofiPlayer: prev.lofiPlayer || score >= UNLOCK_THRESHOLDS.lofiPlayer,
      newsScroller: prev.newsScroller || score >= UNLOCK_THRESHOLDS.newsScroller,
      rainEffect: prev.rainEffect || score >= UNLOCK_THRESHOLDS.rainEffect,
      thunderstorm: prev.thunderstorm || score >= UNLOCK_THRESHOLDS.thunderstorm
    }));
    
    // 检查成就解锁
    ACHIEVEMENTS.forEach(achievement => {
      if (score >= achievement.requirement && 
          !unlockedAchievements.some(a => a.id === achievement.id)) {
        // 成就解锁
        setUnlockedAchievements(prev => [...prev, achievement]);
        setCurrentAchievement(achievement);
        setShowNotification(true);
        
        // 自动关闭通知
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    });
  }, [score, unlockedAchievements]);

  // 开始游戏处理
  const handleStartGame = async () => {
    try {
      await startGame();
      setGameStarted(true);
      setLastClickTime(Date.now());
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  // 点击按钮增加分数
  const handleClick = () => {
    if (gameStarted) {
      setScore(prev => prev + 1);
      setTotalClicks(prev => prev + 1);
    }
  };

  // 购买移动图标
  const purchaseMovingIcon = () => {
    if (score >= UNLOCK_THRESHOLDS.movingIcon) {
      setScore(prev => prev - UNLOCK_THRESHOLDS.movingIcon);
      setMovingIconCount(prev => prev + 1);
      
      // 如果是第一次购买，同时解锁该功能
      if (!unlockedFeatures.movingIcon) {
        setUnlockedFeatures(prev => ({
          ...prev,
          movingIcon: true
        }));
      }
    }
  };

  // 购买Lofi播放器
  const purchaseLofiPlayer = () => {
    if (score >= UNLOCK_THRESHOLDS.lofiPlayer) {
      setScore(prev => prev - UNLOCK_THRESHOLDS.lofiPlayer);
      setHasLofiPlayer(true);
    }
  };
  
  // 购买新闻滚动
  const purchaseNewsScroller = () => {
    if (score >= UNLOCK_THRESHOLDS.newsScroller) {
      setScore(prev => prev - UNLOCK_THRESHOLDS.newsScroller);
      setHasNewsScroller(true);
    }
  };
  
  // 购买雨声效果
  const purchaseRainEffect = () => {
    if (score >= UNLOCK_THRESHOLDS.rainEffect) {
      setScore(prev => prev - UNLOCK_THRESHOLDS.rainEffect);
      setHasRainEffect(true);
    }
  };
  
  // 购买雷雨特效
  const purchaseThunderstorm = () => {
    if (score >= UNLOCK_THRESHOLDS.thunderstorm) {
      setScore(prev => prev - UNLOCK_THRESHOLDS.thunderstorm);
      setHasThunderstorm(true);
    }
  };

  // 图标碰撞边界时增加积分
  const handleIconCollide = () => {
    // 使用setTimeout将状态更新推迟到下一个事件循环
    setTimeout(() => {
      setScore(prev => prev + 1);
      setTotalClicks(prev => prev + 1);
    }, 0);
  };

  // 铸造NFT
  const handleMintNFT = async (achievementId: number) => {
    try {
      await mintNFT({ args: [achievementId] });
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative bg-slate-50">
      {/* 背景特效组件 - 按照解锁顺序叠加显示 */}
      {gameStarted && (
        <>
          {/* 雨声效果 - 在整个背景上添加雨滴和雨声 */}
          {hasRainEffect && <RainEffect />}
          
          {/* 雷雨特效 - 在雨声效果的基础上添加闪电和雷声 */}
          {hasThunderstorm && <ThunderstormEffect />}
          
          {/* 移动图标 - 在整个页面上移动，仅当已购买时才显示 */}
          {movingIconCount > 0 && (
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
              <MovingIcon 
                onCollide={handleIconCollide} 
                iconCount={movingIconCount}
              />
            </div>
          )}
          
          {/* Lofi播放器 - 融入右下角 */}
          {hasLofiPlayer && <LofiPlayer />}
          
          {/* 新闻滚动 - 解锁后显示在页面顶部 */}
          {hasNewsScroller && (
            <div className="fixed top-16 left-0 right-0 z-20">
              <NewsScroller />
            </div>
          )}
        </>
      )}
      
      {/* 主要游戏内容 */}
      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <button 
            onClick={handleStartGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          >
            开始游戏 (1 STRK)
          </button>
          
          <div className="mt-8 max-w-2xl bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">游戏指南</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>点击"开始游戏"按钮需要支付1 STRK代币</li>
              <li>每次点击"Click Me!"按钮获得1积分</li>
              <li>积分达到特定门槛时会解锁购买选项：
                <ul className="list-circle pl-6 mt-1">
                  <li><strong>50分</strong>：移动图标 - 每次碰到浏览器边界增加1积分（可购买多个）</li>
                  <li><strong>150分</strong>：Lofi音乐 - 播放放松音乐</li>
                  <li><strong>300分</strong>：新闻滚动 - 显示最新StarkNet生态新闻</li>
                  <li><strong>500分</strong>：雨声ASMR - 享受放松的雨声</li>
                  <li><strong>800分</strong>：雷雨特效 - 带有闪电的雷雨氛围</li>
                </ul>
              </li>
              <li>达到特定积分会解锁成就：100, 500和1000分</li>
              <li>解锁成就后可以铸造NFT纪念</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto relative z-10">
          {/* 连接钱包状态 */}
          <div className="absolute top-4 right-4">
            <ConnectedAddress />
          </div>
          
          {/* 点击按钮和计分区域 */}
          <div className="text-center mb-12 mt-16">
            <button 
              onClick={handleClick}
              className="border border-gray-300 rounded-md py-3 px-10 text-xl mb-6 hover:bg-gray-100 transition bg-white"
            >
              Click me
            </button>
            
            <div className="text-5xl font-bold mb-1">{score} stimulation</div>
            <div className="text-xl text-gray-600">{clicksPerSecond} stimulation per second</div>
          </div>
          
          {/* 购买选项区域 - 小图标风格 */}
          <div className="flex justify-center flex-wrap gap-4 mt-8">
            {/* 移动图标购买选项 */}
            <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
              score >= UNLOCK_THRESHOLDS.movingIcon || unlockedFeatures.movingIcon ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
              {movingIconCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  {movingIconCount}
                </div>
              )}
              <button 
                onClick={purchaseMovingIcon}
                disabled={score < UNLOCK_THRESHOLDS.movingIcon && !unlockedFeatures.movingIcon}
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1">
                  <Image 
                    src="/sn-symbol-gradient.png" 
                    alt="StarkNet Symbol" 
                    width={40} 
                    height={40}
                  />
                </div>
                <span className="text-xs text-center">移动图标</span>
                <span className="text-xs text-gray-500">{UNLOCK_THRESHOLDS.movingIcon}分</span>
              </button>
            </div>
            
            {/* Lofi播放器购买选项 */}
            <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
              availableComponents.lofiPlayer ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
              {hasLofiPlayer && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button 
                onClick={purchaseLofiPlayer}
                disabled={!availableComponents.lofiPlayer || score < UNLOCK_THRESHOLDS.lofiPlayer || hasLofiPlayer}
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-600">
                    <path d="M9.297 15.75c-.35.31-.79.48-1.26.48s-.91-.17-1.26-.48c-.5-.44-.75-1.06-.75-1.95s.25-1.51.75-1.95c.35-.31.79-.48 1.26-.48s.91.17 1.26.48c.5.44.75 1.06.75 1.95S9.797 15.31 9.297 15.75zM6.75 8.265c-.5.44-.75 1.06-.75 1.95s.25 1.51.75 1.95c.35.31.79.48 1.26.48s.91-.17 1.26-.48c.5-.44.75-1.06.75-1.95s-.25-1.51-.75-1.95c-.35-.31-.79-.48-1.26-.48S7.1 7.955 6.75 8.265zM10.94 20.31c1.1.49 2.25.74 3.44.74c4.07 0 7.38-3.14 7.38-7 0-3.87-3.31-7-7.38-7s-7.38 3.13-7.38 7c0 2.12.99 4.03 2.53 5.31C10.16 24.54 15 23.35 15 23.35S10.84 19.77 10.94 20.31zM19.76 11.05c0 2.97-2.42 5.38-5.38 5.38s-5.38-2.41-5.38-5.38s2.42-5.38 5.38-5.38S19.76 8.08 19.76 11.05zM5.58 22.39c-.13.12-.28.18-.44.18c-.34 0-.62-.28-.62-.62V13.8h-.02c0-.14.06-.28.16-.37c.35-.32.64-.88.64-1.39s-.29-1.08-.64-1.39c-.1-.09-.16-.23-.16-.37V2.05c0-.34.28-.62.62-.62c.16 0 .31.06.44.18l3.31 3.31c.18.18.18.46 0 .64L5.58 8.84c-.18.18-.18.46 0 .64l3.29 3.29c.18.18.18.46 0 .64L5.58 16.7c-.18.18-.18.46 0 .64L8.87 20.63c.18.18.18.46 0 .64L5.58 22.39z"/>
                  </svg>
                </div>
                <span className="text-xs text-center">音乐播放</span>
                <span className="text-xs text-gray-500">{UNLOCK_THRESHOLDS.lofiPlayer}分</span>
              </button>
            </div>
            
            {/* 新闻滚动购买选项 */}
            <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
              availableComponents.newsScroller ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
              {hasNewsScroller && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button 
                onClick={purchaseNewsScroller}
                disabled={!availableComponents.newsScroller || score < UNLOCK_THRESHOLDS.newsScroller || hasNewsScroller}
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-center">新闻滚动</span>
                <span className="text-xs text-gray-500">{UNLOCK_THRESHOLDS.newsScroller}分</span>
              </button>
            </div>
            
            {/* 雨声效果购买选项 */}
            <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
              availableComponents.rainEffect ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
              {hasRainEffect && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button 
                onClick={purchaseRainEffect}
                disabled={!availableComponents.rainEffect || score < UNLOCK_THRESHOLDS.rainEffect || hasRainEffect}
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path d="M4.5 13.5C3.67 13.5 3 12.83 3 12s.67-1.5 1.5-1.5S6 11.17 6 12s-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    <path d="M19 4h-1V2h-2v2h-2V2h-2v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-4.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-4c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <span className="text-xs text-center">雨声效果</span>
                <span className="text-xs text-gray-500">{UNLOCK_THRESHOLDS.rainEffect}分</span>
              </button>
            </div>
            
            {/* 雷雨特效购买选项 */}
            <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
              availableComponents.thunderstorm ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
              {hasThunderstorm && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button 
                onClick={purchaseThunderstorm}
                disabled={!availableComponents.thunderstorm || score < UNLOCK_THRESHOLDS.thunderstorm || hasThunderstorm}
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-600">
                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-center">雷雨特效</span>
                <span className="text-xs text-gray-500">{UNLOCK_THRESHOLDS.thunderstorm}分</span>
              </button>
            </div>
          </div>
          
          {/* 解锁的成就区域 */}
          {unlockedAchievements.length > 0 && (
            <div className="mt-16 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">解锁的成就</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="border-2 border-gray-200 rounded-lg p-4 bg-white flex flex-col items-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <h3 className="font-semibold text-sm">{achievement.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                    <button
                      onClick={() => handleMintNFT(achievement.id)}
                      className="bg-purple-500 text-white px-3 py-1 text-sm rounded-md"
                    >
                      铸造NFT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 mb-4 text-sm text-gray-500 flex gap-4">
            <a href="#" className="hover:underline">Fork me</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      )}
      
      {/* 成就通知 */}
      {showNotification && currentAchievement && (
        <AchievementNotification 
          achievement={currentAchievement}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default BoringGame; 