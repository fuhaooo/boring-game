import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green, red } from "./helpers/colorize-log";

/**
 * Deploy the BoringGame contract on Sepolia testnet
 */
const deployScript = async (): Promise<void> => {
  try {
    console.log("Deploying BoringGame contract on Sepolia testnet...");
    console.log(
      "Target wallet for game fees:",
      "0x011bf31D662FF2638447c5BF401f97b6CaFF5DAbcBEE772dbcEDFC6319b66Bba"
    );
    console.log("Deployer address:", deployer.address);

    await deployContract({
      contract: "BoringGame",
      constructorArgs: {
        owner: deployer.address,
      },
    });

    // NFT图片URL已设置为Pinata托管的IPFS链接
    console.log(
      "Dragon NFT URL已设置: ipfs://bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru"
    );
    console.log(
      "可通过网关访问: https://blush-rainy-constrictor-734.mypinata.cloud/ipfs/bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru"
    );
  } catch (error) {
    console.error(red("部署合约时发生错误:"));
    console.error(red(error.message));
    console.error(red("错误详情:"), error);
    throw error;
  }
};

const main = async (): Promise<void> => {
  try {
    await deployScript();
    await executeDeployCalls();
    exportDeployments();

    console.log(green("BoringGame Contract Deployed Successfully on Sepolia!"));
    console.log(
      green("Now users can start playing and collecting Dragon Balls!")
    );
  } catch (err) {
    console.log(red("部署失败！详细错误信息:"));
    console.log(err);
    process.exit(1); //exit with error so that no subsequent scripts are run
  }
};

main();
