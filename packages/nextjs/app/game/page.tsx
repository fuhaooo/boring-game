"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import {
  MovingIcon,
  LofiPlayer,
  NewsScroller,
  RainEffect,
  ThunderstormEffect,
  AchievementNotification,
  DragonBall,
  Toothless,
} from "~~/components/game";
import Image from "next/image";
import { notification } from "~~/utils/scaffold-stark";
import { Contract, cairo, RpcProvider } from "starknet";
import { useTransactor } from "~~/hooks/scaffold-stark/useTransactor";
import { universalErc20Abi } from "~~/utils/Constants";
import { useLanguage } from "~~/hooks/useLanguage";
import { useTheme } from "next-themes";

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
  thunderstorm: 800,
  dragonBall: 1000, // 添加龙珠解锁门槛
};

// 导入STRK代币常量
const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const APPROVE_SELECTOR =
  "0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c";

// 导入NFT预览图片地址
const NFT_IMAGE_URL =
  "https://blush-rainy-constrictor-734.mypinata.cloud/ipfs/bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru";

const BoringGame = () => {
  const { address } = useAccount();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
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
  const [isMovingIconUpgraded, setIsMovingIconUpgraded] = useState(false); // 是否已升级移动图标

  // STRK授权相关状态
  const [checkingAllowance, setCheckingAllowance] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalAmount, setApprovalAmount] = useState("5");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // NFT相关状态
  const [showNFTPreview, setShowNFTPreview] = useState(false);
  const [selectedNFTId, setSelectedNFTId] = useState<number | null>(null);

  // 龙珠相关状态
  const [dragonBalls, setDragonBalls] = useState<number[]>([]); // 已收集的龙珠
  const [showDragonBall, setShowDragonBall] = useState(false); // 是否显示龙珠
  const [currentDragonBall, setCurrentDragonBall] = useState(1); // 当前显示的龙珠编号
  const [dragonBallCost, setDragonBallCost] = useState(1000); // 龙珠基础价格
  const [showToothless, setShowToothless] = useState(false); // 是否显示Toothless
  const [isDragonBallUpgraded, setIsDragonBallUpgraded] = useState(false); // 是否已升级龙珠
  const [hasCompletedDragonBallQuest, setHasCompletedDragonBallQuest] =
    useState(false); // 是否已完成龙珠任务

  // 保存已解锁的组件状态
  const [unlockedFeatures, setUnlockedFeatures] = useState({
    movingIcon: false,
    lofiPlayer: false,
    newsScroller: false,
    rainEffect: false,
    thunderstorm: false,
    dragonBall: false, // 添加龙珠解锁状态
  });

  // 实时根据分数显示可用组件
  const availableComponents = {
    movingIcon:
      unlockedFeatures.movingIcon || score >= UNLOCK_THRESHOLDS.movingIcon,
    lofiPlayer:
      unlockedFeatures.lofiPlayer || score >= UNLOCK_THRESHOLDS.lofiPlayer,
    newsScroller:
      unlockedFeatures.newsScroller || score >= UNLOCK_THRESHOLDS.newsScroller,
    rainEffect:
      unlockedFeatures.rainEffect || score >= UNLOCK_THRESHOLDS.rainEffect,
    thunderstorm:
      unlockedFeatures.thunderstorm || score >= UNLOCK_THRESHOLDS.thunderstorm,
    dragonBall:
      unlockedFeatures.dragonBall || score >= UNLOCK_THRESHOLDS.dragonBall, // 添加龙珠可用状态
  };
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Achievement[]
  >([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);

  // 成就定义
  const ACHIEVEMENTS: Achievement[] = [
    {
      id: 4,
      name: t("I have seen a dragon"),
      description: t("Collect all 7 dragon balls"),
      requirement: 0,
    },
  ];

  // 合约交互
  // @ts-ignore
  const { sendAsync: startGameTx } = useScaffoldWriteContract({
    contractName: "BoringGame",
    functionName: "start_game",
    args: [],
  });

  // @ts-ignore
  const { sendAsync: recordScoreTx } = useScaffoldWriteContract({
    contractName: "BoringGame",
    functionName: "record_score",
    args: [BigInt(0)], // 占位符，实际值在调用时传入
  });

  // @ts-ignore
  const { sendAsync: mintNFTTx } = useScaffoldWriteContract({
    contractName: "BoringGame",
    functionName: "mint_achievement_nft",
    args: [0], // 占位符，实际值在调用时传入
  });

  // 获取transactor用于直接调用STRK代币合约
  const { writeTransaction } = useTransactor();

  // 检查STRK授权状态
  const checkAllowance = async () => {
    if (!address) return false;

    try {
      setCheckingAllowance(true);

      // 创建一个RPC提供者和合约对象用于读取allowance
      // 使用公共 RPC 节点而不是 Infura
      const provider = new RpcProvider({
        nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno",
      });
      const erc20Contract = new Contract(
        universalErc20Abi,
        STRK_ADDRESS,
        provider,
      );

      // 获取BoringGame合约地址
      const boringGameAddress =
        "0x3e4aa5993cc45e05bd5ffa6789d883e1632e4a5df73caec16d8e4010c517719";

      // 调用allowance函数检查授权金额
      const result = await erc20Contract.call("allowance", [
        address,
        boringGameAddress,
      ]);
      const allowance = result.toString();

      // 需要授权的最小金额(1 STRK + 一些额外空间)
      const minAllowance = BigInt("2000000000000000000"); // 2 STRK

      // 检查授权金额是否足够
      const hasEnoughAllowance = BigInt(allowance) >= minAllowance;

      setNeedsApproval(!hasEnoughAllowance);
      setCheckingAllowance(false);

      return hasEnoughAllowance;
    } catch (error) {
      console.error("Failed to check allowance:", error);
      setCheckingAllowance(false);
      // 如果错误，假设已经授权 - 因为用户表示已经授权完毕
      setNeedsApproval(false);
      return true;
    }
  };

  // 授权STRK代币
  const approveSTRK = async () => {
    if (!address) {
      notification.error("Please connect your wallet first");
      return false;
    }

    try {
      // 获取BoringGame合约地址
      const spender =
        "0x3e4aa5993cc45e05bd5ffa6789d883e1632e4a5df73caec16d8e4010c517719";

      // 将用户输入的金额转换为实际金额（包含18位小数）
      const amount = BigInt(parseFloat(approvalAmount) * 10 ** 18);

      // 构建approve交易
      const approveTx = [
        {
          contractAddress: STRK_ADDRESS,
          entrypoint: "approve",
          calldata: [spender, amount.toString(), "0"],
        },
      ];

      notification.info(
        "Please confirm the authorization transaction in your wallet",
      );

      // 执行授权交易
      const result = await writeTransaction(approveTx);

      if (result) {
        notification.success("Authorization successful!");
        setNeedsApproval(false);
        setShowApprovalModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Authorization failed:", error);
      notification.error("Authorization failed, please try again later");
      return false;
    }
  };

  // 开始游戏
  const startGame = async () => {
    try {
      if (!address) {
        notification.error("Please connect your wallet first");
        return false;
      }

      // 直接跳过授权检查，用户表示已经完成授权
      // const hasAllowance = await checkAllowance();
      const hasAllowance = true;

      if (!hasAllowance) {
        // 显示授权弹窗
        setShowApprovalModal(true);
        return false;
      }

      // 提示用户将支付1 STRK
      notification.info(
        "Initiating transaction, you will pay 1 STRK to start the game",
      );

      const result = await startGameTx();

      if (result) {
        notification.success("Game started! Transaction submitted");
        setShowApprovalModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to start game:", error);
      notification.error(
        "Failed to start game, please ensure your wallet has authorized STRK tokens",
      );
      return false;
    }
  };

  // 记录分数
  const recordScore = useCallback(
    async (args: { args: [number] }) => {
      try {
        if (!address) {
          console.error("Wallet not connected");
          return false;
        }

        // 创建一个正确类型的参数对象
        const callArgs = {
          args: [BigInt(args.args[0])],
        };

        // 使用类型断言解决TypeScript错误
        await recordScoreTx(callArgs as any);

        return true;
      } catch (error) {
        console.error("Failed to record score:", error);
        return false;
      }
    },
    [address, recordScoreTx],
  );

  // 铸造NFT
  const mintNFT = async (args: { args: [number] }) => {
    try {
      if (!address) {
        notification.error("Please connect your wallet first");
        return false;
      }

      notification.info("Minting NFT, please confirm the transaction");

      // 使用类型断言解决TypeScript错误
      const result = await mintNFTTx(args as any);

      if (result) {
        notification.success("NFT minted successfully! Transaction submitted");
        setShowNFTPreview(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      notification.error("Failed to mint NFT, please try again later");
      return false;
    }
  };

  // 处理NFT铸造点击事件，显示NFT预览
  const handleMintNFT = async (achievementId: number) => {
    try {
      // 先显示NFT预览
      setSelectedNFTId(achievementId);
      setShowNFTPreview(true);
    } catch (error) {
      console.error("Error showing NFT preview:", error);
    }
  };

  // STRK授权弹窗组件
  const ApprovalModal = () => {
    if (!showApprovalModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
          <h3 className="text-xl font-bold mb-4">
            {t("STRK Token Authorization Required")}
          </h3>
          <p className="mb-4">
            {t(
              "To start the game, you need to authorize the contract to use your STRK tokens.",
            )}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Authorize Amount:")} ({t("STRK")})
            </label>
            <input
              type="number"
              value={approvalAmount}
              onChange={(e) => setApprovalAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              step="1"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowApprovalModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={approveSTRK}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={checkingAllowance}
            >
              {checkingAllowance ? t("Authorizing...") : t("Authorize")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // NFT预览弹窗组件
  const NFTPreviewModal = () => {
    if (!showNFTPreview || selectedNFTId === null) return null;

    const achievement = ACHIEVEMENTS.find((a) => a.id === selectedNFTId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-w-full">
          <h3 className="text-xl font-bold mb-4">
            {t("Achievement NFT Preview")}: {achievement?.name}
          </h3>

          <div className="flex flex-col items-center mb-4">
            <div className="w-80 h-64 overflow-hidden rounded-lg shadow-md mb-4">
              <Image
                src={NFT_IMAGE_URL}
                alt={achievement?.name || t("NFT Preview")}
                width={320}
                height={256}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">{achievement?.description}</p>
          </div>

          <div className="text-sm mb-4">
            <p>
              {t(
                "This is a preview of the NFT you will receive for this achievement.",
              )}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowNFTPreview(false)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={() => mintNFT({ args: [selectedNFTId as number] })}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {t("Mint NFT")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 定期保存分数
  useEffect(() => {
    if (gameStarted && score > 0) {
      const interval = setInterval(() => {
        recordScore({ args: [score] }).catch((err) =>
          console.error("Error recording score:", err),
        );
      }, 30000); // 每30秒记录一次

      return () => clearInterval(interval);
    }
  }, [gameStarted, score, recordScore]);

  // 计算每秒点击率
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = (now - lastClickTime) / 1000;
        if (elapsedSeconds > 0) {
          setClicksPerSecond(
            Math.round((totalClicks / elapsedSeconds) * 10) / 10,
          );
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
    // 只在分数改变时检查一次，避免不必要的状态更新
    const newUnlockedFeatures = {
      movingIcon:
        unlockedFeatures.movingIcon || score >= UNLOCK_THRESHOLDS.movingIcon,
      lofiPlayer:
        unlockedFeatures.lofiPlayer || score >= UNLOCK_THRESHOLDS.lofiPlayer,
      newsScroller:
        unlockedFeatures.newsScroller ||
        score >= UNLOCK_THRESHOLDS.newsScroller,
      rainEffect:
        unlockedFeatures.rainEffect || score >= UNLOCK_THRESHOLDS.rainEffect,
      thunderstorm:
        unlockedFeatures.thunderstorm ||
        score >= UNLOCK_THRESHOLDS.thunderstorm,
      dragonBall:
        unlockedFeatures.dragonBall || score >= UNLOCK_THRESHOLDS.dragonBall,
    };

    // 只有当真正有变化时才更新状态
    if (
      JSON.stringify(newUnlockedFeatures) !== JSON.stringify(unlockedFeatures)
    ) {
      setUnlockedFeatures(newUnlockedFeatures);
    }

    // 由于已移除基于分数的成就，不再需要这部分逻辑
    // 龙珠成就(4)在集齐七颗龙珠的效果里处理
  }, [score, unlockedFeatures]);

  // 图标碰撞边界时增加积分
  const handleIconCollide = (points?: number) => {
    // 限制更新频率，避免过快触发状态更新
    if (Date.now() - lastClickTime > 100) {
      // 至少间隔100ms
      setLastClickTime(Date.now());
      setScore((prev) => prev + (points || 1)); // 如果没有提供points，默认为1
      setTotalClicks((prev) => prev + (points || 1));
    }
  };

  // 龙珠碰撞边界增加积分
  const handleDragonBallCollide = (points?: number) => {
    // 每次碰撞增加100积分
    setScore((prev) => prev + 100);
    setTotalClicks((prev) => prev + 100);
  };

  // 检查是否集齐七颗龙珠并触发无牙出现
  useEffect(() => {
    // 当龙珠数量变化时检查，确保只在达到7颗时执行一次
    if (
      dragonBalls.length === 7 &&
      !showToothless &&
      !hasCompletedDragonBallQuest
    ) {
      console.log("Collected all seven dragon balls, starting summoning!");

      // 龙珠闪光动画，然后消失，最后出现无牙
      setTimeout(() => {
        // 清空龙珠列表，使所有龙珠消失
        setDragonBalls([]);

        // 龙珠消失后短暂延迟，然后显示无牙
        setTimeout(() => {
          console.log("Toothless has appeared!");
          // 显示Toothless
          setShowToothless(true);
          // 标记已完成龙珠任务
          setHasCompletedDragonBallQuest(true);

          // 解锁"我见过龙"成就 - 避免重复添加
          const hasSeenDragonAchievement = unlockedAchievements.some(
            (a) => a.id === 4,
          );
          if (!hasSeenDragonAchievement) {
            const dragonAchievement = ACHIEVEMENTS.find((a) => a.id === 4);
            if (dragonAchievement) {
              // 单独添加这个成就，避免与其他成就混合
              setUnlockedAchievements((prev) => [...prev, dragonAchievement]);
              setCurrentAchievement(dragonAchievement);
              setShowNotification(true);

              // 自动关闭通知
              setTimeout(() => {
                setShowNotification(false);
              }, 5000);
            }
          }
        }, 1000); // 1秒后显示无牙
      }, 2000); // 2秒后龙珠消失
    }
  }, [
    dragonBalls.length,
    showToothless,
    unlockedAchievements,
    hasCompletedDragonBallQuest,
  ]);

  // 升级龙珠
  const upgradeDragonBall = () => {
    // 只有当已经完成龙珠任务且尚未升级时才可以升级
    if (!hasCompletedDragonBallQuest || isDragonBallUpgraded) return;

    // 升级费用
    const upgradeCost = 5000;

    if (score >= upgradeCost) {
      setScore((prev) => prev - upgradeCost);
      setIsDragonBallUpgraded(true);
      // 升级后，龙珠基础价格变为5000
      setDragonBallCost(5000);
    }
  };

  // 购买龙珠
  const purchaseDragonBall = () => {
    // 如果已经有7颗龙珠，不能再购买
    if (dragonBalls.length >= 7) return;

    // 计算当前要购买的龙珠编号
    const nextBallNumber = dragonBalls.length + 1;

    // 计算价格，根据是否升级和已有龙珠数量决定
    let currentCost;
    if (!isDragonBallUpgraded) {
      // 未升级：基础价格1000，每颗增加500
      currentCost = dragonBallCost + dragonBalls.length * 500;
    } else {
      // 已升级：基础价格5000，每颗翻倍
      currentCost = dragonBallCost * Math.pow(2, dragonBalls.length);
    }

    // 检查分数是否足够
    if (score >= currentCost) {
      // 扣除分数
      setScore((prev) => prev - currentCost);

      // 添加到已收集列表
      setDragonBalls((prev) => [...prev, nextBallNumber]);

      // 如果是第一次购买，同时解锁该功能
      if (!unlockedFeatures.dragonBall) {
        setUnlockedFeatures((prev) => ({
          ...prev,
          dragonBall: true,
        }));
      }
    }
  };

  // 开始游戏处理
  const handleStartGame = async () => {
    try {
      const success = await startGame();
      if (success) {
        setGameStarted(true);
        setLastClickTime(Date.now());
      }
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  // 点击按钮增加分数
  const handleClick = () => {
    if (gameStarted) {
      setScore((prev) => prev + 1);
      setTotalClicks((prev) => prev + 1);
    }
  };

  // 购买移动图标
  const purchaseMovingIcon = () => {
    if (score >= UNLOCK_THRESHOLDS.movingIcon) {
      // 限制最多只能添加10个图标
      if (movingIconCount >= 10) {
        return;
      }

      setScore((prev) => prev - UNLOCK_THRESHOLDS.movingIcon);
      setMovingIconCount((prev) => prev + 1);

      // 如果是第一次购买，同时解锁该功能
      if (!unlockedFeatures.movingIcon) {
        setUnlockedFeatures((prev) => ({
          ...prev,
          movingIcon: true,
        }));
      }
    }
  };

  // 升级移动图标
  const upgradeMovingIcon = () => {
    // 只有当已经有10个图标时才可以升级
    if (movingIconCount < 10 || isMovingIconUpgraded) return;

    // 升级费用，设置较高的价格
    const upgradeCost = 2000;

    if (score >= upgradeCost) {
      setScore((prev) => prev - upgradeCost);
      setIsMovingIconUpgraded(true);
    }
  };

  // 购买Lofi播放器
  const purchaseLofiPlayer = () => {
    if (score >= UNLOCK_THRESHOLDS.lofiPlayer) {
      setScore((prev) => prev - UNLOCK_THRESHOLDS.lofiPlayer);
      setHasLofiPlayer(true);
    }
  };

  // 购买新闻滚动
  const purchaseNewsScroller = () => {
    if (score >= UNLOCK_THRESHOLDS.newsScroller) {
      setScore((prev) => prev - UNLOCK_THRESHOLDS.newsScroller);
      setHasNewsScroller(true);
    }
  };

  // 购买雨声效果
  const purchaseRainEffect = () => {
    if (score >= UNLOCK_THRESHOLDS.rainEffect) {
      setScore((prev) => prev - UNLOCK_THRESHOLDS.rainEffect);
      setHasRainEffect(true);
    }
  };

  // 购买雷雨特效
  const purchaseThunderstorm = () => {
    if (score >= UNLOCK_THRESHOLDS.thunderstorm) {
      setScore((prev) => prev - UNLOCK_THRESHOLDS.thunderstorm);
      setHasThunderstorm(true);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 relative ${isDarkMode ? 'bg-base-100' : 'bg-slate-50'}`}>
      {/* STRK授权弹窗 */}
      <ApprovalModal />

      {/* NFT预览弹窗 */}
      <NFTPreviewModal />

      {/* 背景特效组件 - 按照解锁顺序叠加显示 */}
      {gameStarted && (
        <>
          {/* 雨声效果 - 在整个背景上添加雨滴和雨声 */}
          {hasRainEffect && <RainEffect />}

          {/* 雷雨特效 - 在雨声效果的基础上添加闪电和雷声 */}
          {hasThunderstorm && <ThunderstormEffect />}

          {/* 移动图标 - 在整个页面上移动，仅当已购买时才显示 */}
          {movingIconCount > 0 && (
            <MovingIcon
              onCollide={handleIconCollide}
              iconCount={movingIconCount}
              isUpgraded={isMovingIconUpgraded}
            />
          )}

          {/* 龙珠 - 在整个页面上移动，每颗龙珠单独显示 */}
          {dragonBalls.map((ballNumber) => (
            <DragonBall
              key={ballNumber}
              ballNumber={ballNumber}
              onCollide={handleDragonBallCollide}
              isUpgraded={isDragonBallUpgraded}
            />
          ))}

          {/* Lofi播放器 - 融入右下角 */}
          {hasLofiPlayer && <LofiPlayer />}

          {/* 新闻滚动 - 解锁后显示在页面顶部 */}
          {hasNewsScroller && (
            <div className="fixed top-16 left-0 right-0 z-20">
              <NewsScroller />
            </div>
          )}

          {/* Toothless - 集齐七龙珠后显示在左下角 */}
          {showToothless && (
            <div className="fixed bottom-20 left-20 z-40">
              <Toothless />
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
            {t("Start Game")} (1 STRK)
          </button>

          <div className={`mt-8 max-w-2xl p-6 rounded-lg shadow ${isDarkMode ? 'bg-base-200 text-base-content' : 'bg-white text-gray-900'}`}>
            <h3 className="text-xl font-semibold mb-3">{t("Game Guide")}</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('Click "Start Game" button requires 1 STRK token')}</li>
              <li>{t('Each click on "Click Me!" button earns 1 point')}</li>
              <li>
                {t("Reaching specific thresholds unlocks purchase options:")}
                <ul className="list-circle pl-6 mt-1">
                  <li>
                    {t(
                      "50 points: Moving Icon - Gain 1 point each time it hits browser boundary (max 10)",
                    )}
                  </li>
                  <li>
                    {t(
                      "After buying 10 icons, spend 2000 points to upgrade, upgraded icons give 5 points per collision with sound",
                    )}
                  </li>
                  <li>{t("150 points: Lofi Music - Play relaxing music")}</li>
                  <li>
                    {t(
                      "300 points: News Scroll - Display latest StarkNet ecosystem news",
                    )}
                  </li>
                  <li>
                    {t("500 points: Rain ASMR - Enjoy relaxing rain sounds")}
                  </li>
                  <li>
                    {t(
                      "800 points: Thunderstorm Effects - Lightning thunderstorm atmosphere",
                    )}
                  </li>
                </ul>
              </li>
              <li>
                {t("Collect seven dragon balls:")}
                <ul className="list-circle pl-6 mt-1">
                  <li>
                    {t(
                      "Each dragon ball requires purchase, first one costs 1000 points, each subsequent one costs 500 more",
                    )}
                  </li>
                  <li>
                    {t(
                      "Dragon balls move around screen, gaining 100 points each boundary hit",
                    )}
                  </li>
                  <li>
                    {t(
                      "Collect all seven to summon Toothless dancing in bottom left!",
                    )}
                  </li>
                  <li>
                    {t(
                      "After summoning Toothless, spend 5000 points to upgrade dragon balls with sound effects",
                    )}
                  </li>
                  <li>
                    {t(
                      "After upgrade, new dragon ball prices start at 5000 points and double each purchase",
                    )}
                  </li>
                </ul>
              </li>
              <li>
                {t(
                  "Unlock achievements at specific points: 100, 500 and 1000 points",
                )}
              </li>
              <li>
                {t(
                  "After unlocking achievements, you can mint commemorative NFTs",
                )}
              </li>
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
              className={`border rounded-md py-3 px-10 text-xl mb-6 transition ${
                isDarkMode 
                  ? 'border-gray-600 bg-base-200 text-base-content hover:bg-base-300' 
                  : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {t("Click Me")}
            </button>

            <div className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>
              {score} {t("stimulation")}
            </div>
            <div className={`text-xl ${isDarkMode ? 'text-base-content opacity-80' : 'text-gray-600'}`}>
              {clicksPerSecond} {t("stimulation per second")}
            </div>
          </div>

          {/* 购买选项区域 - 小图标风格 */}
          <div className="flex justify-center flex-wrap gap-4 mt-8">
            {/* 移动图标购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                score >= UNLOCK_THRESHOLDS.movingIcon ||
                unlockedFeatures.movingIcon
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              } ${isMovingIconUpgraded ? "border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50" : ""}`}
            >
              {movingIconCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  {movingIconCount}
                </div>
              )}
              <button
                onClick={
                  movingIconCount < 10 ? purchaseMovingIcon : upgradeMovingIcon
                }
                disabled={
                  (movingIconCount < 10 &&
                    score < UNLOCK_THRESHOLDS.movingIcon) ||
                  (movingIconCount >= 10 &&
                    (score < 2000 || isMovingIconUpgraded))
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 
                               ${isMovingIconUpgraded ? "bg-gradient-to-r from-purple-500 to-pink-500 p-1" : ""}`}
                >
                  <Image
                    src="/sn-symbol-gradient.png"
                    alt="StarkNet Symbol"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>
                  {movingIconCount < 10
                    ? t("Moving Icon")
                    : isMovingIconUpgraded
                      ? t("Upgraded")
                      : t("Upgrade Icon")}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {movingIconCount < 10
                    ? `${UNLOCK_THRESHOLDS.movingIcon}${t("points")}`
                    : isMovingIconUpgraded
                      ? t("+5 points/hit")
                      : `2000${t("points")}`}
                </span>
              </button>
            </div>

            {/* Lofi播放器购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                availableComponents.lofiPlayer
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              {hasLofiPlayer && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button
                onClick={purchaseLofiPlayer}
                disabled={
                  !availableComponents.lofiPlayer ||
                  score < UNLOCK_THRESHOLDS.lofiPlayer ||
                  hasLofiPlayer
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-indigo-600"
                  >
                    <path d="M9.297 15.75c-.35.31-.79.48-1.26.48s-.91-.17-1.26-.48c-.5-.44-.75-1.06-.75-1.95s.25-1.51.75-1.95c.35-.31.79-.48 1.26-.48s.91.17 1.26.48c.5.44.75 1.06.75 1.95S9.797 15.31 9.297 15.75zM6.75 8.265c-.5.44-.75 1.06-.75 1.95s.25 1.51.75 1.95c.35.31.79.48 1.26.48s.91-.17 1.26-.48c.5-.44.75-1.06.75-1.95s-.25-1.51-.75-1.95c-.35-.31-.79-.48-1.26-.48S7.1 7.955 6.75 8.265zM10.94 20.31c1.1.49 2.25.74 3.44.74c4.07 0 7.38-3.14 7.38-7 0-3.87-3.31-7-7.38-7s-7.38 3.13-7.38 7c0 2.12.99 4.03 2.53 5.31C10.16 24.54 15 23.35 15 23.35S10.84 19.77 10.94 20.31zM19.76 11.05c0 2.97-2.42 5.38-5.38 5.38s-5.38-2.41-5.38-5.38s2.42-5.38 5.38-5.38S19.76 8.08 19.76 11.05zM5.58 22.39c-.13.12-.28.18-.44.18c-.34 0-.62-.28-.62V13.8h-.02c0-.14.06-.28.16-.37c.35-.32.64-.88.64-1.39s-.29-1.08-.64-1.39c-.1-.09-.16-.23-.16-.37V2.05c0-.34.28-.62.62-.62c.16 0 .31.06.44.18l3.31 3.31c.18.18.18.46 0 .64L5.58 8.84c-.18.18-.18.46 0 .64l3.29 3.29c.18.18.18.46 0 .64L5.58 16.7c-.18.18-.18.46 0 .64L8.87 20.63c.18.18.18.46 0 .64L5.58 22.39z" />
                  </svg>
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("Music Player")}</span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {UNLOCK_THRESHOLDS.lofiPlayer}
                  {t("points")}
                </span>
              </button>
            </div>

            {/* 新闻滚动购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                availableComponents.newsScroller
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              {hasNewsScroller && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button
                onClick={purchaseNewsScroller}
                disabled={
                  !availableComponents.newsScroller ||
                  score < UNLOCK_THRESHOLDS.newsScroller ||
                  hasNewsScroller
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("News Scroll")}</span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {UNLOCK_THRESHOLDS.newsScroller}
                  {t("points")}
                </span>
              </button>
            </div>

            {/* 雨声效果购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                availableComponents.rainEffect
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              {hasRainEffect && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button
                onClick={purchaseRainEffect}
                disabled={
                  !availableComponents.rainEffect ||
                  score < UNLOCK_THRESHOLDS.rainEffect ||
                  hasRainEffect
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path d="M4.5 13.5C3.67 13.5 3 12.83 3 12s.67-1.5 1.5-1.5S6 11.17 6 12s-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    <path d="M19 4h-1V2h-2v2h-2V2h-2v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-4.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-4c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("Rain ASMR")}</span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {UNLOCK_THRESHOLDS.rainEffect}
                  {t("points")}
                </span>
              </button>
            </div>

            {/* 雷雨特效购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                availableComponents.thunderstorm
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              {hasThunderstorm && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  1
                </div>
              )}
              <button
                onClick={purchaseThunderstorm}
                disabled={
                  !availableComponents.thunderstorm ||
                  score < UNLOCK_THRESHOLDS.thunderstorm ||
                  hasThunderstorm
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("Thunderstorm")}</span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {UNLOCK_THRESHOLDS.thunderstorm}
                  {t("points")}
                </span>
              </button>
            </div>

            {/* 龙珠购买选项 */}
            <div
              className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 ${
                availableComponents.dragonBall
                  ? isDarkMode 
                    ? "border-gray-600 bg-base-200" 
                    : "border-gray-200 bg-white"
                  : isDarkMode
                    ? "border-gray-700 bg-base-300 opacity-60"
                    : "border-gray-200 bg-gray-50 opacity-60"
              } ${isDragonBallUpgraded ? "border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50" : ""}`}
            >
              {dragonBalls.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  {dragonBalls.length}
                </div>
              )}
              <button
                onClick={purchaseDragonBall}
                disabled={
                  !availableComponents.dragonBall ||
                  score <
                    (isDragonBallUpgraded
                      ? dragonBallCost * Math.pow(2, dragonBalls.length)
                      : dragonBallCost + dragonBalls.length * 500) ||
                  dragonBalls.length >= 7
                }
                className="w-full h-full flex flex-col items-center justify-center p-2"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 
                               ${isDragonBallUpgraded ? "bg-gradient-to-r from-orange-400 to-yellow-300 p-1" : "bg-orange-100"}`}
                >
                  <Image
                    src="/dragon-ball/1.png"
                    alt={t("Dragon Ball")}
                    width={isDragonBallUpgraded ? 28 : 32}
                    height={isDragonBallUpgraded ? 28 : 32}
                    className="object-contain"
                  />
                </div>
                <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("Dragon Ball")}</span>
                <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                  {dragonBalls.length < 7
                    ? `${
                        isDragonBallUpgraded
                          ? dragonBallCost * Math.pow(2, dragonBalls.length)
                          : dragonBallCost + dragonBalls.length * 500
                      }${t("points")}`
                    : t("Full")}
                </span>
              </button>
            </div>

            {/* 龙珠升级选项 - 只在完成龙珠任务后显示 */}
            {hasCompletedDragonBallQuest && !isDragonBallUpgraded && (
              <div className={`relative rounded-lg overflow-hidden w-24 h-24 border-2 border-orange-300 ${isDarkMode ? 'bg-base-200' : 'bg-white'}`}>
                <button
                  onClick={upgradeDragonBall}
                  disabled={score < 5000}
                  className="w-full h-full flex flex-col items-center justify-center p-2"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-orange-600"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  </div>
                  <span className={`text-xs text-center ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>
                    {t("Upgrade Dragon Balls (5000 points)").split("(")[0]}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-base-content opacity-60' : 'text-gray-500'}`}>
                    5000{t("points")}
                  </span>
                </button>
              </div>
            )}

            {/* 龙珠已升级显示 */}
            {isDragonBallUpgraded && (
              <div className="relative rounded-lg overflow-hidden w-24 h-24 border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10">
                  ✓
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full mb-1 p-1">
                    <Image
                      src="/dragon-ball/7.png"
                      alt={t("Upgraded")}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className={`text-xs text-center ${isDarkMode ? 'text-gray-900' : 'text-gray-900'}`}>{t("Upgraded")}</span>
                  <span className="text-xs text-green-500">
                    {t("Sound Effect")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 解锁的成就区域 */}
          {unlockedAchievements.length > 0 && (
            <div className="mt-16 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>
                  {t("Unlocked Achievements")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`border-2 rounded-lg p-4 flex flex-col items-center ${
                      isDarkMode 
                        ? 'border-gray-600 bg-base-200 text-base-content' 
                        : 'border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {achievement.id === 4 ? "🐉" : "🏆"}
                    </div>
                    <h3 className="font-semibold text-sm">
                      {achievement.name}
                    </h3>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-base-content opacity-80' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    <button
                      onClick={() => handleMintNFT(achievement.id)}
                      className="bg-purple-500 text-white px-3 py-1 text-sm rounded-md"
                    >
                      {t("Mint NFT")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 龙珠收集进度 */}
          {dragonBalls.length > 0 && (
            <div className="mt-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-base-content' : 'text-gray-900'}`}>{t("Dragon Ball Count")}</h2>
                <span className={`text-sm ${isDarkMode ? 'text-base-content opacity-80' : 'text-gray-600'}`}>
                  {dragonBalls.length}/7
                </span>
              </div>
              <div className={`flex gap-2 p-3 rounded-lg justify-center ${isDarkMode ? 'bg-base-300' : 'bg-gray-100'}`}>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((ball) => {
                  const collected = dragonBalls.includes(ball);
                  const ballColors: { [key: number]: string } = {
                    1: "bg-red-500",
                    2: "bg-orange-500",
                    3: "bg-yellow-500",
                    4: "bg-green-500",
                    5: "bg-blue-500",
                    6: "bg-indigo-500",
                    7: "bg-purple-500",
                  };

                  return (
                    <div
                      key={ball}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        collected ? ballColors[ball] : isDarkMode ? "bg-gray-600" : "bg-gray-300"
                      } ${collected ? "animate-pulse" : ""}`}
                    >
                      <span
                        className={`font-bold text-sm ${collected ? "text-white" : isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                      >
                        {ball}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
