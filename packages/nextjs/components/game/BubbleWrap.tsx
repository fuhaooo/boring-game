import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "~~/hooks/useLanguage";

interface BubbleWrapProps {
  onLevelComplete: (level: number) => void;
  onAllLevelsComplete: () => void;
}

const BubbleWrap: React.FC<BubbleWrapProps> = ({
  onLevelComplete,
  onAllLevelsComplete,
}) => {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [bubbles, setBubbles] = useState<
    { id: number; isPopped: boolean; isUnpopping: boolean }[]
  >([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // 挑战模式状态
  const [challengeMode, setChallengeMode] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 当前计时

  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const unpopSoundRef = useRef<HTMLAudioElement | null>(null);
  const levelUpSoundRef = useRef<HTMLAudioElement | null>(null);
  const unpopTimersRef = useRef<NodeJS.Timeout[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 音效初始化
  useEffect(() => {
    if (typeof window !== "undefined") {
      popSoundRef.current = new Audio("/bubble/bubble-wrap-single-pop.mp3");
      unpopSoundRef.current = new Audio("/bubble/bubble-wrap-single-unpop.mp3");
      levelUpSoundRef.current = new Audio("/bubble/level-up.mp3");

      if (popSoundRef.current) popSoundRef.current.volume = 0.5;
      if (unpopSoundRef.current) unpopSoundRef.current.volume = 0.3;
      if (levelUpSoundRef.current) levelUpSoundRef.current.volume = 0.15;
    }
  }, []);

  // 挑战模式计时器
  useEffect(() => {
    // 清理上一个计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 如果是挑战模式且游戏已开始但未完成，开始计时
    if (challengeMode && gameStarted && !challengeCompleted) {
      setCurrentTime(0);
      const startTimeStamp = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeStamp;
        setCurrentTime(elapsed);
      }, 100); // 每100毫秒更新一次，使显示更流畅
    }

    // 组件卸载或条件变化时清理
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [challengeMode, gameStarted, challengeCompleted]);

  // 清理定时器
  const clearUnpopTimers = () => {
    unpopTimersRef.current.forEach((timer) => clearTimeout(timer));
    unpopTimersRef.current = [];
  };

  // 获取级别配置
  const getLevelConfig = (level: number) => {
    const configs = [
      { bubbleCount: 15 }, // 级别1 - 极低难度
      { bubbleCount: 14 }, // 级别2
      { bubbleCount: 13 }, // 级别3 - 适中难度
      { bubbleCount: 11 }, // 级别4
      { bubbleCount: 10 }, // 级别5 - 极高难度
    ];
    return configs[level - 1] || configs[0];
  };

  // 初始化级别
  const initializeLevel = (level: number) => {
    const config = getLevelConfig(level);
    const newBubbles = Array.from({ length: config.bubbleCount }, (_, i) => ({
      id: i,
      isPopped: false,
      isUnpopping: false,
    }));

    setBubbles(newBubbles);
    setGameStarted(true);
    setShowLevelComplete(false);
    clearUnpopTimers();
  };

  // 初始化挑战模式
  const initializeChallenge = () => {
    // 挑战模式使用21个气泡
    const newBubbles = Array.from({ length: 21 }, (_, i) => ({
      id: i,
      isPopped: false,
      isUnpopping: false,
    }));

    setBubbles(newBubbles);
    setGameStarted(true);
    setChallengeMode(true);
    setShowLevelComplete(false);
    setChallengeCompleted(false);
    // 记录开始时间
    setStartTime(Date.now());
    clearUnpopTimers();
  };

  // 点击气泡
  const popBubble = (bubbleId: number) => {
    console.log("气泡点击:", bubbleId);

    setBubbles((prev) => {
      const newBubbles = [...prev];
      const bubble = newBubbles.find((b) => b.id === bubbleId);

      if (!bubble || bubble.isPopped) return prev;

      bubble.isPopped = true;
      bubble.isUnpopping = false;

      return newBubbles;
    });

    // 播放爆泡音效
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // 检查是否完成级别
    setTimeout(() => {
      const allPopped = bubbles.every((b) => b.id === bubbleId || b.isPopped);
      if (allPopped) {
        if (challengeMode) {
          completeChallenge();
        } else {
          completeLevel();
        }
      } else if (!challengeMode) {
        // 只在非挑战模式下恢复气泡
        // 设置 unpop 定时器
        const unpopDelay = Math.max(
          100,
          (bubbles.length * 1000) / currentLevel,
        );

        const timer = setTimeout(() => {
          setBubbles((prev) => {
            const poppedBubbles = prev.filter(
              (b) => b.isPopped && b.id !== bubbleId,
            );

            if (poppedBubbles.length === 0) return prev;

            const randomIndex = Math.floor(
              Math.random() * poppedBubbles.length,
            );
            const randomBubble = poppedBubbles[randomIndex];

            const newBubbles = prev.map((b) =>
              b.id === randomBubble.id
                ? { ...b, isPopped: false, isUnpopping: true }
                : b,
            );

            // 播放 unpop 音效
            if (unpopSoundRef.current) {
              unpopSoundRef.current.currentTime = 0;
              unpopSoundRef.current
                .play()
                .catch((e) => console.log("Audio play failed:", e));
            }

            // 移除 unpopping 状态
            setTimeout(() => {
              setBubbles((prev) =>
                prev.map((b) =>
                  b.id === randomBubble.id ? { ...b, isUnpopping: false } : b,
                ),
              );
            }, 400);

            return newBubbles;
          });

          // 移除这个定时器
          unpopTimersRef.current = unpopTimersRef.current.filter(
            (t) => t !== timer,
          );
        }, unpopDelay);

        unpopTimersRef.current.push(timer);
      }
    }, 300);
  };

  // 完成级别
  const completeLevel = () => {
    setGameStarted(false);
    setShowLevelComplete(true);
    clearUnpopTimers();

    // 播放升级音效
    if (levelUpSoundRef.current) {
      levelUpSoundRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // 添加到已完成级别
    if (!completedLevels.includes(currentLevel)) {
      const newCompletedLevels = [...completedLevels, currentLevel];
      setCompletedLevels(newCompletedLevels);
      onLevelComplete(currentLevel);

      // 检查是否完成所有级别
      if (newCompletedLevels.length === 5) {
        setTimeout(() => {
          onAllLevelsComplete();
        }, 2000);
      }
    }
  };

  // 完成挑战模式
  const completeChallenge = () => {
    setGameStarted(false);
    setChallengeCompleted(true);
    // 记录结束时间
    setEndTime(Date.now());
    clearUnpopTimers();

    // 播放升级音效
    if (levelUpSoundRef.current) {
      levelUpSoundRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  // 开始游戏
  const startGame = () => {
    initializeLevel(currentLevel);
  };

  // 开始挑战模式
  const startChallenge = () => {
    initializeChallenge();
  };

  // 重置当前级别
  const resetLevel = () => {
    if (challengeMode) {
      initializeChallenge();
    } else {
      initializeLevel(currentLevel);
    }
  };

  // 下一级别
  const nextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel((prev) => prev + 1);
      setTimeout(() => {
        initializeLevel(currentLevel + 1);
      }, 500);
    }
  };

  // 退出挑战模式
  const exitChallenge = () => {
    setChallengeMode(false);
    setShowLevelComplete(false);
    setChallengeCompleted(false);
  };

  // 格式化时间为秒和毫秒
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, "0")}${t("seconds")}`;
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* 游戏控制面板 - 调整位置 */}
      <div className="absolute top-20 left-5 pointer-events-auto">
        <div className="bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-xs border-2 border-white shadow-xl">
          <h3 className="text-lg font-bold mb-2">{t("Bubble Wrap Game")}</h3>

          {!gameStarted &&
          !showLevelComplete &&
          !challengeMode &&
          !challengeCompleted ? (
            <div>
              <p className="text-sm mb-2">
                {t("Level")} {currentLevel}/5 -{" "}
                {getLevelConfig(currentLevel).bubbleCount} {t("bubbles")}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={startGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  {t("Start Level")} {currentLevel}
                </button>

                {completedLevels.length === 5 && (
                  <button
                    onClick={startChallenge}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm"
                  >
                    {t("Challenge Mode")}
                  </button>
                )}
              </div>
            </div>
          ) : showLevelComplete && !challengeMode ? (
            <div>
              <p className="text-green-400 font-bold mb-2">
                {t("Level Complete")}!
              </p>
              {completedLevels.length === 5 && (
                <p className="text-purple-400 text-sm mb-2">
                  {t("All levels completed! NFT achievement unlocked!")}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={resetLevel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  {t("Retry Level")}
                </button>
                {currentLevel < 5 && (
                  <button
                    onClick={nextLevel}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {t("Next Level")}
                  </button>
                )}
                {completedLevels.length === 5 && (
                  <button
                    onClick={startChallenge}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {t("Challenge Mode")}
                  </button>
                )}
              </div>
            </div>
          ) : challengeCompleted ? (
            <div>
              <p className="text-green-400 font-bold mb-2">
                {t("Challenge Complete")}!
              </p>
              <p className="text-yellow-300 text-sm mb-3">
                {t("Your time")}: {formatTime(endTime - startTime)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={startChallenge}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  {t("Retry Challenge")}
                </button>
                <button
                  onClick={exitChallenge}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  {t("Exit Challenge")}
                </button>
              </div>
            </div>
          ) : challengeMode ? (
            <div>
              <p className="text-sm mb-2">
                {t("Challenge Mode")} -{" "}
                {bubbles.filter((b) => b.isPopped).length}/{bubbles.length}{" "}
                {t("popped")}
              </p>

              {/* 将计时器和Reset按钮放在同一行 */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-red-500 font-bold text-lg">
                  {formatTime(currentTime)}
                </p>
                <button
                  onClick={resetLevel}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm ml-3"
                >
                  {t("Reset")}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-2">
                {t("Level")} {currentLevel}/5 -{" "}
                {bubbles.filter((b) => b.isPopped).length}/{bubbles.length}{" "}
                {t("popped")}
              </p>
              <button
                onClick={resetLevel}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
              >
                {t("Reset")}
              </button>
            </div>
          )}

          {/* 级别进度指示器 - 只在非挑战模式下显示 */}
          {!challengeMode && (
            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    completedLevels.includes(level)
                      ? "bg-green-500 text-white"
                      : level === currentLevel
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 气泡区域 - 调整位置与布局 */}
      {gameStarted && (
        <div
          className="pointer-events-auto"
          style={{
            position: "fixed",
            left: "20px",
            top: challengeMode ? "220px" : "250px", // 挑战模式稍微调高位置
            width: "300px",
            maxHeight: "65vh",
            overflow: "visible",
            padding: "15px",
            zIndex: 50,
            backgroundColor: "transparent",
            display: "flex",
            flexWrap: "wrap",
            gap: "15px", // 增加气泡间距，从12px改为15px
            justifyContent: "center",
          }}
        >
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              disabled={bubble.isPopped}
              className={`bubble-item ${bubble.isPopped ? "popped" : ""} ${bubble.isUnpopping ? "unpopping" : ""} ${challengeMode ? "challenge-bubble" : ""}`}
              style={{
                width: "60px", // 增大气泡尺寸，从55px改为60px
                height: "60px", // 增大气泡尺寸，从55px改为60px
                flexShrink: 0,
                borderRadius: "50%",
                border: bubble.isPopped
                  ? "1px solid rgba(160,82,45,0.3)"
                  : "2px solid rgba(255,255,255,0.6)",
                background: bubble.isPopped
                  ? "radial-gradient(circle at 40% 40%, rgba(210,105,30,0.6), rgba(160,82,45,0.5), rgba(101,67,33,0.7))"
                  : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(173,216,230,0.8), rgba(135,206,235,0.9))",
                boxShadow: bubble.isPopped
                  ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)"
                  : "inset 0 -10px 15px rgba(255,255,255,0.6), inset 0 10px 20px rgba(255,255,255,0.9), 0 3px 7px rgba(0,0,0,0.15), 0 7px 12px rgba(0,0,0,0.1)",
                cursor: bubble.isPopped ? "default" : "pointer",
                transition: "all 0.12s ease", // 加快过渡速度，从0.15s改为0.12s
                position: "relative",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              {/* 光泽效果 */}
              <span
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "20%",
                  width: "35%",
                  height: "25%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.98) 0%, transparent 80%)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  display: bubble.isPopped ? "none" : "block",
                }}
              />
              {/* 次级光泽效果 */}
              <span
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "25%",
                  width: "20%",
                  height: "12%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 80%)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  display: bubble.isPopped ? "none" : "block",
                }}
              />
              {/* 破裂效果 - 改进版 */}
              {bubble.isPopped && (
                <>
                  {/* 中央破裂 */}
                  <span
                    style={{
                      position: "absolute",
                      top: "35%",
                      left: "35%",
                      width: "30%",
                      height: "30%",
                      background:
                        "radial-gradient(ellipse, rgba(139,69,19,0.8) 0%, rgba(160,82,45,0.4) 70%)",
                      borderRadius: "50%",
                    }}
                  />
                  {/* 破裂线条1 */}
                  <span
                    style={{
                      position: "absolute",
                      top: "25%",
                      left: "20%",
                      width: "60%",
                      height: "2px",
                      background: "rgba(139,69,19,0.9)",
                      borderRadius: "1px",
                      transform: "rotate(-15deg)",
                    }}
                  />
                  {/* 破裂线条2 */}
                  <span
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "30%",
                      width: "40%",
                      height: "2px",
                      background: "rgba(139,69,19,0.9)",
                      borderRadius: "1px",
                      transform: "rotate(20deg)",
                    }}
                  />
                  {/* 破裂线条3 */}
                  <span
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "25%",
                      width: "50%",
                      height: "2px",
                      background: "rgba(139,69,19,0.9)",
                      borderRadius: "1px",
                      transform: "rotate(5deg)",
                    }}
                  />
                  {/* 暗影破裂区域 */}
                  <span
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "20%",
                      width: "60%",
                      height: "60%",
                      background:
                        "radial-gradient(ellipse, rgba(101,67,33,0.5) 0%, transparent 80%)",
                      borderRadius: "50%",
                    }}
                  />
                </>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .bubble-item {
          transform: scale(1);
          will-change: transform; /* 优化性能 */
        }

        .bubble-item:hover:not(:disabled) {
          transform: scale(1.05);
          filter: brightness(1.1);
          box-shadow:
            inset 0 -10px 20px rgba(255, 255, 255, 0.7),
            inset 0 10px 20px rgba(255, 255, 255, 1),
            0 5px 10px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.1) !important;
        }

        .bubble-item:active:not(:disabled) {
          transform: scale(0.9);
          transition: transform 0.05s ease-out; /* 更快的按下响应 */
        }

        .bubble-item.popped {
          transform: scale(0.85);
          pointer-events: none;
          animation: pop 0.3s forwards; /* 加快动画时间，从0.4s改为0.3s */
        }

        .bubble-item.unpopping {
          animation: unpop 0.3s ease-in-out; /* 加快动画时间，从0.4s改为0.3s */
        }

        /* 挑战模式的气泡样式 */
        .challenge-bubble {
          border-width: 2px !important;
        }

        .challenge-bubble:not(:disabled) {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
          }
        }

        @keyframes pop {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          15% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
          40% {
            transform: scale(0.8);
            filter: brightness(0.9);
          }
          60% {
            transform: scale(0.85);
            filter: brightness(0.88);
          }
          100% {
            transform: scale(0.85);
            filter: brightness(0.85);
          }
        }

        @keyframes unpop {
          0% {
            transform: scale(0.85);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.1);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
};

export default BubbleWrap;
