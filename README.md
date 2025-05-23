# 🎮 Boring Game

<h4 align="center">
  <a href="#">Play Demo</a> |
  <a href="#">Documentation</a> |
  <a href="#">Discord</a>
</h4>

🧪 An experimental tap game built on Starknet blockchain that explores the paradox of finding meaning in mundane interactions. What starts as a "boring" clicking game gradually evolves into a rich, multi-sensory experience that challenges our relationship with digital stimulation and achievement.

⚙️ Built using NextJS, Starknet.js, Scarb, Starknet-React, Starknet Foundry.

## 🌟 Game Philosophy

**Boring Game** is more than just a tap game—it's a social experiment disguised as entertainment. The core philosophy revolves around several key concepts:

### 🧘 **Stress Relief Through Simplicity**
- Start with pure, meditative clicking
- Gradual introduction of ASMR elements (rain sounds, lo-fi music, ambient effects)
- Create a digital zen garden where repetitive actions become therapeutic

### 🔍 **Progressive Discovery**
- Hidden easter eggs and achievements reward curious players
- Each milestone unlocks new sensory layers and interactive elements
- The game grows with you, revealing complexity beneath apparent simplicity

### 🌊 **Sensory Overload Exploration**
- Intentionally pushes boundaries from minimalism to maximum stimulation
- Players experience the full spectrum from digital silence to sensory saturation
- Questions: When does enhancement become overwhelming? Where's your comfort zone?

### 🎭 **Social Experiment Mechanics**
- Anonymous data collection on player behavior patterns
- How long do players engage with "boring" content?
- What elements drive retention vs. abandonment?
- Achievement psychology: Do NFT rewards change behavior?

### 💎 **Blockchain Achievement System**
- Permanent NFT records of your exploration journey
- Achievements become collectible proof of your experience
- Community aspect: Compare and share your sensory tolerance levels

### 🤔 **The Boredom Paradox**
The game deliberately embraces the concept of "boredom" to explore deeper questions:
- Can repetitive digital actions be meditative rather than mindless?
- How do we define "meaningful" interaction in digital spaces?
- What happens when we remove traditional game objectives and just... exist?

---

## 🎯 Game Features

- ✅ **Progressive Sensory Layers**: From silent clicks to full ASMR immersion
- 🎵 **Dynamic Audio Experience**: Lo-fi music, rain effects, thunderstorms with spatial audio
- 🐉 **Dragon Ball Collection**: Mystical elements that add RPG-like progression
- 🏆 **NFT Achievement System**: Mint your milestones as permanent blockchain records
- 📰 **Real-time News Integration**: Stay connected to the Starknet ecosystem while you play
- ⚡ **Moving Elements**: Bouncing icons and animated sprites create visual stimulation
- 🎨 **Responsive Design**: Seamless experience across all devices
- 🔐 **Wallet Integration**: Connect with various Starknet wallet providers

![Debug Contracts tab](./packages/nextjs/public/debug-image.png)

## 0. Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## 1. Install developer tools

You can install the developer tools natively or use Dev Containers.

### Option 1: Natively install developer tools

#### 1.1 Starkup

