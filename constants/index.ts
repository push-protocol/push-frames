export const PUSH_TOKEN_ADDRESS_MAINNET =
  "0xf418588522d5dd018b425E472991E52EBBeEEEEE";
export const PUSH_TOKEN_ADDRESS_SEPOLIA =
  "0x37c779a1564DCc0e3914aB130e0e787d93e21804";
export const PUSH_TOKEN_ABI = [
  {
    inputs: [
      {internalType: "address", name: "spender", type: "address"},
      {internalType: "uint256", name: "rawAmount", type: "uint256"},
    ],
    name: "approve",
    outputs: [{internalType: "bool", name: "", type: "bool"}],
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const PUSH_CORE_CONTRACT_ADDRESS =
  "0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE";
export const PUSH_CORE_CONTRACT_ADDRESS_SEPOLIA =
  "0x9d65129223451fbd58fc299C635Cd919BaF2564C";
export const PUSH_CORE_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "enum EPNSCoreStorageV1_5.ChannelType",
        name: "_channelType",
        type: "uint8",
      },
      {internalType: "bytes", name: "_identity", type: "bytes"},
      {internalType: "uint256", name: "_amount", type: "uint256"},
      {internalType: "uint256", name: "_channelExpiryTime", type: "uint256"},
    ],
    name: "createChannelWithPUSH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
