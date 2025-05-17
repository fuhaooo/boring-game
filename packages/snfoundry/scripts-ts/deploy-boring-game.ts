import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

/**
 * Deploy the BoringGame contract
 */
const deployScript = async (): Promise<void> => {
  await deployContract({
    contract: "BoringGame",
    constructorArgs: {
      owner: deployer.address,
    },
  });
};

const main = async (): Promise<void> => {
  try {
    await deployScript();
    await executeDeployCalls();
    exportDeployments();

    console.log(green("BoringGame Contract Deployed Successfully!"));
  } catch (err) {
    console.log(err);
    process.exit(1); //exit with error so that non subsequent scripts are run
  }
};

main(); 