import {NextRequest, NextResponse} from "next/server";
import {createPublicClient, erc20Abi, http} from "viem";
import {mainnet} from "viem/chains";

import {deriveState, encodeState, verifyState} from "@/app/lib/utils";
import {State} from "@/types";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function POST(req: NextRequest) {
  const {
    untrustedData: {buttonIndex, address, inputText, state: serializedState},
  } = await req.json();
  console.log("buttonIndex", buttonIndex);
  console.log("address", address);
  console.log("inputText", inputText);
  let state: State;
  if (!serializedState) {
    state = {
      pointer: 0,
      name: "",
      description: "",
      website: "",
      icon: "",
    };
    console.log("created state", state);
  } else {
    try {
      state = await verifyState(serializedState);
      console.log("verified state", state);
    } catch (e: any) {
      if (e?.code === "ERR_JWS_INVALID") {
        return new NextResponse("Invalid state", {status: 400});
      } else {
        return new NextResponse("Internal server error", {status: 500});
      }
    }
  }

  const newState = await deriveState(state, inputText);
  const encodedState = await encodeState(newState);

  const postUrl = `${process.env.NEXT_PUBLIC_HOST}/channel/create`;

  const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/image?section=create_channel&step=${state.pointer}&error=${state.error}&state=${encodedState}`;

  const buttons =
    state.pointer == 5
      ? [
          `<meta property="fc:frame:button:1" content="Approve $Push" />`,
          `<meta property="fc:frame:button:1:action" content="tx" />`,
          `<meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_HOST}/channel/create/tx/approve" />`,
        ]
      : state.pointer == 6
      ? [
          `<meta property="fc:frame:button:1" content="Create Channel" />`,
          `<meta property="fc:frame:button:1:action" content="tx" />`,
          `<meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_HOST}/channel/create/tx/register" />`,
        ]
      : state.pointer > 6
      ? []
      : ['<meta name="fc:frame:button:1" content="Next" />'];
  const inputTextTag = `${
    state.pointer > 4
      ? ""
      : ` <meta name="fc:frame:input:text" content="Enter ${
          state.pointer == 1
            ? "name"
            : state.pointer == 2
            ? "description"
            : state.pointer == 3
            ? "website"
            : state.pointer == 4
            ? "icon"
            : ""
        }" />`
  }`;

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Stateful Counter" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:state" content="${encodedState}" />
          ${buttons.join("\n")}
          ${inputTextTag}
        </head>
        <body></body>
      </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

export async function GET(req: any) {
  const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/image?section=create_channel&step=0`;

  const postUrl = `${process.env.NEXT_PUBLIC_HOST}/channel/create`;
  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:button:1" content="Get Started" />
        </head>
        <body/>
      </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
