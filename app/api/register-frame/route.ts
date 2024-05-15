import connectToDatabase from "@/lib/db";
import Frame from "@/models/frame";
import {headers} from "next/headers";
import {NextResponse} from "next/server";

export async function POST(req: any) {
  const {owner, command, url, description} = await req.json();
  const apiKey = headers().get("x-api-key");
  //enforece some api rules, temporarily using jws token for owner

  if (apiKey !== process.env.JWS_SECRET) {
    return NextResponse.json({error: "unauthorized", status: 401});
  }

  if (!owner || !command || !url) {
    return NextResponse.json({error: "missing fields"});
  }

  try {
    await connectToDatabase();

    const isCommandExists = await Frame.findOne({command});

    if (isCommandExists) {
      return NextResponse.json({error: "command already exists", status: 400});
    }

    const frame = await Frame.create({owner, command, url, description});
    return NextResponse.json(frame);
  } catch (error) {
    return NextResponse.json({error, status: 500});
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const frames = await Frame.find(
      {},
      {
        __v: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );
    return NextResponse.json(frames);
  } catch (error) {
    return NextResponse.json({error, status: 500});
  }
}
