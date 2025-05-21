"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface DragonBallProps {
  ballNumber: number;
  onCollide: () => void;
}

export const DragonBall = ({ ballNumber, onCollide }: DragonBallProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
  const animationRef = useRef<number | null>(null);
  const collisionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCollisionTimeRef = useRef<number>(0);
  const onCollideRef = useRef(onCollide); // 存储最新的回调函数
  const pendingCollisionRef = useRef(false); // 跟踪是否有待处理的碰撞
  
  // 更新回调函数引用
  useEffect(() => {
    onCollideRef.current = onCollide;
  }, [onCollide]);
  
  // 设置一个单独的Effect来处理碰撞回调
  useEffect(() => {
    const handlePendingCollision = () => {
      if (pendingCollisionRef.current) {
        pendingCollisionRef.current = false;
        onCollideRef.current();
      }
    };
    
    // 设置定期检查是否有待处理的碰撞
    const intervalId = setInterval(handlePendingCollision, 50);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // 用useCallback包装碰撞处理，防止频繁触发
  const handleCollision = useCallback(() => {
    const now = Date.now();
    // 限制碰撞触发频率，至少间隔500ms
    if (now - lastCollisionTimeRef.current > 500) {
      lastCollisionTimeRef.current = now;
      // 标记有待处理的碰撞，但不直接调用回调
      pendingCollisionRef.current = true;
    }
  }, []);
  
  // 初始化随机位置和速度
  useEffect(() => {
    // 随机位置
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    
    const randomX = Math.floor(Math.random() * (maxX - 100)) + 50;
    const randomY = Math.floor(Math.random() * (maxY - 100)) + 50;
    
    setPosition({ x: randomX, y: randomY });
    
    // 随机速度 (0.5 - 2.5)
    const randomSpeedX = (Math.random() * 2) + 0.5;
    const randomSpeedY = (Math.random() * 2) + 0.5;
    
    // 随机方向
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    
    setVelocity({ 
      x: randomSpeedX * directionX, 
      y: randomSpeedY * directionY 
    });
    
    // 清理函数
    return () => {
      if (collisionTimeoutRef.current) {
        const timeout = collisionTimeoutRef.current; // 在清理函数中先保存引用
        clearTimeout(timeout);
      }
    };
  }, []);
  
  // 龙珠动画效果
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    // 创建呼吸效果
    const pulseInterval = setInterval(() => {
      setScale(prev => prev === 1 ? 1.1 : 1);
    }, 1000);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  // 移动龙珠
  useEffect(() => {
    const iconSize = 80; // 龙珠尺寸
    
    const animate = () => {
      setPosition(prevPos => {
        let newX = prevPos.x + velocity.x;
        let newY = prevPos.y + velocity.y;
        let newVelocityX = velocity.x;
        let newVelocityY = velocity.y;
        let collided = false;
        
        // 检测碰撞边界
        if (newX <= 0 || newX >= window.innerWidth - iconSize) {
          newVelocityX = -velocity.x;
          collided = true;
        }
        
        if (newY <= 0 || newY >= window.innerHeight - iconSize) {
          newVelocityY = -velocity.y;
          collided = true;
        }
        
        // 如果碰撞了，调用回调
        if (collided) {
          // 不直接调用onCollide，而是使用我们的包装函数
          handleCollision();
          setVelocity({ x: newVelocityX, y: newVelocityY });
        }
        
        return { 
          x: Math.max(0, Math.min(window.innerWidth - iconSize, newX)), 
          y: Math.max(0, Math.min(window.innerHeight - iconSize, newY)) 
        };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [velocity, handleCollision]);
  
  return (
    <div 
      className="fixed z-30" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        pointerEvents: 'none', // 防止图标阻止点击下方元素
        willChange: 'transform', // 优化渲染性能
        transform: `scale(${scale}) translate3d(0, 0, 0)`, // 启用GPU加速
        transition: 'transform 1s ease-in-out'
      }}
    >
      <div className="w-20 h-20 relative">
        <Image 
          src={`/dragon-ball/${ballNumber}.png`}
          alt={`${ballNumber}星龙珠`}
          width={80}
          height={80}
          className="drop-shadow-lg"
          priority
        />
        
        {/* 光晕效果 */}
        <div className="absolute inset-0 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
  );
}; 