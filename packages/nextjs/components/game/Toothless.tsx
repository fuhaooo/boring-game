"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export const Toothless = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [showToothless, setShowToothless] = useState(true);
  
  // 随机移动Toothless
  useEffect(() => {
    // 显示30秒后消失
    const hideTimer = setTimeout(() => {
      setShowToothless(false);
    }, 30000);
    
    // 每2秒随机移动位置
    const moveInterval = setInterval(() => {
      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 300;
      
      const randomX = Math.max(0, Math.floor(Math.random() * maxX));
      const randomY = Math.max(0, Math.floor(Math.random() * maxY));
      
      setPosition({ x: randomX, y: randomY });
    }, 2000);
    
    return () => {
      clearTimeout(hideTimer);
      clearInterval(moveInterval);
    };
  }, []);
  
  if (!showToothless) return null;
  
  return (
    <div 
      className="fixed z-40 transition-all duration-1000 ease-in-out"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      <div className="relative">
        <Image 
          src="/gif/toothless.gif" 
          alt="Dancing Toothless" 
          width={240} 
          height={240}
          className="rounded-lg"
          priority
        />
        
        {/* 星星特效 */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-2 -right-2 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-70 animation-delay-500"></div>
        <div className="absolute -bottom-2 left-10 w-5 h-5 bg-purple-300 rounded-full animate-ping opacity-70 animation-delay-1000"></div>
        
        {/* 提示文字 */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
          我见过龙!
        </div>
      </div>
    </div>
  );
}; 