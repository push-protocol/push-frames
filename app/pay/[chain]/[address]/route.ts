import {NextResponse} from "next/server";
import {getChainExplorer, isChainSupported, resolveName} from "@/app/lib/utils";

export async function GET(req: any, params: any) {
  const chain = params.params.chain;
  const address = params.params.address;

  const addressOrName = await resolveName(address);
  console.log(addressOrName);
  if (!addressOrName) {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/image?section=error&message=Not a Valid Address`;
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

  if (!isChainSupported(chain)) {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/image?section=error&message=Chain is not supported`;
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

  if (address && chain) {
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/image?section=pay&chain=${chain}&address=${address}`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/pay/${chain}/${addressOrName}" />
          <meta name="fc:frame:image" content="${image_url}" />
          <meta name="fc:frame:button:1" content="Pay $5" />
          <meta name="fc:frame:button:1:action" content="tx" />
          <meta name="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_HOST}/pay/${chain}/${addressOrName}/tx" />
          <meta name="fc:frame:button:2" content="Pay $10" />
          <meta name="fc:frame:button:2:action" content="tx" />
          <meta name="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_HOST}/pay/${chain}/${addressOrName}/tx" />
          <meta name="fc:frame:button:3" content="Pay custom" />
          <meta name="fc:frame:button:3:action" content="tx" />
          <meta name="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_HOST}/pay/${chain}/${addressOrName}/tx" />
          <meta name="fc:frame:input:text" content="Custom amount in $" />


        
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
    const image_url = `${process.env.NEXT_PUBLIC_HOST}/image?section=error&message=Wrong Parameters`;
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
export async function POST(req: any, params: any) {
  const body = await req.json();
  const status = body.status;
  const message = body.message;
  const transactionId = body.untrustedData.transactionId;
  const chain = params.params.chain;
  const address = params.params.address;

  const image_url = `${process.env.NEXT_PUBLIC_HOST}/image?section=${
    status === "error" ? "error" : "payment_success"
  }&message=${message}`;

  const blockExplorer = getChainExplorer(chain, transactionId);
  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:image" content="${image_url}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${image_url}" />
          <meta name="fc:frame:button:1" content="Visit Explorer" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="${blockExplorer}" />
        
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
