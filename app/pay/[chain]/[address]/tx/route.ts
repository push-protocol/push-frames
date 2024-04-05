import {NextResponse} from "next/server";
import {getChainId, getCoinAmountToSend} from "@/app/lib/utils";

export async function POST(req: any, params: any) {
  const body = await req.json();
  const {
    untrustedData: {inputText, buttonIndex},
  } = body;
  const chain = params.params.chain;
  const address = params.params.address;
  let amount;
  let url;
  if (chain === "matic" || chain === "polygon") {
    url = `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`;
  } else if (chain === "bsc") {
    url = `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`;
  } else {
    url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
  }
  const options = {
    method: "GET",
    headers: {"x-cg-demo-api-key": process.env.CG_KEY || ""},
  };

  const coingeckoResponse = await fetch(url, options);
  const coingeckoData = await coingeckoResponse.json();
  let coinPrice;
  if (chain === "matic" || chain === "polygon") {
    coinPrice = coingeckoData["matic-network"].usd;
  } else if (chain === "bsc") {
    coinPrice = coingeckoData.binancecoin.usd;
  } else {
    coinPrice = coingeckoData.ethereum.usd;
  }
  console.log(coinPrice);
  console.log(inputText);
  console.log(buttonIndex);
  if (buttonIndex === 1) {
    amount = getCoinAmountToSend(coinPrice.toString(), "5");
  } else if (buttonIndex === 2) {
    amount = getCoinAmountToSend(coinPrice.toString(), "10");
  } else {
    amount = getCoinAmountToSend(coinPrice.toString(), inputText);
  }

  const response = {
    chainId: `eip155:${getChainId(chain)}`,
    method: "eth_sendTransaction",
    params: {
      to: address,
      value: amount,
    },
  };
  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const GET = POST;
