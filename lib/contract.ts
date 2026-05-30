export const baseTrainContractAddress = "0x6F7967C55A21b6cCCcEc3dd976Ac36068462C094" as const;

export const baseTrainAbi = [
  {
    type: "function",
    name: "createQuest",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "openingStory", type: "string" },
      { name: "world", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "expandStory",
    stateMutability: "nonpayable",
    inputs: [
      { name: "questId", type: "uint256" },
      { name: "nextSentence", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "questCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "interactionCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
