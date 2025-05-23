# 🎮 无聊游戏

<h4 align="center">
  <a href="#">游戏试玩</a> |
  <a href="#">文档</a> |
  <a href="#">Discord</a>
</h4>

🧪 一款基于Starknet区块链构建的实验性点击游戏，探索在平凡互动中寻找意义的悖论。从一个"无聊"的点击游戏开始，逐渐演变为丰富的多感官体验，挑战我们与数字刺激和成就感的关系。

⚙️ 使用 NextJS、Starknet.js、Scarb、Starknet-React、Starknet Foundry 构建。

## 🌟 游戏哲学

**无聊游戏**不仅仅是一款点击游戏——它是一个伪装成娱乐的社会实验。核心哲学围绕几个关键概念：

### 🧘 **通过简单减压**
- 从纯粹的冥想式点击开始
- 逐步引入ASMR元素（雨声、Lo-fi音乐、环境音效）
- 创造一个数字禅意花园，让重复动作变得具有治疗性

### 🔍 **渐进式发现**
- 隐藏的彩蛋和成就奖励好奇的玩家
- 每个里程碑解锁新的感官层次和互动元素
- 游戏与你一起成长，在表面简单下揭示复杂性

### 🌊 **感官过载探索**
- 有意从极简主义推向最大刺激
- 玩家体验从数字静默到感官饱和的完整光谱
- 问题：何时增强变成压倒性？你的舒适区在哪里？

### 🎭 **社会实验机制**
- 匿名收集玩家行为模式数据
- 玩家与"无聊"内容互动多长时间？
- 什么元素推动留存vs放弃？
- 成就心理学：NFT奖励是否改变行为？

### 💎 **区块链成就系统**
- 你探索旅程的永久NFT记录
- 成就成为你体验的可收藏证明
- 社区方面：比较和分享你的感官容忍度

### 🤔 **无聊悖论**
游戏故意拥抱"无聊"概念来探索更深层的问题：
- 重复的数字动作能否成为冥想而非无意识？
- 我们如何定义数字空间中的"有意义"互动？
- 当我们移除传统游戏目标时会发生什么？

---

## 🎯 游戏特性

- ✅ **渐进式感官层次**：从静默点击到完整ASMR沉浸
- 🎵 **动态音频体验**：Lo-fi音乐、雨声效果、空间音频雷暴
- 🐉 **龙珠收集**：增加RPG式进展的神秘元素
- 🏆 **NFT成就系统**：将你的里程碑铸造为永久区块链记录
- 📰 **实时新闻集成**：在游戏时保持与Starknet生态系统的连接
- ⚡ **移动元素**：弹跳图标和动画精灵创造视觉刺激
- 🎨 **响应式设计**：所有设备上的无缝体验
- 🔐 **钱包集成**：连接各种Starknet钱包提供商

![Debug Contracts tab](./packages/nextjs/public/debug-image.png)

## 0. 系统要求

