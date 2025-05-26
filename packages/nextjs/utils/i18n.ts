export type Language = "en" | "zh";

export const translations = {
  en: {
    // Header/Navigation
    "Boring Game": "Boring Game",
    Home: "Home",
    "Debug Contracts": "Debug Contracts",
    "Wallet Not Deployed": "Wallet Not Deployed",

    // Home page
    "Welcome to": "Welcome to",
    "Boring Game Title": "Boring Game",
    "A simple Starknet based game": "A simple Starknet-based game",
    "Start Game": "Start Game",
    "Start Game (Skip Check)": "Start Game (Skip Check)",
    "Use the": "Use the",
    "Debug Contracts Page": "Debug Contracts",
    "page to test smart contract functionality.":
      "page to test smart contract functionality.",
    "Start your blockchain game journey, collect points, unlock achievements, and mint NFTs!":
      "Start your blockchain game journey, collect points, unlock achievements, and mint NFTs!",

    // Game page - Main UI
    "Start Game (1 STRK)": "Start Game (1 STRK)",
    "Game Guide": "Game Guide",
    "Click Me": "Click me",
    stimulation: "points",
    "stimulation per second": "points per second",

    // Game page - Instructions
    'Click "Start Game" button requires 1 STRK token':
      'Click "Start Game" button requires 1 STRK token',
    'Each click on "Click Me!" button earns 1 point':
      'Each click on "Click Me!" button earns 1 point',
    "Reaching specific thresholds unlocks purchase options:":
      "Reaching specific thresholds unlocks purchase options:",
    "50 points: Moving Icon - Gain 1 point each time it hits browser boundary (max 10)":
      "50 points: Moving Icon - Gain 1 point each time it hits browser boundary (max 10)",
    "After buying 10 icons, spend 2000 points to upgrade, upgraded icons give 5 points per collision with sound":
      "After buying 10 icons, spend 2000 points to upgrade, upgraded icons give 5 points per collision with sound",
    "150 points: Lofi Music - Play relaxing music":
      "150 points: Lofi Music - Play relaxing music",
    "300 points: News Scroll - Display latest StarkNet ecosystem news":
      "300 points: News Scroll - Display latest StarkNet ecosystem news",
    "500 points: Rain ASMR - Enjoy relaxing rain sounds":
      "500 points: Rain ASMR - Enjoy relaxing rain sounds",
    "800 points: Thunderstorm Effects - Lightning thunderstorm atmosphere":
      "800 points: Thunderstorm Effects - Lightning thunderstorm atmosphere",
    "Collect seven dragon balls:": "Collect seven dragon balls:",
    "Each dragon ball requires purchase, first one costs 1000 points, each subsequent one costs 500 more":
      "Each dragon ball requires purchase, first one costs 1000 points, each subsequent one costs 500 more",
    "Dragon balls move around screen, gaining 100 points each boundary hit":
      "Dragon balls move around screen, gaining 100 points each boundary hit",
    "Collect all seven to summon Toothless dancing in bottom left!":
      "Collect all seven to summon Toothless dancing in bottom left!",
    "After summoning Toothless, spend 5000 points to upgrade dragon balls with sound effects":
      "After summoning Toothless, spend 5000 points to upgrade dragon balls with sound effects",
    "After upgrade, new dragon ball prices start at 5000 points and double each purchase":
      "After upgrade, new dragon ball prices start at 5000 points and double each purchase",
    "Unlock achievements at specific points: 100, 500 and 1000 points":
      "Unlock achievements at specific points: 100, 500 and 1000 points",
    "After unlocking achievements, you can mint commemorative NFTs":
      "After unlocking achievements, you can mint commemorative NFTs",

    // Game page - Purchase options
    "Moving Icon": "Moving Icon",
    "Upgrade Icon": "Upgrade Icon",
    "Upgrade Click": "Upgrade Click",
    "Upgraded Click": "Upgraded Click",
    "Click Up": "Click Up",
    "Click Up Level 2": "Click Up Level 2",
    "+2 points/click": "+2 points/click",
    "+3 points/click": "+3 points/click",
    "Upgrade to Level 2": "Upgrade to Level 2",
    Upgraded: "Upgraded",
    points: "points",
    score_points: "points",
    "+5 points/hit": "+5 points/hit",
    "Music Player": "Music Player",
    "News Scroll": "News Scroll",
    "Rain ASMR": "Rain ASMR",
    Thunderstorm: "Thunderstorm",
    "Dragon Ball": "Dragon Ball",

    // Game page - Dragon Ball
    "Dragon Ball Count": "Dragon Ball Count",
    "Dragon Ball Quest Complete": "Dragon Ball Quest Complete!",
    "You have summoned Toothless! Dragon balls can now be upgraded.":
      "You have summoned Toothless! Dragon balls can now be upgraded.",
    "Upgrade Dragon Balls (5000 points)": "Upgrade Dragon Balls (5000 points)",
    "Upgrade dragon balls for enhanced effects!":
      "Upgrade dragon balls for enhanced effects!",

    // Game page - Modals
    "STRK Token Authorization Required": "STRK Token Authorization Required",
    "To start the game, you need to authorize the contract to use your STRK tokens.":
      "To start the game, you need to authorize the contract to use your STRK tokens.",
    "Authorize Amount:": "Authorize Amount:",
    STRK: "STRK",
    Cancel: "Cancel",
    Authorize: "Authorize",
    "Authorizing...": "Authorizing...",
    "Checking authorization...": "Checking authorization...",

    // NFT Preview Modal
    "NFT Preview": "NFT Preview",
    "Achievement NFT Preview": "Achievement NFT Preview",
    "This is a preview of the NFT you will receive for this achievement.":
      "This is a preview of the NFT you will receive for this achievement.",
    "Mint NFT": "Mint NFT",
    "Minting...": "Minting...",

    // Achievements
    "I have seen a dragon": "I have seen a dragon",
    "Collect all 7 dragon balls": "Collect all 7 dragon balls",
    "Bubble Master": "Bubble Master",
    "Bubble God": "Bubble God",
    "Complete all 5 levels of Bubble Wrap game":
      "Complete all 5 levels of Bubble Wrap game",

    // Bubble Wrap Game
    "Bubble Wrap": "Bubble Wrap",
    "Bubble Wrap Game": "Bubble Wrap Game",
    Level: "Level",
    popped: "popped",
    bubbles: "bubbles",
    Upgrade: "Upgrade",
    "Level Complete": "Level Complete",
    "You completed level": "You completed level",
    "All levels completed! NFT achievement unlocked!":
      "All levels completed! NFT achievement unlocked!",
    "Retry Level": "Retry Level",
    "Next Level": "Next Level",
    Progress: "Progress",
    Reset: "Reset",
    "Pop all": "Pop all",
    "bubbles in": "bubbles in",
    seconds: "seconds",
    "Start Level": "Start Level",
    "Challenge Mode": "Challenge Mode",
    "Challenge Complete": "Challenge Complete",
    "Your time": "Your time",
    "Retry Challenge": "Retry Challenge",
    "Exit Challenge": "Exit Challenge",

    // Unlocked achievements section
    "Unlocked Achievements": "Unlocked Achievements",
    Full: "Full",
    "Sound Effect": "Sound Effect",
    "Level completed! You earned": "Level completed! You earned",
    reward_points: "points",
    "All levels completed! You earned": "All levels completed! You earned",
    "bonus points": "bonus points",

    // Common buttons
    Close: "Close",
    Continue: "Continue",
    "Achievement unlocked!": "Achievement unlocked!",

    // Home page story sections
    "Digital Overwhelm Era": "Digital Overwhelm Era",
    "We live in an era of constant stimulation and fragmented attention.": "We live in an era of constant stimulation and fragmented attention.",
    "Social media, notifications, and endless content consume our mental bandwidth.": "Social media, notifications, and endless content consume our mental bandwidth.",
    "When did we lose the ability to simply... exist?": "When did we lose the ability to simply... exist?",

    "The Problem with Fun": "The Problem with Fun",
    "Traditional games demand constant engagement and dopamine hits.": "Traditional games demand constant engagement and dopamine hits.",
    "They exploit our psychology rather than nurture our wellbeing.": "They exploit our psychology rather than nurture our wellbeing.",
    "What if games could be meditative instead of addictive?": "What if games could be meditative instead of addictive?",

    "Our Solution": "Our Solution",
    "Boring Game flips the script on digital interaction.": "Boring Game flips the script on digital interaction.",
    "Start with silence, discover meaning in repetition.": "Start with silence, discover meaning in repetition.",
    "Experience the journey from minimal to maximal stimulation.": "Experience the journey from minimal to maximal stimulation.",

    "Why Blockchain": "Why Blockchain",
    "Your journey deserves permanent recognition.": "Your journey deserves permanent recognition.",
    "Achievements become NFTs - proof of your exploration.": "Achievements become NFTs - proof of your exploration.",
    "Decentralized experiences that truly belong to you.": "Decentralized experiences that truly belong to you.",

    "Innovation Features": "Innovation Features",
    "Progressive sensory unlocking system": "Progressive sensory unlocking system",
    "ASMR-driven audio experiences": "ASMR-driven audio experiences",
    "Component upgrade mechanics": "Component upgrade mechanics",
    "Bubble wrap relaxation module": "Bubble wrap relaxation module",
    "Real-time Starknet news integration": "Real-time Starknet news integration",

    "Technical Innovation": "Technical Innovation",
    "Built on Starknet for scalable blockchain gaming.": "Built on Starknet for scalable blockchain gaming.",
    "Spatial audio and dynamic soundscapes.": "Spatial audio and dynamic soundscapes.",
    "Smart contract-based achievement system.": "Smart contract-based achievement system.",
    "Modular component architecture for endless expansion.": "Modular component architecture for endless expansion.",

    "Roadmap": "Roadmap",
    "Community-driven component development": "Community-driven component development",
    "Advanced behavioral analytics dashboard": "Advanced behavioral analytics dashboard",
    "Multiplayer boredom sessions": "Multiplayer boredom sessions",
    "Integration with DeFi protocols": "Integration with DeFi protocols",
    "Expanding the Boredomverse ecosystem": "Expanding the Boredomverse ecosystem",

    "Ready to Start": "Ready to Start",
    "This is not just a game. It's a mirror.": "This is not just a game. It's a mirror.",
    "Discover what boredom reveals about yourself.": "Discover what boredom reveals about yourself.",
    "Enter the Boredomverse": "Enter the Boredomverse",
    "Scroll down to start falling": "Scroll down to start falling",
  },
  zh: {
    // Header/Navigation
    "Boring Game": "无聊游戏",
    Home: "首页",
    "Debug Contracts": "调试合约",
    "Wallet Not Deployed": "钱包未部署",

    // Home page
    "Welcome to": "欢迎来到",
    "Boring Game Title": "无聊游戏",
    "A simple Starknet based game": "一个基于 Starknet 的简单游戏",
    "Start Game": "开始游戏",
    "Start Game (Skip Check)": "开始游戏 (跳过检查)",
    "Use the": "使用",
    "Debug Contracts Page": "调试合约",
    "page to test smart contract functionality.": "页面来测试智能合约功能。",
    "Start your blockchain game journey, collect points, unlock achievements, and mint NFTs!":
      "开始你的区块链游戏之旅，收集分数、解锁成就、铸造 NFT！",

    // Game page - Main UI
    "Start Game (1 STRK)": "开始游戏 (1 STRK)",
    "Game Guide": "游戏指南",
    "Click Me": "Click me",
    stimulation: "积分",
    "stimulation per second": "积分每秒",

    // Game page - Instructions
    'Click "Start Game" button requires 1 STRK token':
      '点击"开始游戏"按钮需要支付1 STRK代币',
    'Each click on "Click Me!" button earns 1 point':
      '每次点击"Click Me!"按钮获得1积分',
    "Reaching specific thresholds unlocks purchase options:":
      "积分达到特定门槛时会解锁购买选项：",
    "50 points: Moving Icon - Gain 1 point each time it hits browser boundary (max 10)":
      "50分：移动图标 - 每次碰到浏览器边界增加1积分（最多可购买10个）",
    "After buying 10 icons, spend 2000 points to upgrade, upgraded icons give 5 points per collision with sound":
      "购买满10个图标后可以花费2000分升级，升级后每次碰撞增加5分并有音效",
    "150 points: Lofi Music - Play relaxing music":
      "150分：Lofi音乐 - 播放放松音乐",
    "300 points: News Scroll - Display latest StarkNet ecosystem news":
      "300分：新闻滚动 - 显示最新StarkNet生态新闻",
    "500 points: Rain ASMR - Enjoy relaxing rain sounds":
      "500分：雨声ASMR - 享受放松的雨声",
    "800 points: Thunderstorm Effects - Lightning thunderstorm atmosphere":
      "800分：雷雨特效 - 带有闪电的雷雨氛围",
    "Collect seven dragon balls:": "可收集七龙珠：",
    "Each dragon ball requires purchase, first one costs 1000 points, each subsequent one costs 500 more":
      "每颗龙珠需要购买，第一颗1000分，之后每颗价格增加500分",
    "Dragon balls move around screen, gaining 100 points each boundary hit":
      "龙珠会在屏幕上移动，每次碰到边界增加100积分",
    "Collect all seven to summon Toothless dancing in bottom left!":
      "集齐全部七颗可以召唤无牙(Toothless)在左下角跳舞！",
    "After summoning Toothless, spend 5000 points to upgrade dragon balls with sound effects":
      "召唤无牙后可以花费5000分升级龙珠，升级后碰撞有音效",
    "After upgrade, new dragon ball prices start at 5000 points and double each purchase":
      "龙珠升级后，新购买的龙珠价格从5000分开始翻倍增长",
    "Unlock achievements at specific points: 100, 500 and 1000 points":
      "达到特定积分会解锁成就：100, 500和1000分",
    "After unlocking achievements, you can mint commemorative NFTs":
      "解锁成就后可以铸造NFT纪念",

    // Game page - Purchase options
    "Moving Icon": "移动图标",
    "Upgrade Icon": "升级图标",
    "Upgrade Click": "升级点击",
    "Upgraded Click": "已升级点击",
    "Click Up": "点击升级",
    "Click Up Level 2": "点击升级2级",
    "+2 points/click": "+2积分/次点击",
    "+3 points/click": "+3积分/次点击",
    "Upgrade to Level 2": "升级到2级",
    Upgraded: "已升级",
    points: "分",
    score_points: "积分",
    "+5 points/hit": "+5积分/次",
    "Music Player": "音乐播放",
    "News Scroll": "新闻滚动",
    "Rain ASMR": "雨声ASMR",
    Thunderstorm: "雷雨特效",
    "Dragon Ball": "龙珠",

    // Game page - Dragon Ball
    "Dragon Ball Count": "龙珠收集",
    "Dragon Ball Quest Complete": "龙珠任务完成！",
    "You have summoned Toothless! Dragon balls can now be upgraded.":
      "你已召唤了无牙！龙珠现在可以升级了。",
    "Upgrade Dragon Balls (5000 points)": "升级龙珠 (5000分)",
    "Upgrade dragon balls for enhanced effects!": "升级龙珠以获得增强效果！",

    // Game page - Modals
    "STRK Token Authorization Required": "需要STRK代币授权",
    "To start the game, you need to authorize the contract to use your STRK tokens.":
      "要开始游戏，您需要授权合约使用您的STRK代币。",
    "Authorize Amount:": "授权数量：",
    STRK: "STRK",
    Cancel: "取消",
    Authorize: "授权",
    "Authorizing...": "授权中...",
    "Checking authorization...": "检查授权中...",

    // NFT Preview Modal
    "NFT Preview": "NFT预览",
    "Achievement NFT Preview": "成就NFT预览",
    "This is a preview of the NFT you will receive for this achievement.":
      "这是您将为此成就获得的NFT预览。",
    "Mint NFT": "铸造NFT",
    "Minting...": "铸造中...",

    // Achievements
    "I have seen a dragon": "我见过龙",
    "Collect all 7 dragon balls": "集齐7颗龙珠",
    "Bubble Master": "气泡大师",
    "Bubble God": "气泡之神",
    "Complete all 5 levels of Bubble Wrap game":
      "完成气泡包装纸游戏的全部5个级别",

    // Bubble Wrap Game
    "Bubble Wrap": "气泡包装纸",
    "Bubble Wrap Game": "气泡包装纸游戏",
    Level: "级别",
    popped: "已爆破",
    bubbles: "个气泡",
    Upgrade: "升级",
    "Level Complete": "级别完成",
    "You completed level": "你完成了级别",
    "All levels completed! NFT achievement unlocked!":
      "全部级别完成！NFT成就已解锁！",
    "Retry Level": "重试级别",
    "Next Level": "下一级别",
    Progress: "进度",
    Reset: "重置",
    "Pop all": "爆破全部",
    "bubbles in": "个气泡，限时",
    seconds: "秒",
    "Start Level": "开始级别",
    "Challenge Mode": "挑战模式",
    "Challenge Complete": "挑战完成",
    "Your time": "你的用时",
    "Retry Challenge": "重试挑战",
    "Exit Challenge": "退出挑战",

    // Unlocked achievements section
    "Unlocked Achievements": "解锁的成就",
    Full: "已满",
    "Sound Effect": "有音效",
    "Level completed! You earned": "级别完成！你获得了",
    reward_points: "点数",
    "All levels completed! You earned": "所有级别已完成！你获得了",
    "bonus points": "额外奖励点数",

    // Common buttons
    Close: "关闭",
    Continue: "继续",
    "Achievement unlocked!": "成就解锁！",

    // Home page story sections
    "Digital Overwhelm Era": "数字过载时代",
    "We live in an era of constant stimulation and fragmented attention.": "我们生活在一个持续刺激和注意力碎片化的时代。",
    "Social media, notifications, and endless content consume our mental bandwidth.": "社交媒体、通知推送和无尽的内容消耗着我们的心智带宽。",
    "When did we lose the ability to simply... exist?": "我们何时失去了简单存在的能力？",

    "The Problem with Fun": "娱乐的问题",
    "Traditional games demand constant engagement and dopamine hits.": "传统游戏要求持续的参与度和多巴胺刺激。",
    "They exploit our psychology rather than nurture our wellbeing.": "它们利用我们的心理而非滋养我们的福祉。",
    "What if games could be meditative instead of addictive?": "如果游戏可以是冥想式的而非成瘾性的会怎样？",

    "Our Solution": "我们的解决方案",
    "Boring Game flips the script on digital interaction.": "无聊游戏颠覆了数字交互的模式。",
    "Start with silence, discover meaning in repetition.": "从静默开始，在重复中发现意义。",
    "Experience the journey from minimal to maximal stimulation.": "体验从极简到极致刺激的旅程。",

    "Why Blockchain": "为什么选择区块链",
    "Your journey deserves permanent recognition.": "你的旅程值得永久的认可。",
    "Achievements become NFTs - proof of your exploration.": "成就变成NFT——探索之旅的证明。",
    "Decentralized experiences that truly belong to you.": "真正属于你的去中心化体验。",

    "Innovation Features": "创新功能",
    "Progressive sensory unlocking system": "渐进式感官解锁系统",
    "ASMR-driven audio experiences": "ASMR驱动的音频体验",
    "Component upgrade mechanics": "组件升级机制",
    "Bubble wrap relaxation module": "气泡膜放松模块",
    "Real-time Starknet news integration": "实时Starknet新闻集成",

    "Technical Innovation": "技术创新",
    "Built on Starknet for scalable blockchain gaming.": "基于Starknet构建的可扩展区块链游戏。",
    "Spatial audio and dynamic soundscapes.": "空间音频和动态音景。",
    "Smart contract-based achievement system.": "基于智能合约的成就系统。",
    "Modular component architecture for endless expansion.": "模块化组件架构，支持无限扩展。",

    "Roadmap": "路线图",
    "Community-driven component development": "社区驱动的组件开发",
    "Advanced behavioral analytics dashboard": "高级行为分析仪表板",
    "Multiplayer boredom sessions": "多人无聊会话",
    "Integration with DeFi protocols": "与DeFi协议集成",
    "Expanding the Boredomverse ecosystem": "扩展无聊宇宙生态系统",

    "Ready to Start": "准备开始",
    "This is not just a game. It's a mirror.": "这不仅仅是一个游戏。它是一面镜子。",
    "Discover what boredom reveals about yourself.": "发现无聊揭示的真实自我。",
    "Enter the Boredomverse": "进入无聊宇宙",
    "Scroll down to start falling": "向下滚动开始坠落",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
