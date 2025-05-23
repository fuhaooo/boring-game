"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { CairoOption, CairoOptionVariant } from "starknet";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

const Home = () => {
  const { data: currentGreeting } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "greeting",
    args: [],
  });

  const { sendAsync: setGreeting } = useScaffoldWriteContract({
    contractName: "YourContract",
    functionName: "set_greeting",
    args: ["Hello, alfred!", new CairoOption<number>(CairoOptionVariant.None)],
  });

  const { sendAsync: sendStrk } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: "YourContract",
        functionName: "set_greeting",
        args: [
          "Hello, alfred1!",
          new CairoOption<number>(CairoOptionVariant.None),
        ],
      },
      {
        contractName: "Strk",
        functionName: "transfer",
        args: [
          "0x064b48806902a367c8598f4F95C305e8c1a1aCbA5f082D294a43793113115691",
          100 * 10 ** 18,
        ],
      },
    ],
  });

  const { data: events } = useScaffoldEventHistory({
    contractName: "Strk",
    eventName: "openzeppelin::token::erc20_v070::erc20::ERC20::Event",
    fromBlock: 0n,
  });

  console.log(events);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Scaffold-Stark 2</span>
        </h1>
        <ConnectedAddress />
        <p className="text-center text-lg">
          Edit your smart contract{" "}
          <code className="bg-underline italic text-base font-bold max-w-full break-words break-all inline-block">
            YourContract.cairo
          </code>{" "}
          in{" "}
          <code className="bg-underline italic text-base font-bold max-w-full break-words break-all inline-block">
            packages/snfoundry/contracts/src
          </code>
        </p>
        <p className="text-center text-lg">
          Current Greeting: {currentGreeting?.toString()}
        </p>
        <button onClick={() => setGreeting()}>Set Greeting</button>
        <button onClick={() => sendStrk()}>Send Strk</button>
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 relative text-[12px] px-10 py-10 text-center items-center max-w-xs rounded-3xl border border-gradient">
            <div className="trapeze"></div>
            <Image
              src="/debug-icon.svg"
              alt="icon"
              width={26}
              height={30}
            ></Image>
            <p>
              Tinker with your smart contract using the{" "}
              <Link href="/debug" passHref className="link">
                Debug Contracts
              </Link>{" "}
              tab.
            </p>
          </div>
          <div className="flex flex-col bg-base-100 relative text-[12px] px-10 py-10 text-center items-center max-w-xs rounded-3xl border border-gradient">
            <div className="trapeze"></div>
            <Image
              src="/explorer-icon.svg"
              alt="icon"
              width={20}
              height={32}
            ></Image>
            <p>
              Play around with Multiwrite transactions using
              useScaffoldMultiWrite() hook
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
