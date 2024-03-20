import {NextResponse} from "next/server";
import {PushAPI, CONSTANTS} from "@pushprotocol/restapi";
import {createWalletClient, http, isAddress} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {mainnet} from "viem/chains";

export async function GET(req: any, params: any) {
  const channel = params.params.channel;
  const account = privateKeyToAccount(
    (process.env.WALLET_PK as `0x${string}`) || ("" as `0x${string}`)
  );
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(process.env.ALCHEMY_RPC),
  });

  if (!isAddress(channel)) {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/api/image?section=error&message=Not a Valid Address`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />

          <meta name="fc:frame:image" content="${image_url}" />
           <meta name="fc:frame:button:1" content="Visit Push Dapp" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://app.push.org" />
        
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

  const userAlice = await PushAPI.initialize(client, {
    env: CONSTANTS.ENV.PROD,
  });
  const channelInfo = await userAlice.channel.info(channel);

  if (channelInfo) {
    const verified = channelInfo.verified_status;
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/api/image?section=1&name=${channelInfo.name}&info=${channelInfo.info}&count=${channelInfo.subscriber_count}&verified=${verified}`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/channel/${channel}" />
          <meta name="fc:frame:image" content="${image_url}" />
          <meta name="fc:frame:button:1" content="Subscribe" />
          <meta name="fc:frame:button:1:action" content="subscribe:1" />
          <meta name="fc:frame:button:1:target" content="${channel}" />
        
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
  } else {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/api/image?section=error&message=No Channel Exists`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${image_url}" />
           <meta name="fc:frame:button:1" content="Visit Push Dapp" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://app.push.org" />
        
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
export async function POST(req: any) {
  const body = await req.json();
  const status = body.status;
  const message = body.message;
  const image_url = `${process.env.NEXT_PUBLIC_HOST}/api/image?section=${
    status === "error" ? "error" : "2"
  }&message=${message}`;
  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${image_url}" />
          <meta name="fc:frame:button:1" content="Visit Push Dapp" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://app.push.org" />
        
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
