"use client";

import { useState, useRef, useEffect } from "react";

export const ThunderstormEffect = () => {
  const [lightningActive, setLightningActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 组件挂载时自动播放雷雨声
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // 设置适当的音量
      audioRef.current.play().catch(err => console.error("播放雷雨声失败:", err));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // 闪电效果
  useEffect(() => {
    const createLightning = () => {
      setLightningActive(true);
      
      // 闪电持续时间 (有时候闪两次)
      setTimeout(() => {
        setLightningActive(false);
        
        // 有30%的几率在短时间内再次闪烁
        if (Math.random() < 0.3) {
          setTimeout(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 100);
          }, 100);
        }
      }, 150);
      
      // 随机安排下一次闪电
      const nextTime = 3000 + Math.random() * 10000; // 3-13秒随机
      timeoutRef.current = setTimeout(createLightning, nextTime);
    };
    
    // 初始闪电延迟
    const initialDelay = 1000 + Math.random() * 3000;
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    
    timeoutRef.current = setTimeout(createLightning, initialDelay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="thunderstorm-container fixed inset-0 pointer-events-none z-0">
      {/* 背景音频 */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_d0a13f69d2.mp3"
        loop
      />
      
      {/* 雷雨动画 - 覆盖整个屏幕 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 暗色天空覆盖层 */}
        <div className="absolute inset-0 bg-gray-900 opacity-10"></div>
        
        {/* 雨滴 */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bg-white w-px h-24 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.3,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.6 + Math.random() * 0.8}s`
            }}
          ></div>
        ))}
        
        {/* 闪电效果覆盖层 */}
        <div 
          className={`absolute inset-0 bg-white transition-opacity duration-100 ${
            lightningActive ? "opacity-30" : "opacity-0"
          }`}
        ></div>
        
        {/* 随机闪电形状 - 仅在闪电激活时显示 */}
        {lightningActive && (
          <svg
            className="absolute w-full h-full opacity-70"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={`M${50 + Math.random() * 20 - 10},0 
                  L${40 + Math.random() * 20 - 10},${30 + Math.random() * 10} 
                  L${60 + Math.random() * 20 - 10},${40 + Math.random() * 10} 
                  L${30 + Math.random() * 20 - 10},${100}`}
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
}; 