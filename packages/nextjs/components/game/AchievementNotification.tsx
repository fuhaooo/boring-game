"use client";

import { useEffect } from "react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  requirement: number;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  useEffect(() => {
    // 自动关闭通知
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-10 right-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in">
      <div className="flex items-center gap-3">
        <div className="text-3xl">🏆</div>
        <div>
          <h3 className="font-bold">成就解锁!</h3>
          <p>{achievement.name}: {achievement.description}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-white">
          ✕
        </button>
      </div>
    </div>
  );
}; 