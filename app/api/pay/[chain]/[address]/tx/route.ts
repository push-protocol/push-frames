import {NextResponse} from "next/server";
import {parseEther} from "ethers/lib/utils";

export async function POST(req: any, params: any) {
  const body = await req.json();
  console.log(body);
  const {
    untrustedData: {inputText},
  } = body;

  const chain = params.params.chain;
  const address = params.params.address;

  const response = {
    chainId: `eip155:${chain}`,
    method: "eth_sendTransaction",
    params: {
      to: address,
      value: parseEther(inputText).toString(),
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
