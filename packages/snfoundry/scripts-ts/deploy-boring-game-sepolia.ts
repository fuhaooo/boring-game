import fs from "fs";
import path from "path";
import {
  RpcProvider,
  Account,
  ec,
  Contract,
  json,
  CallData,
  constants,
  stark,
} from "starknet";
import { green, red, yellow } from "./helpers/colorize-log";

// 设置环境变量
const STARKNET_ACCOUNT_ADDRESS = process.env.STARKNET_ACCOUNT_ADDRESS;
const STARKNET_PRIVATE_KEY = process.env.STARKNET_PRIVATE_KEY;
const STARKNET_PROVIDER_URL =
  process.env.STARKNET_PROVIDER_URL || "https://starknet-sepolia.infura.io/v3/";

if (!STARKNET_ACCOUNT_ADDRESS || !STARKNET_PRIVATE_KEY) {
  console.error(red("请确保设置了以下环境变量:"));
  console.error(red("STARKNET_ACCOUNT_ADDRESS"));
  console.error(red("STARKNET_PRIVATE_KEY"));
  process.exit(1);
}

// 创建Provider和Account对象
const provider = new RpcProvider({ nodeUrl: STARKNET_PROVIDER_URL });
const privateKey = STARKNET_PRIVATE_KEY;
const accountAddress = STARKNET_ACCOUNT_ADDRESS;
const account = new Account(provider, accountAddress, privateKey);

async function main() {
  try {
    console.log(yellow("开始部署BoringGame合约到Sepolia测试网..."));
    console.log(yellow("部署者地址:"), accountAddress);
    console.log(
      yellow("目标钱包地址:"),
      "0x011bf31D662FF2638447c5BF401f97b6CaFF5DAbcBEE772dbcEDFC6319b66Bba"
    );

    // 读取编译后的合约文件
    const contractsPath = path.resolve(__dirname, "../contracts/target/dev");

    // 查找Sierra和CASM文件
    const files = fs.readdirSync(contractsPath);
    const sierraFile = files.find((f) =>
      f.includes("BoringGame.contract_class.json")
    );
    const casmFile = files.find((f) =>
      f.includes("BoringGame.compiled_contract_class.json")
    );

    if (!sierraFile || !casmFile) {
      throw new Error("找不到编译后的合约文件，请先运行 yarn compile");
    }

    // 读取合约文件内容
    const compiledSierra = JSON.parse(
      fs.readFileSync(path.join(contractsPath, sierraFile), "utf8")
    );
    const compiledCasm = JSON.parse(
      fs.readFileSync(path.join(contractsPath, casmFile), "utf8")
    );

    console.log(yellow("正在声明合约..."));

    // 声明合约
    const declareResponse = await account.declare({
      contract: compiledSierra,
      casm: compiledCasm,
    });

    console.log(green("合约声明交易hash:"), declareResponse.transaction_hash);

    // 等待交易完成
    console.log(yellow("等待交易确认..."));
    await provider.waitForTransaction(declareResponse.transaction_hash);

    const classHash = declareResponse.class_hash;
    console.log(green("合约Class Hash:"), classHash);

    // 部署合约
    console.log(yellow("正在部署合约..."));

    // 构造合约参数
    const constructorCalldata = CallData.compile({
      owner: accountAddress,
    });

    // 生成随机salt
    const salt = stark.randomAddress();

    // 部署合约
    const { transaction_hash, contract_address } = await account.deployContract(
      {
        classHash,
        constructorCalldata,
        salt,
      }
    );

    console.log(green("合约部署交易hash:"), transaction_hash);

    // 等待交易完成
    console.log(yellow("等待部署完成..."));
    await provider.waitForTransaction(transaction_hash);

    console.log(green("BoringGame合约成功部署!"));
    console.log(green("合约地址:"), contract_address);
    console.log(green("Class Hash:"), classHash);

    // 保存部署信息
    const deploymentInfo = {
      network: "sepolia",
      contractAddress: contract_address,
      classHash: classHash,
      transactionHash: transaction_hash,
      timestamp: new Date().toISOString(),
    };

    const deploymentsDir = path.resolve(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(deploymentsDir, "sepolia_latest.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(green("部署信息已保存到 deployments/sepolia_latest.json"));
    console.log(
      green("龙珠NFT URL:"),
      "ipfs://bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru"
    );
    console.log(
      green("可通过网关访问:"),
      "https://blush-rainy-constrictor-734.mypinata.cloud/ipfs/bafybeiciojjygr67dngemgpp3us5dvy7gpze3weuw2qqeeh4lfmpxizrru"
    );
  } catch (error) {
    console.error(red("部署失败! 错误:"));
    console.error(error);
    process.exit(1);
  }
}

main();
