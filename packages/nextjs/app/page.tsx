"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { useLanguage } from "~~/hooks/useLanguage";

const Home = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // 定义背景图片序列 - back1 到 back8
  const backgroundImages = [
    "/home/back1.jpg",
    "/home/back2.jpg",
    "/home/back3.jpg",
    "/home/back4.jpg",
    "/home/back5.jpg",
    "/home/back6.jpg",
    "/home/back7.jpg",
    "/home/back8.jpg",
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 计算背景切换的透明度
  const getBackgroundOpacity = (index: number) => {
    const screenHeight = window.innerHeight;
    const sectionStart = index * screenHeight;
    const sectionEnd = (index + 1) * screenHeight;

    if (scrollY < sectionStart) return 0;
    if (scrollY >= sectionEnd) return 0;

    const progress = (scrollY - sectionStart) / screenHeight;

    // 淡入淡出效果
    if (progress < 0.1) return progress * 10;
    if (progress > 0.9) return (1 - progress) * 10;
    return 1;
  };

  return (
    <>
      {/* 动态背景层系统 */}
      {backgroundImages.map((bgImage, index) => (
        <div
          key={index}
          className="fixed inset-0 w-full h-full transition-opacity duration-300"
          style={{
            opacity: getBackgroundOpacity(index),
            zIndex: index,
          }}
        >
          <Image
            src={bgImage}
            alt={`Background ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* 渐变覆盖层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
        </div>
      ))}

      {/* 固定的宇航员 - 移动到右下角位置 */}
      <div className="fixed bottom-10 right-10 z-20">
        <Image
          src="/home/people.png"
          alt="Astronaut"
          width={250}
          height={330}
          className="drop-shadow-2xl animate-float"
        />
      </div>

      {/* 主要内容区域 - 使用浏览器原生滚动 */}
      <div className="relative z-10">
        {/* 第一屏 - 欢迎和游戏标题 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="mb-6">
              <span className="block text-4xl mb-4 font-light text-white animate-fade-in drop-shadow-lg">
                {t("Welcome to")}
              </span>
            </div>

            <Image
              src="/home/title.png"
              alt="Game Title"
              width={600}
              height={200}
              className="drop-shadow-2xl animate-pulse"
              priority
            />
          </div>

          <div className="text-center px-5 mt-32">
            <div className="mb-8 animate-fade-in-delay-2">
              <ConnectedAddress />
            </div>

            <p className="text-white text-xl mb-8 animate-fade-in-delay-3 max-w-2xl mx-auto drop-shadow-lg">
              {t("A simple Starknet based game")}
            </p>
          </div>

          <div className="absolute bottom-8 inset-x-0 flex justify-center text-white animate-bounce">
            <div className="text-center">
              <p className="text-sm mb-2 drop-shadow-lg">
                {t("Scroll down to start falling")}
              </p>
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* 第二屏 - 数字过载时代 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("Digital Overwhelm Era")}
            </h2>

            <div className="space-y-6 text-xl text-white drop-shadow-lg animate-slide-up-delay">
              <p className="leading-relaxed">
                {t(
                  "We live in an era of constant stimulation and fragmented attention.",
                )}
              </p>
              <p className="leading-relaxed">
                {t(
                  "Social media, notifications, and endless content consume our mental bandwidth.",
                )}
              </p>
              <p className="text-2xl font-semibold text-blue-200 mt-8">
                {t("When did we lose the ability to simply... exist?")}
              </p>
            </div>
          </div>
        </section>

        {/* 第三屏 - 娱乐的问题 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("The Problem with Fun")}
            </h2>

            <div className="space-y-6 text-xl text-white drop-shadow-lg animate-slide-up-delay">
              <p className="leading-relaxed">
                {t(
                  "Traditional games demand constant engagement and dopamine hits.",
                )}
              </p>
              <p className="leading-relaxed">
                {t(
                  "They exploit our psychology rather than nurture our wellbeing.",
                )}
              </p>
              <p className="text-2xl font-semibold text-purple-200 mt-8">
                {t("What if games could be meditative instead of addictive?")}
              </p>
            </div>
          </div>
        </section>

        {/* 第四屏 - 我们的解决方案 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("Our Solution")}
            </h2>

            <div className="space-y-6 text-xl text-white drop-shadow-lg animate-slide-up-delay">
              <p className="leading-relaxed">
                {t("Boring Game flips the script on digital interaction.")}
              </p>
              <p className="leading-relaxed">
                {t("Start with silence, discover meaning in repetition.")}
              </p>
              <p className="text-2xl font-semibold text-green-200 mt-8">
                {t(
                  "Experience the journey from minimal to maximal stimulation.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 第五屏 - 为什么选择区块链 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("Why Blockchain")}
            </h2>

            <div className="space-y-6 text-xl text-white drop-shadow-lg animate-slide-up-delay">
              <p className="leading-relaxed">
                {t("Your journey deserves permanent recognition.")}
              </p>
              <p className="leading-relaxed">
                {t("Achievements become NFTs - proof of your exploration.")}
              </p>
              <p className="text-2xl font-semibold text-yellow-200 mt-8">
                {t("Decentralized experiences that truly belong to you.")}
              </p>
            </div>
          </div>
        </section>

        {/* 第六屏 - 创新功能 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-5xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-12 drop-shadow-lg animate-slide-up">
              {t("Innovation Features")}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-lg text-white drop-shadow-lg animate-slide-up-delay">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🧘</div>
                <p>{t("Progressive sensory unlocking system")}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🎧</div>
                <p>{t("ASMR-driven audio experiences")}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">⚙️</div>
                <p>{t("Component upgrade mechanics")}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🫧</div>
                <p>{t("Bubble wrap relaxation module")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 第七屏 - 技术创新 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("Technical Innovation")}
            </h2>

            <div className="space-y-6 text-xl text-white drop-shadow-lg animate-slide-up-delay">
              <p className="leading-relaxed">
                {t("Built on Starknet for scalable blockchain gaming.")}
              </p>
              <p className="leading-relaxed">
                {t("Spatial audio and dynamic soundscapes.")}
              </p>
              <p className="leading-relaxed">
                {t("Smart contract-based achievement system.")}
              </p>
              <p className="text-2xl font-semibold text-cyan-200 mt-8">
                {t("Modular component architecture for endless expansion.")}
              </p>
            </div>
          </div>
        </section>

        {/* 第八屏 - 开始游戏 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-8 drop-shadow-lg animate-slide-up">
              {t("Ready to Start")}
            </h2>

            <div className="space-y-8 animate-slide-up-delay">
              <p className="text-2xl text-white font-semibold drop-shadow-lg">
                {t("This is not just a game. It's a mirror.")}
              </p>
              <p className="text-xl text-white drop-shadow-lg">
                {t("Discover what boredom reveals about yourself.")}
              </p>

              <div className="mt-12">
                <Link href="/game" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <button className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 px-16 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-2xl">
                    {t("Enter the Boredomverse")}
                  </button>
                </Link>
              </div>

              <div className="text-center mt-8">
                <a
                  href="https://x.com/Alfredfuuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-white opacity-80 hover:opacity-100 transition-opacity duration-300 hover:text-blue-400"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm drop-shadow">@Alfredfuuu</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
          }
          50% {
            transform: translateY(-10px) rotate(0deg);
          }
          75% {
            transform: translateY(-20px) rotate(-2deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.9s both;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.2s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 1s ease-out 0.4s both;
        }
      `}</style>
    </>
  );
};

export default Home;
