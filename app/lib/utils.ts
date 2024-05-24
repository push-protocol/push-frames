import {State} from "@/types";
import {normalize} from "path";
import {createPublicClient, http, isAddress, parseEther} from "viem";
import {mainnet} from "viem/chains";
import * as jose from "jose";
import {randomUUID} from "crypto";
const validUDExtensions = [
  ".x",
  ".polygon",
  ".nft",
  ".crypto",
  ".blockchain",
  ".bitcoin",
  ".dao",
  ".888",
  ".wallet",
  ".binanceus",
  ".hi",
  ".klever",
  ".kresus",
  ".anime",
  ".manga",
  ".go",
  ".zil",
  ".eth",
];

export function isChainSupported(chain: string) {
  const chains = ["ethereum", "bsc", "polygon", "base", "sepolia"];
  return chains.some((c) => c === chain);
}
export function getChainId(chain: string) {
  switch (chain) {
    case "sepolia":
      return 11155111;
    case "bsc":
      return 56;
    case "polygon":
      return 137;
    case "base":
      return 8453;
    case "ethereum":
      return 1;
    default:
      return 137;
  }
}
export function getChainExplorer(chain: string, tx: string) {
  let url;
  switch (chain) {
    case "sepolia":
      url = `https://sepolia.etherscan.io/tx/${tx}`;
      break;
    case "bsc":
      url = `https://basescan.org/tx/${tx}`;
      break;
    case "polygon":
      url = `https://polygonscan.com/tx/${tx}`;
      break;
    case "base":
      url = `https://basescan.org/tx/${tx}`;
      break;
    case "ethereum":
      url = `https://etherscan.io/tx/${tx}`;
      break;
    default:
      url = `https://polygonscan.com/tx/${tx}`;
      break;
  }
  return url;
}

export function getCoinAmountToSend(currentPrice: string, value: string) {
  const amountToBuy = (parseFloat(value) / parseFloat(currentPrice))
    .toFixed(15)
    .toString();
  return parseEther(amountToBuy).toString();
}

export async function resolveName(nameOrAddress: string) {
  if (
    !isAddress(nameOrAddress) &&
    !nameOrAddress.includes(".eth") &&
    !validUDExtensions.some((ext) => nameOrAddress.includes(ext))
  ) {
    return false;
  }
  if (nameOrAddress.includes(".eth")) {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(process.env.ALCHEMY_RPC),
    });
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(nameOrAddress),
    });
    return ensAddress;
  } else if (validUDExtensions.some((ext) => nameOrAddress.includes(ext))) {
    const url = `https://api.unstoppabledomains.com/resolve/domains/${nameOrAddress}`;
    const headers = {
      Authorization: `Bearer ${process.env.UD_API_KEY}`,
    };

    try {
      const response = await fetch(url, {headers});
      const body = await response.json();

      return body.meta.owner;
    } catch (error) {
      throw error;
    }
  } else {
    return nameOrAddress;
  }
}
const JWS_SECRET = process.env["JWS_SECRET"] ?? "";

export async function encodeState(state: State) {
  return await new jose.CompactSign(
    new TextEncoder().encode(JSON.stringify({...state, nonce: randomUUID()}))
  )
    .setProtectedHeader({alg: "HS256"})
    .sign(Buffer.from(JWS_SECRET, "hex"));
}
export async function verifyState(encodedState: string): Promise<State> {
  const {payload} = await jose.compactVerify(
    encodedState,
    Buffer.from(JWS_SECRET, "hex")
  );
  const {nonce, ...state} = JSON.parse(new TextDecoder().decode(payload));
  return state;
}

export async function deriveState(state: State, input: string) {
  console.log("input:", input);
  console.log("deriving state:", state);
  if (state.pointer == 1) {
    state.name = input;
  } else if (state.pointer == 2) {
    state.description = input;
  } else if (state.pointer == 3) {
    state.website = input;
  } else if (state.pointer == 4) {
    // Assuming `input` is the image URL here
    // const imageUrl = input;
    // try {
    //   const response = await fetch(imageUrl);
    //   const arrayBuffer = await response.arrayBuffer();
    //   const buffer = Buffer.from(arrayBuffer);
    //   console.log(`data:image/jpeg;base64,${buffer.toString("base64")}`);
    //   state.icon = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    // } catch (error) {
    //   console.error("Failed to fetch or convert image:", error);
    //   state.icon = "";
    // }

    state.icon = input;
  } else if (state.pointer == 5) {
    console.log(
      "this is where you need to check if the user has enough approval to create a channel"
    );
  } else if (state.pointer == 6) {
    console.log("this is where you actually trigger tx ");
  }
  state.pointer++;

  return state;
}
