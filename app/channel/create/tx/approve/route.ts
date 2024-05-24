import {
  PUSH_CORE_CONTRACT_ADDRESS,
  PUSH_CORE_CONTRACT_ADDRESS_SEPOLIA,
  PUSH_TOKEN_ABI,
  PUSH_TOKEN_ADDRESS_MAINNET,
  PUSH_TOKEN_ADDRESS_SEPOLIA,
} from "@/constants";
import {NextResponse} from "next/server";
import {encodeFunctionData} from "viem";

export async function POST(req: any) {
  try {
    const data = encodeFunctionData({
      abi: PUSH_TOKEN_ABI,
      functionName: "approve",
      args: [
        process.env.env === "staging"
          ? PUSH_CORE_CONTRACT_ADDRESS_SEPOLIA
          : PUSH_CORE_CONTRACT_ADDRESS,
        "50000000000000000000",
      ],
    });
    console.log({
      chainId: `eip155:${process.env.env === "staging" ? 11155111 : 1}`,
      method: "eth_sendTransaction",
      params: {
        abi: PUSH_TOKEN_ABI,
        data,
        to:
          process.env.env === "staging"
            ? PUSH_TOKEN_ADDRESS_SEPOLIA
            : PUSH_TOKEN_ADDRESS_MAINNET,
      },
    });
    return NextResponse.json({
      chainId: "eip155:11155111",
      method: "eth_sendTransaction",
      params: {
        abi: PUSH_TOKEN_ABI,
        data,
        to:
          process.env.env === "staging"
            ? PUSH_TOKEN_ADDRESS_SEPOLIA
            : PUSH_TOKEN_ADDRESS_MAINNET,
      },
    });
  } catch (error) {}
}
