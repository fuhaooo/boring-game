"use client";

import { useEffect, useRef } from "react";

export const RainEffect = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 组件挂载时自动播放雨声
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 设置适当的音量
      audioRef.current.play().catch(err => console.error("播放雨声失败:", err));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  return (
    <div className="rain-container fixed inset-0 pointer-events-none z-0">
      {/* 背景音频 */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c1c2b3e74c.mp3"
        loop
      />
      
      {/* 雨滴动画 - 覆盖整个屏幕 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 半透明蓝色覆盖层 */}
        <div className="absolute inset-0 bg-blue-500 opacity-5"></div>
        
        {/* 生成多个雨滴 */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bg-white w-px h-20 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.3,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.7 + Math.random() * 0.9}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}; 