"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { useLanguage } from "~~/hooks/useLanguage";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">{t("Welcome to")}</span>
          <span className="block text-4xl font-bold">
            {t("Boring Game Title")}
          </span>
        </h1>
        <ConnectedAddress />
        <p className="text-center text-lg">
          {t("A simple Starknet based game")}
        </p>
        <div className="flex justify-center mt-8">
          <Link
            href="/game"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {t("Start Game")}
          </Link>
        </div>
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          {/* 移除两个卡片内容 */}
        </div>
      </div>
    </div>
  );
};

export default Home;
