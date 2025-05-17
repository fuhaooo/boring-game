// 声明游戏组件模块
declare module "~~/components/game/MovingIcon" {
  export interface MovingIconProps {
    onCollide: () => void;
    iconCount: number;
  }
  export const MovingIcon: React.FC<MovingIconProps>;
}

declare module "~~/components/game/LofiPlayer" {
  export const LofiPlayer: React.FC;
}

declare module "~~/components/game/NewsScroller" {
  export const NewsScroller: React.FC;
}

declare module "~~/components/game/RainEffect" {
  export const RainEffect: React.FC;
}

declare module "~~/components/game/ThunderstormEffect" {
  export const ThunderstormEffect: React.FC;
}

declare module "~~/components/game/AchievementNotification" {
  export interface Achievement {
    id: number;
    name: string;
    description: string;
    requirement: number;
  }

  export interface AchievementNotificationProps {
    achievement: Achievement;
    onClose: () => void;
  }

  export const AchievementNotification: React.FC<AchievementNotificationProps>;
} 