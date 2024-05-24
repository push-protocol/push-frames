import {NextResponse} from "next/server";
import {deriveState, verifyState} from "../../route";
import {mainnet} from "viem/chains";
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
  parseEther,
  stringToBytes,
  stringToHex,
} from "viem";
import {
  PUSH_CORE_CONTRACT_ABI,
  PUSH_CORE_CONTRACT_ADDRESS,
  PUSH_CORE_CONTRACT_ADDRESS_SEPOLIA,
  PUSH_TOKEN_ADDRESS_MAINNET,
} from "@/constants";

export async function POST(req: any) {
  const {
    untrustedData: {buttonIndex, inputText, state: serializedState, address},
  } = await req.json();
  try {
    const state = await verifyState(serializedState);
    console.log("verified state", state);
    let channelIcon = "";
    // first you need to get image in base64

    try {
      const response = await fetch(state.icon);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`data:image/jpeg;base64,${buffer.toString("base64")}`);
      channelIcon = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    } catch (error) {
      console.error("Failed to fetch or convert image:", error);
      channelIcon = state.icon;
    }

    // then start uploading the channel meta to ipfs
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataContent: {
            name: state.name,
            info: state.description,
            url: state.website,
            icon: channelIcon,
            aliasDetails: {},
          },
        }),
      }
    );

    if (!response.ok) {
      return new NextResponse("Failed to upload channel meta", {status: 500});
    }
    const {IpfsHash} = await response.json();
    const identity = `1+${IpfsHash}`;
    console.log("identity", identity);
    const identityBytes = stringToHex(identity);
    console.log("identityBytes", identityBytes);
    const txData = encodeFunctionData({
      abi: PUSH_CORE_CONTRACT_ABI,
      functionName: "createChannelWithPUSH",
      args: [2, identityBytes, parseEther("50"), 0],
    });
    return NextResponse.json({
      chainId: "eip155:11155111",
      method: "eth_sendTransaction",
      params: {
        abi: PUSH_CORE_CONTRACT_ABI,
        data: txData,
        to:
          process.env.env === "staging"
            ? PUSH_CORE_CONTRACT_ADDRESS_SEPOLIA
            : PUSH_CORE_CONTRACT_ADDRESS,
      },
    });
  } catch (error) {
    console.error("Failed to create channel", error);
    const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/image?section=create_channel&error=Something Went wrong`;

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
}
