import { useCallback } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import {
  useDeployedContractInfo,
  useTransactor,
} from "~~/hooks/scaffold-stark";
import {
  ContractAbi,
  ContractName,
  ExtractAbiFunctionNamesScaffold,
  UseScaffoldWriteConfig,
} from "~~/utils/scaffold-stark/contract";
import { useSendTransaction, useNetwork } from "@starknet-react/core";
import { notification } from "~~/utils/scaffold-stark";
import { Abi } from "starknet";

export const useScaffoldWriteContract = <
  TAbi extends Abi,
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNamesScaffold<
    ContractAbi<TContractName>,
    "external"
  >,
>({
  contractName,
  functionName,
  args,
}: UseScaffoldWriteConfig<TAbi, TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { chain } = useNetwork();
  const { writeTransaction: sendTxnWrapper, sendTransactionInstance } =
    useTransactor();
  const { targetNetwork } = useTargetNetwork();

  const sendContractWriteTx = useCallback(
    async (params?: {
      args?: UseScaffoldWriteConfig<TAbi, TContractName, TFunctionName>["args"];
    }) => {
      // if no args supplied, use the one supplied from hook
      let newArgs = params?.args;
      if (Object.keys(newArgs || {}).length <= 0) {
        newArgs = args;
      }

      if (!deployedContractData) {
        console.error(
          "Target Contract is not deployed, did you forget to run `yarn deploy`?",
        );
        return;
      }
      if (!chain?.id) {
        console.error("Please connect your wallet");
        return;
      }
      if (chain?.id !== targetNetwork.id) {
        console.error("You are on the wrong network");
        return;
      }

      try {
        console.log("Contract address:", deployedContractData.address);
        console.log("Function name:", functionName);
        console.log("Args:", newArgs);

        // 直接创建调用数据，不使用Contract类
        const call = {
          contractAddress: deployedContractData.address,
          entrypoint: functionName as string,
          calldata: newArgs ? Object.values(newArgs).map((arg: any) => arg.toString()) : []
        };
        
        console.log("Call:", call);

        return await sendTxnWrapper([call] as any[]);
      } catch (e: any) {
        console.error("Contract interaction error:", e);
        throw e;
      }
    },
    [
      args,
      chain?.id,
      deployedContractData,
      functionName,
      sendTransactionInstance,
      sendTxnWrapper,
      targetNetwork.id,
    ],
  );

  return {
    ...sendTransactionInstance,
    sendAsync: sendContractWriteTx,
  };
};
