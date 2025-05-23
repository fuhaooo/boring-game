# BoringGame 合约部署指南

这个包含了BoringGame游戏的智能合约和部署脚本。

## 前置条件

- Node.js 16+
- Yarn
- Scarb (Cairo编译器)
- Starknet账户（测试网或主网）

## 环境设置

1. 创建或编辑 `.env` 文件，设置以下环境变量：

```
STARKNET_ACCOUNT_ADDRESS=你的StarkNet账户地址
STARKNET_PRIVATE_KEY=你的StarkNet账户私钥
STARKNET_PROVIDER_URL=https://starknet-sepolia.infura.io/v3/你的Infura项目ID（可选）
```

## 编译合约

```bash
yarn compile
```

这会使用Scarb编译合约并生成Sierra和CASM文件。

## 部署合约

有两种方式可以部署合约：

### 方式1：使用标准部署脚本（推荐用于生产环境）

```bash
# 部署到本地开发网络
yarn deploy:boring-game

# 部署到Sepolia测试网
yarn deploy:boring-game:sepolia
```

### 方式2：使用直接部署脚本（如果标准部署失败）

如果标准部署脚本遇到问题，可以使用我们的直接部署脚本：

```bash
yarn deploy:boring-game:sepolia-direct
```

这个脚本使用了更简单的逻辑，直接使用Starknet.js的API进行部署。

## 🚀 快速部署（当前遇到错误的解决方案）

我们建议使用以下步骤解决当前的部署错误：

1. 首先确保编译合约：
   ```bash
   cd packages/snfoundry && yarn compile
   ```

2. 打开文件 `packages/snfoundry/scripts-ts/deploy-contract.ts`，找到第160行左右的以下代码：
   ```typescript
   try {
     await deployer.getContractVersion(deployer.address);
   } catch (e) {
     // ...
   }
   ```

3. 将其修改为：
   ```typescript
   try {
     await provider.getClassHashAt(deployer.address);
     console.log(yellow("Deployer account found at: "), deployer.address);
   } catch (e) {
     if (e.toString().includes("Contract not found") || e.toString().includes("Invalid contract address")) {
       const errorMessage = `The wallet you're using to deploy the contract is not deployed in the ${networkName} network.`;
       console.error(red(errorMessage));
       throw new Error(errorMessage);
     } else {
       console.error(red("Error checking deployer account: "), e);
       throw e;
     }
   }
   ```

4. 保存文件后，再次尝试部署：
   ```bash
   cd packages/snfoundry && yarn deploy:boring-game:sepolia
   ```

5. 如果仍然有问题，可以使用我们提供的辅助脚本创建和运行：
   ```bash
   cd packages/snfoundry
   # 创建sepolia-deploy.sh脚本
   echo '#!/bin/bash
   export STARKNET_ACCOUNT_ADDRESS="你的地址"
   export STARKNET_PRIVATE_KEY="你的私钥"
   npx ts-node scripts-ts/deploy-boring-game-sepolia.ts' > sepolia-deploy.sh
   # 添加执行权限
   chmod +x sepolia-deploy.sh
   # 运行脚本
   ./sepolia-deploy.sh
   ```

## 部署后信息

成功部署后，将在`deployments`目录下生成一个JSON文件（例如`sepolia_latest.json`），包含以下信息：

- 合约地址
- 类哈希
- 交易哈希
- 部署时间戳

## 故障排除

### 部署报错：`deployer.getContractVersion is not a function`

这是由于Starknet.js版本不兼容导致的。请使用上面的"快速部署"部分中的解决方案。

### 找不到编译后的合约文件

确保已运行`yarn compile`命令，并检查`contracts/target/dev`目录是否包含以下文件：
- `BoringGame.contract_class.json`
- `BoringGame.compiled_contract_class.json`

### 账户未部署错误

确保你的Starknet账户已经部署到相应的网络，并且你提供了正确的账户地址和私钥。

## 合约功能

BoringGame合约实现了以下功能：

1. 游戏启动费用(1 STRK)转账到指定钱包地址
2. 记录玩家分数
3. 解锁成就
4. 铸造NFT（当集齐七颗龙珠时）

## NFT信息

Dragon NFT的元数据已上传到IPFS：
- IPFS URL: `ipfs://bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru`
- 网关访问链接: `https://blush-rainy-constrictor-734.mypinata.cloud/ipfs/bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru`

## 游戏交互

玩家可以通过以下方式与合约交互：

1. **开始游戏**：
   - 调用`start_game()`函数
   - 需要支付1 STRK到指定钱包地址：`0x011bf31D662FF2638447c5BF401f97b6CaFF5DAbcBEE772dbcEDFC6319b66Bba`

2. **记录分数**：
   - 调用`record_score(score: u256)`函数
   - 只有当新分数高于历史最高分时才会更新

3. **铸造NFT**：
   - 当玩家集齐7颗龙珠并看到"无牙"时，可以铸造"我见过龙"成就NFT
   - 调用`mint_achievement_nft(4)`函数（4是龙珠成就的ID）
   - 每个成就每个玩家只能铸造一次

## 成就

| ID | 名称 | 描述 | 要求 | NFT链接 |
|----|------|------|------|---------|
| 1 | Beginner | 达到100分 | 100积分 | - |
| 2 | Intermediate | 达到500分 | 500积分 | - |
| 3 | Advanced | 达到1000分 | 1000积分 | - |
| 4 | I Have Seen Dragon | 集齐七颗龙珠 | 集齐全部七颗龙珠 | [龙珠NFT](https://blush-rainy-constrictor-734.mypinata.cloud/ipfs/bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru) |

## 测试

运行测试：
```bash
yarn test
``` 
 