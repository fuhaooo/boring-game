"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

// 声明HTMLAudioElement上的自定义属性类型
declare global {
  interface HTMLAudioElement {
    __canPlayHandler?: EventListener;
  }
}

// Lofi音乐列表 - 使用可靠的免费音乐源
const LOFI_TRACKS = [
  {
    title: "Chill Lofi Beat",
    artist: "Lofi Beats",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    title: "Rainy Lofi CIty",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/04/26/audio_5281b3676b.mp3",
  },
  {
    title: "Spring Lofi Vibes",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_657d2395b7.mp3",
  },
  {
    title: "Ocean Lofi Vibes",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_1c073cca6c.mp3",
  },
  {
    title: "Ambient Lofi",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_30beef48e1.mp3",
  },
  {
    title: "Cloud Nine Whispers",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_15f5c3cee3.mp3",
  },
  {
    title: "Pink Ocean",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_0aca95df0d.mp3",
  },
  {
    title: "No Copyright Music Lofi",
    artist: "lkoliks",
    url: "https://cdn.pixabay.com/download/audio/2025/04/20/audio_d17e0004d5.mp3",
  },
  {
    title: "Lazy Sunbeams",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/11/audio_f2972b7a82.mp3",
  },
  {
    title: "Coastal city vibes",
    artist: "lofidreams99",
    url: "https://cdn.pixabay.com/download/audio/2025/05/09/audio_12e45f8e55.mp3",
  },
  {
    title: "Chill Lofi Background Music",
    artist: "MFCC",
    url: "https://cdn.pixabay.com/download/audio/2025/05/05/audio_4a5c8e690e.mp3",
  },
  {
    title: "Tokyo Cafe",
    artist: "TVARI",
    url: "https://cdn.pixabay.com/download/audio/2023/07/22/audio_720626056a.mp3",
  },
  {
    title: "Love Me Not",
    artist: "prazkhanal",
    url: "https://cdn.pixabay.com/download/audio/2025/05/10/audio_6e505ba709.mp3",
  },
  {
    title: "Whispering Vinyl Loops",
    artist: "RibhavAgrawal",
    url: "https://cdn.pixabay.com/download/audio/2024/12/27/audio_3ee67607bb.mp3",
  },
];

export const LofiPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // 播放音频的统一处理函数
  const playAudio = useCallback(() => {
    if (!audioRef.current) return;

    setIsLoading(true);
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setLoadError(false);
        })
        .catch((err) => {
          console.error(`播放失败: ${err}`);
          setIsPlaying(false);
          setLoadError(true);
          setAutoPlay(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // 组件挂载时设置音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  // 处理自动播放
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const audio = audioRef.current;
      // 添加canplay事件监听器
      const handleCanPlay = () => {
        playAudio();
        // 播放后移除监听器
        audio.removeEventListener("canplay", handleCanPlay);
      };

      audio.addEventListener("canplay", handleCanPlay);

      // 清理函数
      return () => {
        audio.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [autoPlay, playAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const changeTrack = useCallback(
    (direction: "next" | "prev") => {
      if (!audioRef.current) return;

      setIsLoading(true);
      setLoadError(false);

      // 计算下一首歌的索引
      let nextIndex = currentTrack;
      if (direction === "next") {
        nextIndex = (currentTrack + 1) % LOFI_TRACKS.length;
      } else {
        nextIndex =
          (currentTrack - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length;
      }

      // 暂停当前播放
      audioRef.current.pause();

      // 更新当前歌曲
      setCurrentTrack(nextIndex);

      // 重置播放状态
      audioRef.current.currentTime = 0;

      // 优化播放逻辑 - 使用一个标志来判断是否应该播放
      // 如果是从ended事件触发的，或者当前正在播放，则应该播放下一首
      const shouldPlay = isPlaying;

      // 先清除旧的事件监听器
      const oldCanPlayHandler = audioRef.current.__canPlayHandler;
      if (oldCanPlayHandler) {
        audioRef.current.removeEventListener("canplay", oldCanPlayHandler);
      }

      // 设置新的canplay事件处理
      const handleCanPlay = () => {
        if (shouldPlay && audioRef.current) {
          console.log(`准备播放下一首: ${LOFI_TRACKS[nextIndex].title}`);
          playAudio();
        }
        audioRef.current?.removeEventListener("canplay", handleCanPlay);
      };

      // 保存引用以便后续清理
      audioRef.current.__canPlayHandler = handleCanPlay;
      audioRef.current.addEventListener("canplay", handleCanPlay);

      // 设置新的音频源并加载
      audioRef.current.src = LOFI_TRACKS[nextIndex].url;
      audioRef.current.load();

      // 如果不需要播放，直接结束加载状态
      if (!shouldPlay) {
        setIsLoading(false);
      }
    },
    [currentTrack, isPlaying, playAudio],
  );

  const nextTrack = useCallback(() => changeTrack("next"), [changeTrack]);
  const prevTrack = () => changeTrack("prev");

  // 更新音频当前时间和处理结束事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleError = (e: Event) => {
      console.error("音频加载错误", e);
      setLoadError(true);
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleEnded = () => {
      console.log("歌曲播放结束，切换到下一首");
      // 播放结束时自动切换到下一首，强制设置为正在播放状态
      setIsPlaying(true); // 确保下一首歌曲会自动播放
      changeTrack("next");
    };

    // 当加载新的元数据时立即更新进度条
    const handleLoadedMetadata = () => {
      updateTime();
      console.log("元数据已加载，更新进度条");
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [changeTrack]);

  // 格式化时间
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`lofi-player fixed ${isMinimized ? "bottom-4 right-4 w-24 h-24" : "bottom-8 right-8 w-auto"} transition-all duration-300 z-20`}
    >
      <audio ref={audioRef} src={LOFI_TRACKS[currentTrack].url} />

      {isMinimized ? (
        // 最小化状态
        <div
          className="rounded-full bg-indigo-500 bg-opacity-70 backdrop-blur-md p-3 shadow-lg cursor-pointer hover:bg-opacity-90 transition"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      ) : (
        // 展开状态
        <div className="relative rounded-xl bg-indigo-600 bg-opacity-60 backdrop-blur-md overflow-hidden shadow-xl">
          {/* 最小化按钮 */}
          <button
            className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100 z-10"
            onClick={() => setIsMinimized(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>

          <div className="flex p-3">
            {/* Lofi Girl 图像 */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden mr-3 flex-shrink-0">
              <Image
                src="/lofi-girl.svg"
                alt="Lofi Girl"
                width={96}
                height={96}
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col w-52">
              {/* 播放信息 */}
              <div className="text-white mb-2">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-300"} mr-2`}
                  ></div>
                  <div className="text-sm opacity-80">Now Playing</div>
                </div>
                <h3 className="text-lg font-bold truncate">
                  {LOFI_TRACKS[currentTrack].title}
                </h3>
                <p className="text-xs opacity-80 mb-2">
                  {LOFI_TRACKS[currentTrack].artist}
                </p>

                {/* 播放错误提示 */}
                {loadError && (
                  <div className="text-xs text-red-300 mb-1">
                    无法播放此音轨，请尝试下一首
                  </div>
                )}
              </div>

              {/* 进度条 */}
              <div className="mb-3">
                <div className="h-1 bg-white bg-opacity-20 rounded-full w-full">
                  <div
                    className="h-1 bg-white bg-opacity-70 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white text-opacity-70 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevTrack}
                  className="text-white opacity-80 hover:opacity-100 transition"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="text-white opacity-80 hover:opacity-100 transition"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