开始之前，你需要安装以下工具：

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) 或 [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## 1. 安装开发工具

你可以原生安装开发工具或使用Dev Containers。

### 选项1：原生安装开发工具

#### 1.1 Starkup

安装所有Starknet开发必需品的工具。[Starkup](https://github.com/software-mansion/starkup) 将安装最新稳定版本：

- [Scarb](https://docs.swmansion.com/scarb/) - Cairo包管理器和构建工具链
- [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/index.html) - 在Starknet上测试的开发工具链
- [asdf](https://asdf-vm.com/guide/getting-started.html) - 版本管理器，轻松切换工具版本
- [Cairo 1.0 扩展](https://marketplace.visualstudio.com/items?itemName=starkware.cairo1) for VSCode - 语法高亮和语言支持

>目前，[starknet-devnet](https://0xspaceshard.github.io/starknet-devnet/) 不被 `starkup` 支持，需要单独安装（见下面说明）。

要安装 `starkup`，运行以下命令：

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.sh | sh
```

#### 1.2 克隆和设置项目

打开终端并运行以下命令：

```bash
git clone https://github.com/your-username/boring-game.git
cd boring-game
yarn install
```

#### 1.3 使用ASDF快速安装Starknet Devnet

- 如果你还没有安装 [asdf](https://asdf-vm.com/guide/getting-started.html)，请先安装。它让你能够轻松管理其他依赖项。

我们快完成了，现在需要安装 `Starknet Devnet`。首先在 `asdf` 上注册Starknet Devnet插件。

```bash
asdf plugin add starknet-devnet
```

现在打开你的项目文件夹。由于我们在 `.tool-versions` 文件中列出了所需的依赖项，只需在根文件夹中运行以下命令即可安装 `starknet-devnet`（和其他依赖项如 `scarb` 和 `starknet-foundry`），版本为 `.tool-versions` 文件中指定的版本（不一定是最新版本）：

```bash
asdf install
```

现在你已经准备好开始你的无聊之旅了！🎮

#### 1.4 故障排除

- 如果在使用 `starkup` 或 `asdf` 后遇到版本错误，你可以尝试手动安装依赖项。查看下面的详细信息。

<details>

#### Scarb版本

为确保无聊游戏正常运行，你的 `Scarb` 版本必须是 `2.11.4`。要做到这一点，首先检查Scarb版本：

```sh
scarb --version
```

如果你的 `Scarb` 版本不是 `2.11.4`，你需要安装它。如果你已经通过 `starkup` 安装了 `Scarb`，可以用以下命令设置这个特定版本：

```sh
asdf install scarb 2.11.4 && asdf set scarb 2.11.4
```

否则，你可以按照 [说明](https://docs.swmansion.com/scarb/download.html#install-via-asdf) 安装Scarb `2.11.4`。

#### Starknet Foundry版本

为确保无聊游戏测试正常运行，你的 `Starknet Foundry` 版本必须是 `0.41.0`。要做到这一点，首先检查你的 `Starknet Foundry` 版本：

```sh
snforge --version
```

如果你的 `Starknet Foundry` 版本不是 `0.41.0`，你需要安装它。如果你已经通过 `starkup` 安装了 `Starknet Foundry`，可以用以下命令设置这个特定版本：

```sh
asdf install starknet-foundry 0.41.0 && asdf set starknet-foundry 0.41.0
```

否则，你可以按照 [说明](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#installation-via-asdf) 安装Starknet Foundry `0.41.0`。

#### Starknet-devnet版本

为确保无聊游戏正常运行，你的 `starknet-devnet` 版本必须是 `0.4.0`。要做到这一点，首先检查你的 `starknet-devnet` 版本：

```sh
starknet-devnet --version
```

如果你的 `starknet-devnet` 版本不是 `0.4.0`，你需要安装它。

- 通过 `asdf` 安装starknet-devnet `0.4.0`（[说明](https://github.com/gianalarcon/asdf-starknet-devnet/blob/main/README.md)）。

</details>

### 选项2. Dev Containers

#### 2.1 安装Docker Desktop

作为本地安装工具（Scarb、Starknet Foundry、Starknet Devnet）的替代方案，你可以使用Docker，这是 `Windows` 用户的推荐选项。你需要做的是：

1. 安装 [Docker Desktop](https://www.docker.com/get-started/)
2. 安装 [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. 克隆项目文件夹。

- `git clone https://github.com/your-username/boring-game.git`
- `cd boring-game`

4. 检查你的项目文件夹是否包含 `devcontainer.json` 文件。此文件用于设置环境：

- 配置使用 `starknetfoundation/starknet-dev:2.11.4` 镜像。
- 这包括所有预安装的必需工具，如Scarb、Starknet Foundry、Starknet Devnet和其他依赖项。

#### 2.2 Docker设置入门

要开始使用基于Docker的设置：

1. 在 **Visual Studio Code** 中打开项目。
2. 选择 **"在容器中重新打开"**。
3. 如果需要重建容器，打开命令面板（**查看 -> 命令面板**）并选择：
   - **Dev Containers: 重建并在容器中重新打开**

> 进入容器后，你可以开始使用所有预配置的工具和依赖项。

现在你已经准备好体验无聊了！！！

## 兼容版本

- Starknet-devnet - v0.4.0
- Scarb - v2.11.4
- Snforge - v0.41.0
- Cairo - v2.11.4
- Rpc - v0.8.0

## 🚀 快速开始：本地运行无聊游戏

要开始使用无聊游戏，请按以下步骤操作：

1. 确保你已完成上述安装步骤。

2. 在第一个终端中运行本地Starknet网络：

```bash
yarn chain
```

> 要运行分叉：`yarn chain --fork-network <URL> [--fork-block <BLOCK_NUMBER>]`

此命令使用Devnet启动本地Starknet网络。网络在你的本地机器上运行，可用于测试和开发。你可以在 `scaffold.config.ts` 中自定义nextjs应用的网络配置。

3. 在第二个终端中，部署游戏合约：

```bash
yarn deploy
```

此命令将无聊游戏智能合约部署到本地网络。合约位于 `packages/snfoundry/contracts/src` 中，处理分数跟踪、成就解锁和NFT铸造。`yarn deploy` 命令使用位于 `packages/snfoundry/scripts-ts/deploy.ts` 的部署脚本。

默认情况下，无聊游戏从 `starknet-devnet` 取第一个预充值账户作为部署者地址。

4. 在第三个终端中，启动你的游戏界面：

```bash
yarn start
```

访问你的游戏：`http://localhost:3000`。你可以使用 `Debug Contracts` 页面与智能合约交互，并在主游戏页面开始你的无聊之旅。

5. 检查你的环境变量。我们有一个 `yarn postinstall` 脚本，它将基于提供的 `.env.example` 文件创建 `.env` 文件。如果环境变量不存在，你可以从 `.env.example` 手动创建 `.env` 文件来运行应用！

> ⚠️ **重要**：永远不要将你的私钥或敏感环境变量提交到版本控制。`.env` 文件默认包含在 `.gitignore` 中，但在推送更改前请务必仔细检查。

## 🌐 部署到Sepolia测试网

<details>

1. 确保你已经克隆了这个仓库并安装了依赖项。

2. 准备你的环境变量。

找到 `packages/snfoundry/.env` 文件，用你自己的钱包账户合约地址和私钥填写与Sepolia测试网相关的环境变量。找到 `packages/nextjs/.env` 文件，填写与Sepolia测试网rpc url相关的环境变量。

3. 将你的默认网络更改为Sepolia测试网。

找到 `packages/nextjs/scaffold.config.ts` 文件，将 `targetNetworks` 更改为 `[chains.sepolia]`。

4. 获取一些测试网代币。

你需要获取一些 `STRK` Sepolia代币来将合约部署到Sepolia测试网并玩游戏（开始需要1 STRK）。

> 一些流行的水龙头有 [Starknet Faucet](https://starknet-faucet.vercel.app/) 和 [Blastapi Starknet Sepolia STRK](https://blastapi.io/faucets/starknet-sepolia-strk)

4. 打开终端，将游戏合约部署到Sepolia测试网：

```bash
yarn deploy --network sepolia
```

5. 在第二个终端中，启动你的游戏界面：

```bash
yarn start
```

访问你的游戏：`http://localhost:3000`。现在你可以在Sepolia测试网上玩无聊游戏并铸造真正的NFT！

</details>

## 网络配置

<details>

默认情况下，网络设置集中在 `scaffold.config.ts` 中，所有RPC URL都在 `rpcProviderUrl` 对象中定义。我们强烈建议使用环境变量来配置网络。

**如何更改网络：**

- 更新 `scaffold.config.ts` 中的 `targetNetworks` 数组（第一个网络是主要目标）
- 确保每个网络在 `rpcProviderUrl` 对象中都有相应的RPC URL

### 必需的环境变量

在你的 `.env` 文件中设置这些：

- `NEXT_PUBLIC_DEVNET_PROVIDER_URL`
- `NEXT_PUBLIC_SEPOLIA_PROVIDER_URL`
- `NEXT_PUBLIC_MAINNET_PROVIDER_URL`

</details>

## 🎮 如何游玩

1. **连接你的钱包**：点击右上角的钱包连接按钮
2. **开始游戏**：支付1 STRK代币开始你的无聊之旅
3. **点击和探索**：开始点击"点我"按钮赚取积分
4. **解锁功能**：达到积分阈值解锁新的感官元素：
   - 50积分：具有碰撞物理的移动图标
   - 150积分：环境专注的Lo-fi音乐播放器
   - 300积分：Starknet更新的实时新闻滚动
   - 500积分：更深层放松的雨声ASMR
   - 800积分：完全沉浸的雷暴效果
   - 1000+积分：龙珠收集小游戏
5. **收集成就**：解锁特殊里程碑并将其铸造为NFT
6. **体验旅程**：从静默到感官过载——找到你的完美平衡

## 🛠️ 开发命令

<details>

为无聊游戏开发者的命令：

| 命令              | 描述                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| format:check     | （只读）批量检查nextjs和snfoundry代码库的格式不一致性 |
| next:check-types | 编译typescript项目                                                                 |
| next:lint        | 运行next lint                                                                            |
| prepare          | 安装husky的git hooks                                                                 |

### 智能合约命令

| 命令         | 描述                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| compile         | 编译合约。                                                                 |
| test            | 运行snfoundry测试                                                                |
| chain           | 启动本地区块链网络。                                                                |
| deploy          | 将合约部署到配置的网络，丢弃之前的部署。         |
| deploy:no-reset | 将合约部署到配置的网络，不丢弃之前的部署。 |
| verify          | 使用Walnut验证智能合约                                                  |

### 前端命令

| 命令     | 描述                                  |
| ----------- | -------------------------------------------- |
| start       | 启动游戏前端服务器             |
| test:nextjs | 运行nextjs测试                        |
| vercel      | 将应用部署到vercel                        |
| vercel:yolo | 强制将应用部署到vercel（忽略错误） |

## **自定义指南**

- 编辑 `packages/snfoundry/contracts/src` 中的游戏智能合约 `BoringGame.cairo`
- 修改 `packages/nextjs/app/page.tsx` 和 `packages/nextjs/app/game/page.tsx` 中的游戏界面
- 自定义 `packages/snfoundry/scripts-ts/deploy.ts` 中的部署脚本
- 在 `packages/snfoundry/contracts/src/test` 中添加新测试
- 用 `yarn test` 运行测试
- 前端单元测试：`yarn test:nextjs`

</details>

## 🧪 实验

无聊游戏在web3空间中作为独特的社会实验：

### 研究问题
- 用户如何与"无目的"区块链应用互动？
- 游戏化在加密货币采用中扮演什么角色？
- 重复的数字动作能否起到治疗作用？
- NFT奖励的承诺如何影响行为？
- 在什么点上感官增强变得压倒性？

### 数据收集（匿名）
- 会话持续时间和回访率模式
- 功能解锁进展速度
- 感官偏好聚类
- 成就完成率
- NFT铸造行为

### 社区方面
- 在社交媒体上分享你的感官过载容忍度
- 比较成就NFT收藏
- 参与关于数字健康的社区讨论
- 通过简单游玩为实验做出贡献

## 🤝 贡献

我们欢迎对无聊游戏的贡献！无论你想要：
- 添加新的感官元素或ASMR功能
- 改进成就系统
- 增强智能合约功能
- 为社会实验研究做出贡献
- 修复bug或提高性能

请随时提交问题和拉取请求。

## 📜 许可证

MIT许可证 - 随意使用、修改和分发。

---

## 🎭 最后的思考

在一个痴迷于参与度指标和多巴胺冲击的世界里，无聊游戏提出了一个简单的问题：如果我们放慢速度会怎样？如果我们在平凡中找到意义会怎样？如果最深刻的数字体验只是...与无聊共存会怎样？

今天就开始你的无聊之旅。你可能会对你发现的东西感到惊讶。

**记住：游戏有多无聊或多令人兴奋，完全取决于你如何看待它。** 🌟 