import {NextRequest, NextResponse} from "next/server";
import * as jose from "jose";
import {randomUUID} from "crypto";
import {createPublicClient, erc20Abi, http} from "viem";
import {mainnet, polygon} from "viem/chains";
import {
  PUSH_CORE_CONTRACT_ADDRESS,
  PUSH_TOKEN_ADDRESS_MAINNET,
} from "@/constants";

interface State {
  pointer: number;
  name: string;
  description: string;
  website: string;
  icon: string;
  error?: string;
}
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
const JWS_SECRET = process.env["JWS_SECRET"] ?? "";

async function encodeState(state: State) {
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

export async function POST(req: NextRequest) {
  const {
    untrustedData: {buttonIndex, address, inputText, state: serializedState},
  } = await req.json();

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