Tool for installing all the Starknet essentials for development. [Starkup](https://github.com/software-mansion/starkup) will install the latest stable versions of:

- [Scarb](https://docs.swmansion.com/scarb/) - Cairo package manager and build toolchain
- [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/index.html) - Development toolchain for testing on Starknet
- [asdf](https://asdf-vm.com/guide/getting-started.html) - Version manager to easily switch between tool versions
- [Cairo 1.0 extension](https://marketplace.visualstudio.com/items?itemName=starkware.cairo1) for VSCode - Syntax highlighting and language support

>Currently, [starknet-devnet](https://0xspaceshard.github.io/starknet-devnet/) is not supported by `starkup` and needs to be installed separately (see instructions below).

To install `starkup`, run the following command:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.sh | sh
```

#### 1.2 Clone and setup the project

Open a terminal and run the following commands:

```bash
git clone https://github.com/your-username/boring-game.git
cd boring-game
yarn install
```

#### 1.3 Install Starknet Devnet using ASDF Fast Install

- Install [asdf](https://asdf-vm.com/guide/getting-started.html) in case you don't have it installed yet. It allows you to manage the other dependencies with ease.

We are almost done, now we need to install `Starknet Devnet`. First let's register the Starknet Devnet plugin on `asdf`.

```bash
asdf plugin add starknet-devnet
```

Now open your project folder. Since we have the required dependencies listed on a `.tool-versions` file, simply running the below command on the root folder will install `starknet-devnet`(and other dependencies such as `scarb` and `starknet-foundry`) with the version SPECIFIED on the `.tool-versions` file (not necessarily the latest):

```bash
asdf install
```

Now you are ready to start your boring journey! 🎮

#### 1.4 Troubleshooting

- If you run into version errors after using `starkup` or `asdf`, you can try to install the dependencies manually. Check the details below.

<details>

#### Scarb version

To ensure the proper functioning of Boring Game, your `Scarb` version must be `2.11.4`. To accomplish this, first check Scarb version:

```sh
scarb --version
```

If your `Scarb` version is not `2.11.4`, you need to install it. If you already have installed `Scarb` via `starkup`, you can setup this specific version with the following command:

```sh
asdf install scarb 2.11.4 && asdf set scarb 2.11.4
```

Otherwise, you can install Scarb `2.11.4` following the [instructions](https://docs.swmansion.com/scarb/download.html#install-via-asdf).

#### Starknet Foundry version

To ensure the proper functioning of the tests on Boring Game, your `Starknet Foundry` version must be `0.41.0`. To accomplish this, first check your `Starknet Foundry` version:

```sh
snforge --version
```

If your `Starknet Foundry` version is not `0.41.0`, you need to install it. If you already have installed `Starknet Foundry` via `starkup`, you can setup this specific version with the following command:

```sh
asdf install starknet-foundry 0.41.0 && asdf set starknet-foundry 0.41.0
```

Otherwise, you can install Starknet Foundry `0.41.0` following the [instructions](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#installation-via-asdf).

#### Starknet-devnet version

To ensure the proper functioning of Boring Game, your `starknet-devnet` version must be `0.4.0`. To accomplish this, first check your `starknet-devnet` version:

```sh
starknet-devnet --version
```

If your `starknet-devnet` version is not `0.4.0`, you need to install it.

- Install starknet-devnet `0.4.0` via `asdf` ([instructions](https://github.com/gianalarcon/asdf-starknet-devnet/blob/main/README.md)).

</details>

### Option 2. Dev Containers

#### 2.1 Install Docker Desktop

As an alternative to installing the tools locally (Scarb, Starknet Foundry, Starknet Devnet), you can use Docker, this is the recommended option for `Windows` users. Here's what you need to do:

1. Install [Docker Desktop](https://www.docker.com/get-started/)
2. Install [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Clone the project folder.

- `git clone https://github.com/your-username/boring-game.git`
- `cd boring-game`

4. Check your project folder contains a `devcontainer.json` file. This file is used to set up the environment:

- The configuration uses the `starknetfoundation/starknet-dev:2.11.4` image.
- This includes all required tools pre-installed, such as Scarb, Starknet Foundry, Starknet Devnet and other dependencies.

#### 2.2 Getting Started with Docker Setup

To start using the Docker-based setup:

1. Open the project in **Visual Studio Code**.
2. Select **"Reopen in Container"**.
3. If you need to rebuild the container, open the Command Palette (**View -> Command Palette**) and choose:
   - **Dev Containers: Rebuild and Reopen in Container**

> Once inside the container, you can start working with all the tools and dependencies pre-configured.

Now you are ready to experience the boredom!!!

## Compatible versions

- Starknet-devnet - v0.4.0
- Scarb - v2.11.4
- Snforge - v0.41.0
- Cairo - v2.11.4
- Rpc - v0.8.0

## 🚀 Quick Start: Running Boring Game Locally

To get started with Boring Game, follow the steps below:

1. Make sure you've completed the installation steps above.

2. Run a local Starknet network in the first terminal:

```bash
yarn chain
```

> To run a fork : `yarn chain --fork-network <URL> [--fork-block <BLOCK_NUMBER>]`

This command starts a local Starknet network using Devnet. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `scaffold.config.ts` for your nextjs app.

3. On a second terminal, deploy the game contract:

```bash
yarn deploy
```

This command deploys the Boring Game smart contract to the local network. The contract is located in `packages/snfoundry/contracts/src` and handles score tracking, achievement unlocking, and NFT minting. The `yarn deploy` command uses the deploy script located in `packages/snfoundry/scripts-ts/deploy.ts`.

By default, Boring Game takes the first prefunded account from `starknet-devnet` as the deployer address.

4. On a third terminal, start your game interface:

```bash
yarn start
```

Visit your game at: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page, and start your boring journey on the main game page.

5. Check your environment variables. We have a `yarn postinstall` script that will create `.env` files based on the `.env.example` files provided. If the environment variables don't exist, you can manually create a `.env` file from the `.env.example` to get the app running!

> ⚠️ **IMPORTANT**: Never commit your private keys or sensitive environment variables to version control. The `.env` files are included in `.gitignore` by default, but always double-check before pushing your changes.

## 🌐 Deploying to Sepolia Testnet

<details>

1. Make sure you already cloned this repo and installed dependencies.

2. Prepare your environment variables.

Find the `packages/snfoundry/.env` file and fill the env variables related to Sepolia testnet with your own wallet account contract address and private key. Find the `packages/nextjs/.env` file and fill the env variable related to Sepolia testnet rpc url.

3. Change your default network to Sepolia testnet.

Find the `packages/nextjs/scaffold.config.ts` file and change the `targetNetworks` to `[chains.sepolia]`.

4. Get some testnet tokens.

You will need to get some `STRK` Sepolia tokens to deploy your contract to Sepolia testnet and to play the game (1 STRK required to start).

> Some popular faucets are [Starknet Faucet](https://starknet-faucet.vercel.app/) and [Blastapi Starknet Sepolia STRK](https://blastapi.io/faucets/starknet-sepolia-strk)

4. Open a terminal, deploy the game contract to Sepolia testnet:

```bash
yarn deploy --network sepolia
```

5. On a second terminal, start your game interface:

```bash
yarn start
```

Visit your game at: `http://localhost:3000`. You can now play Boring Game on Sepolia testnet and mint real NFTs!

</details>

## Network Configuration

<details>

By default, Network settings are centralized in `scaffold.config.ts` with all RPC URLs defined in the `rpcProviderUrl` object. We strongly recommend using environment variables to configure the networks.

**How to Change Networks:**

- Update the `targetNetworks` array in `scaffold.config.ts` (first network is the primary target)
- Ensure each network has a corresponding RPC URL in the `rpcProviderUrl` object

### Required Environment Variables

Set these in your `.env` file:

- `NEXT_PUBLIC_DEVNET_PROVIDER_URL`
- `NEXT_PUBLIC_SEPOLIA_PROVIDER_URL`
- `NEXT_PUBLIC_MAINNET_PROVIDER_URL`

</details>

## 🎮 How to Play

1. **Connect Your Wallet**: Click on the wallet connection button in the top-right corner
2. **Start the Game**: Pay 1 STRK token to begin your boring journey
3. **Click and Explore**: Start clicking the "Click Me" button to earn points
4. **Unlock Features**: Reach point thresholds to unlock new sensory elements:
   - 50 points: Moving Icons with collision physics
   - 150 points: Lo-fi Music Player for ambient focus
   - 300 points: Live News Scroller with Starknet updates
   - 500 points: Rain ASMR for deeper relaxation
   - 800 points: Thunderstorm Effects for full immersion
   - 1000+ points: Dragon Ball Collection mini-game
5. **Collect Achievements**: Unlock special milestones and mint them as NFTs
6. **Experience the Journey**: From silence to sensory overload—find your perfect balance

## 🛠️ Development Commands

<details>

Commands for developers working on Boring Game:

| Command          | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| format:check     | (Read only) Batch checks for format inconsistencies for the nextjs and snfoundry codebase |
| next:check-types | Compile typescript project                                                                 |
| next:lint        | Runs next lint                                                                            |
| prepare          | Install husky's git hooks                                                                 |

### Smart Contract Commands

| Command         | Description                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| compile         | Compiles contracts.                                                                 |
| test            | Runs snfoundry tests                                                                |
| chain           | Starts the local blockchain network.                                                |
| deploy          | Deploys contract to the configured network discarding previous deployments.         |
| deploy:no-reset | Deploys contract to the configured network without discarding previous deployments. |
| verify          | Verify Smart Contracts with Walnut                                                  |

### Frontend Commands

| Command     | Description                                  |
| ----------- | -------------------------------------------- |
| start       | Starts the game frontend server             |
| test:nextjs | Runs the nextjs tests                        |
| vercel      | Deploys app to vercel                        |
| vercel:yolo | Force deploy app to vercel (ignoring errors) |

## **Customization Guide**

- Edit the game smart contract `BoringGame.cairo` in `packages/snfoundry/contracts/src`
- Modify the game interface at `packages/nextjs/app/page.tsx` and `packages/nextjs/app/game/page.tsx`
- Customize deployment scripts in `packages/snfoundry/scripts-ts/deploy.ts`
- Add new tests in `packages/snfoundry/contracts/src/test`
- Run tests with `yarn test`
- Frontend unit tests: `yarn test:nextjs`

</details>

## 🧪 The Experiment

Boring Game serves as a unique social experiment in the web3 space:

### Research Questions
- How do users interact with "purposeless" blockchain applications?
- What role does gamification play in crypto adoption?
- Can repetitive digital actions serve therapeutic purposes?
- How does the promise of NFT rewards influence behavior?
- At what point does sensory enhancement become overwhelming?

### Data Collection (Anonymous)
- Session duration and return rate patterns
- Feature unlock progression speeds
- Sensory preference clustering
- Achievement completion rates
- NFT minting behavior

### Community Aspects
- Share your sensory overload tolerance on social media
- Compare achievement NFT collections
- Participate in community discussions about digital wellness
- Contribute to the experiment by simply playing

## 🤝 Contributing

We welcome contributions to Boring Game! Whether you want to:
- Add new sensory elements or ASMR features
- Improve the achievement system
- Enhance the smart contract functionality
- Contribute to the social experiment research
- Fix bugs or improve performance

Please feel free to submit issues and pull requests.

## 📜 License

MIT License - Feel free to use, modify, and distribute as you see fit.

---

## 🎭 Final Thoughts

In a world obsessed with engagement metrics and dopamine hits, Boring Game asks a simple question: What if we slowed down? What if we found meaning in the mundane? What if the most profound digital experience was simply... being present with boredom?

Start your boring journey today. You might be surprised by what you discover.

**Remember: The game is as boring or as exciting as you make it.** 🌟
