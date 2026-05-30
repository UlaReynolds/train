import { coinbaseWallet, injected } from "wagmi/connectors";
import { base } from "wagmi/chains";
import { createConfig, http } from "wagmi";

export const baseAppId = "";
export const builderDataSuffix = "0x" as `0x${string}`;

export const appAttribution = {
  appId: baseAppId,
  dataSuffix: builderDataSuffix
};

const appName = "Train";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true
    }),
    coinbaseWallet({
      appName,
      preference: "all"
    })
  ],
  ssr: true,
  transports: {
    [base.id]: http()
  }
});
