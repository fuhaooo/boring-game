"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface IconData {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface MovingIconProps {
  onCollide: () => void;
  iconCount: number;
}

export const MovingIcon = ({ onCollide, iconCount }: MovingIconProps) => {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const iconSize = 50;
  const collisionRef = useRef<(() => void) | null>(null);
  const animationRef = useRef<number | null>(null);
  const prevIconCountRef = useRef(iconCount);
  const iconsRef = useRef<IconData[]>([]);
  
  // 保存最新的状态值到ref
  useEffect(() => {
    iconsRef.current = icons;
  }, [icons]);
  
  // 保存回调函数引用
  useEffect(() => {
    collisionRef.current = onCollide;
  }, [onCollide]);
  
  // 获取和更新窗口大小
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // 初始化大小
    updateWindowSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);
  
  // 当iconCount变化或窗口大小变化时创建新图标
  useEffect(() => {
    if (windowSize.width === 0) return;
    
    // 重新设置图标数量，确保总是与iconCount一致
    setIcons(prevIcons => {
      // 如果已有图标数比需要的多，则保留前几个
      if (prevIcons.length > iconCount) {
        return prevIcons.slice(0, iconCount);
      }
      
      // 如果需要添加新图标
      if (iconCount > prevIcons.length) {
        const newIcons = [...prevIcons];
        
        // 仅添加新的图标
        for (let i = prevIcons.length; i < iconCount; i++) {
          newIcons.push({
            id: Date.now() + i, // 创建唯一ID
            x: Math.random() * (windowSize.width - iconSize - 50), // 减去图标大小和边距
            y: Math.random() * (windowSize.height - iconSize - 200), // 减去图标大小和顶部空间
            dx: (Math.random() * 2 + 2) * (Math.random() > 0.5 ? 1 : -1),
            dy: (Math.random() * 2 + 2) * (Math.random() > 0.5 ? 1 : -1)
          });
        }
        
        return newIcons;
      }
      
      // 如果没有变化
      return prevIcons;
    });
    
    prevIconCountRef.current = iconCount;
  }, [iconCount, windowSize, iconSize]);
  
  // 创建移动图标的函数，使用requestAnimationFrame提高性能
  const moveIcons = useCallback(() => {
    if (windowSize.width === 0) return;
    
    setIcons(prevIcons => 
      prevIcons.map(icon => {
        let newX = icon.x + icon.dx;
        let newY = icon.y + icon.dy;
        let newDx = icon.dx;
        let newDy = icon.dy;
        
        let collided = false;
        
        // 碰到浏览器边界
        if (newX <= 0 || newX >= windowSize.width - iconSize) {
          newDx = -newDx;
          collided = true;
        }
        
        if (newY <= 0 || newY >= windowSize.height - iconSize) {
          newDy = -newDy;
          collided = true;
        }
        
        // 如果发生碰撞，触发回调
        if (collided && collisionRef.current) {
          // 使用setTimeout避免在渲染期间更新父组件状态
          setTimeout(() => {
            if (collisionRef.current) collisionRef.current();
          }, 0);
        }
        
        return {
          ...icon,
          x: Math.max(0, Math.min(newX, windowSize.width - iconSize)),
          y: Math.max(0, Math.min(newY, windowSize.height - iconSize)),
          dx: newDx,
          dy: newDy
        };
      })
    );
  }, [windowSize, iconSize]);
  
  // 使用requestAnimationFrame实现更平滑的动画
  useEffect(() => {
    if (icons.length === 0) return;
    
    let lastTime = 0;
    const targetFPS = 30; // 目标帧率
    const frameInterval = 1000 / targetFPS;
    
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;
      
      if (elapsed > frameInterval) {
        moveIcons();
        lastTime = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [icons.length, moveIcons]);
  
  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // 渲染位于全局的图标
  return (
    <>
      {icons.map(icon => (
        <div
          key={icon.id}
          className="fixed z-10"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            pointerEvents: 'none', // 防止图标阻止点击下方元素
            willChange: 'transform', // 优化渲染性能
            transform: `translate3d(0, 0, 0)` // 启用GPU加速
          }}
        >
          <Image 
            src="/sn-symbol-gradient.png" 
            alt="StarkNet Symbol" 
            width={iconSize} 
            height={iconSize}
            className="rounded-full drop-shadow-md"
            priority
          />
        </div>
      ))}
    </>
  );
}; 