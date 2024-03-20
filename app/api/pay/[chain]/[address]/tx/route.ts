import {NextResponse} from "next/server";
import {getCoinAmountToSend} from "@/app/lib/utils";

export async function POST(req: any, params: any) {
  const body = await req.json();
  const {
    untrustedData: {inputText, buttonIndex},
  } = body;
  const chain = params.params.chain;
  const address = params.params.address;
  let amount;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${
    chain === "polygon" || chain === "matic" ? "matic-network" : "ethereum"
  }&vs_currencies=usd`;
  const options = {
    method: "GET",
    headers: {"x-cg-demo-api-key": process.env.CG_KEY || ""},
  };

  const coingeckoResponse = await fetch(url, options);
  const coingeckoData = await coingeckoResponse.json();
  const coinPrice =
    coingeckoData[
      chain === "polygon" || chain === "matic" ? "matic-network" : "ethereum"
    ].usd;
  console.log(coinPrice);
  if (buttonIndex === 1) {
    amount = getCoinAmountToSend(coinPrice.toString(), "5");
  } else if (buttonIndex === 2) {
    amount = getCoinAmountToSend(coinPrice.toString(), "10");
  } else {
    amount = getCoinAmountToSend(coinPrice.toString(), inputText);
  }

  const response = {
    chainId: `eip155:${chain}`,
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
