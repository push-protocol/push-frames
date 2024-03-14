import {NextResponse} from "next/server";
import {PushAPI, CONSTANTS} from "@pushprotocol/restapi";
import {ethers} from "ethers";
import {isAddress} from "ethers/lib/utils";

export async function GET(req: any, params: any) {
  const channel = params.params.channel;
  const env: "staging" | "prod" = params.params.env;
  if (env !== "staging" && env !== "prod") {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/api/image?section=error&message=Not a Valid Environment`;
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
  const signer = ethers.Wallet.createRandom();
  const userAlice = await PushAPI.initialize(signer, {
    env: env as any,
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
          <meta name="fc:frame:post_url" content="${
            process.env.NEXT_PUBLIC_HOST
          }/api/${env}/${channel}" />
          <meta name="fc:frame:image" content="${image_url}" />
          <meta name="fc:frame:button:1" content="Subscribe" />
          <meta name="fc:frame:button:1:action" content="subscribe:${
            env === "staging" ? "11155111" : "1"
          }" />
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
          <meta name="fc:frame:button:1:target" content="https://push.org" />
        
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
