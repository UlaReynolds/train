"use client";

import { Activity, Check, ChevronRight, Fuel, LogOut, ShieldCheck, Wallet, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { base } from "viem/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { baseTrainAbi, baseTrainContractAddress } from "@/lib/contract";
import { builderDataSuffix } from "@/lib/wagmi";

const actions = [
  {
    label: "Fuel the Train",
    verb: "fed coal into the engine",
    reward: 18,
    icon: Fuel
  },
  {
    label: "Repair the Wheels",
    verb: "repaired the wheel assembly",
    reward: 21,
    icon: Wrench
  },
  {
    label: "Extend the Route",
    verb: "expanded the community railway",
    reward: 24,
    icon: ChevronRight
  }
];

function shortAddress(address?: `0x${string}`) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Home() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [reward, setReward] = useState(0);
  const [runs, setRuns] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { writeContract, data: hash, isPending: isWriting, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: reads, refetch } = useReadContracts({
    allowFailure: true,
    contracts: address
      ? [
          {
            address: baseTrainContractAddress,
            abi: baseTrainAbi,
            functionName: "questCount",
            args: [address]
          },
          {
            address: baseTrainContractAddress,
            abi: baseTrainAbi,
            functionName: "interactionCount",
            args: [address]
          }
        ]
      : []
  });

  const questCount = typeof reads?.[0]?.result === "bigint" ? reads[0].result : 0n;
  const onchainActions = typeof reads?.[1]?.result === "bigint" ? reads[1].result : 0n;
  const currentAction = actions[actionIndex % actions.length];
  const CurrentIcon = currentAction.icon;

  const sortedConnectors = useMemo(() => {
    const preferred = ["Coinbase Wallet", "Injected"];
    return [...connectors].sort((a, b) => preferred.indexOf(b.name) - preferred.indexOf(a.name));
  }, [connectors]);

  useEffect(() => {
    if (isSuccess) {
      void refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const wasDisconnected = window.localStorage.getItem("train-disconnected") === "true";
    const injectedConnector = connectors.find((connector) => connector.id === "injected");

    if (!isConnected && !wasDisconnected && injectedConnector && userAgent.includes("base")) {
      connect({ connector: injectedConnector });
    }
  }, [connect, connectors, isConnected]);

  async function runTrain() {
    if (!isConnected) {
      setWalletOpen(true);
      return;
    }

    if (chainId !== base.id) {
      await switchChainAsync({ chainId: base.id });
    }

    const nextReward = currentAction.reward;
    setReward((value) => value + nextReward);
    setRuns((value) => value + 1);
    setActionIndex((value) => value + 1);

    const sentence = `The conductor ${currentAction.verb} at block ${Number(onchainActions) + runs + 1}.`;
    const request =
      questCount === 0n
        ? {
            address: baseTrainContractAddress,
            abi: baseTrainAbi,
            functionName: "createQuest",
            args: ["BaseTrain", sentence, "An endless Base community railway"],
            dataSuffix: builderDataSuffix
          }
        : {
            address: baseTrainContractAddress,
            abi: baseTrainAbi,
            functionName: "expandStory",
            args: [questCount - 1n, sentence],
            dataSuffix: builderDataSuffix
          };

    writeContract(request as Parameters<typeof writeContract>[0]);
  }

  function handleDisconnect() {
    window.localStorage.setItem("train-disconnected", "true");
    disconnect();
  }

  function handleConnect(connectorId: string) {
    const connector = connectors.find((item) => item.id === connectorId);
    if (!connector) return;
    window.localStorage.removeItem("train-disconnected");
    connect({ connector, chainId: base.id });
    setWalletOpen(false);
  }

  return (
    <main className="shell">
      <section className="hero" aria-label="BaseTrain control deck">
        <div className="topbar">
          <div className="brand">
            <span className="brandMark">BT</span>
            <span>BaseTrain</span>
          </div>
          {isConnected ? (
            <button className="walletButton connected" type="button" onClick={handleDisconnect}>
              <span>{shortAddress(address)}</span>
              <LogOut size={16} />
            </button>
          ) : (
            <button className="walletButton" type="button" onClick={() => setWalletOpen(true)}>
              <Wallet size={17} />
              <span>Connect</span>
            </button>
          )}
        </div>

        <div className="copy">
          <p className="eyebrow">Onchain cooperative railway</p>
          <h1>Train</h1>
          <p className="lede">
            Keep one shared train moving forever. Every action writes a small permanent log on Base and gives you an instant station reward.
          </p>
        </div>

        <div className="scene" aria-hidden="true">
          <div className="skyline">
            <span />
            <span />
            <span />
          </div>
          <div className="signal">
            <span />
          </div>
          <div className="train">
            <div className="connector left" />
            <div className="car carFront">
              <div className="roof vents" />
              <div className="stripe" />
              <div className="door" />
              <div className="window small" />
              <div className="window wide" />
              <div className="serial">RW257 554470</div>
              <div className="bogie first">
                <i />
                <i />
              </div>
            </div>
            <div className="car carMid">
              <div className="roof" />
              <div className="stripe" />
              <div className="window row one" />
              <div className="window row two" />
              <div className="window row three" />
              <div className="window row four" />
              <div className="panels" />
            </div>
            <div className="car carTail">
              <div className="roof vents" />
              <div className="stripe" />
              <div className="window wide tailWide" />
              <div className="window small tailSmall" />
              <div className="door tailDoor" />
              <div className="serial tailText">BSP RW25T</div>
              <div className="bogie last">
                <i />
                <i />
              </div>
            </div>
            <div className="connector right" />
          </div>
          <div className="track">
            <span />
          </div>
        </div>

        <div className="controlPanel">
          <div className="rewardCard">
            <div>
              <span className="label">Instant reward</span>
              <strong>{reward + currentAction.reward} Rail Points</strong>
            </div>
            <div className="pulseBadge">
              <Activity size={17} />
            </div>
          </div>

          <button className="mainAction" type="button" onClick={runTrain} disabled={isWriting || isConfirming || isConnecting}>
            <CurrentIcon size={22} />
            <span>{isWriting || isConfirming ? "Writing to Base..." : currentAction.label}</span>
          </button>

          <div className="stats">
            <div>
              <span>Local runs</span>
              <strong>{runs}</strong>
            </div>
            <div>
              <span>Onchain logs</span>
              <strong>{onchainActions.toString()}</strong>
            </div>
            <div>
              <span>Network</span>
              <strong>{chainId === base.id ? "Base" : "Switch needed"}</strong>
            </div>
          </div>

          <div className="statusLine">
            <ShieldCheck size={16} />
            <span>
              {isSuccess
                ? "Confirmed on Base. Dashboard attribution will activate after app id and builder code are added."
                : error
                  ? error.message
                  : "No token purchase required. Only Base gas is needed for onchain actions."}
            </span>
          </div>
        </div>
      </section>

      {walletOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setWalletOpen(false)}>
          <div className="walletModal" role="dialog" aria-modal="true" aria-label="Choose wallet" onClick={(event) => event.stopPropagation()}>
            <div className="modalHead">
              <div>
                <span className="label">Choose wallet</span>
                <h2>Connect to Train</h2>
              </div>
              <button className="iconButton" type="button" onClick={() => setWalletOpen(false)} aria-label="Close wallet modal">
                <X size={19} />
              </button>
            </div>
            <div className="walletList">
              {sortedConnectors.map((connector) => (
                <button key={connector.uid} className="walletChoice" type="button" onClick={() => handleConnect(connector.id)}>
                  <span>
                    <strong>{connector.name === "Injected" ? "Browser Wallet" : connector.name}</strong>
                    <small>{connector.name === "Injected" ? "Base App, MetaMask, OKX, and other injected wallets" : "Coinbase Wallet app or extension"}</small>
                  </span>
                  <Check size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
