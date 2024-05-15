import connectToDatabase from "@/lib/db";
import Frame from "@/models/frame";
import {headers} from "next/headers";
import {NextResponse} from "next/server";

interface FrameRequest {
  owner: string;
  command: string;
  url: string;
  description?: string;
}

async function handleDatabaseConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({error: "Internal Server Error", status: 500});
  }
}

export async function POST(req: any) {
  const {owner, command, url, description}: FrameRequest = await req.json();
  const apiKey = headers().get("x-api-key");

  if (apiKey !== process.env.JWS_SECRET) {
    return NextResponse.json({error: "Unauthorized", status: 401});
  }

  if (!owner || !command || !url) {
    return NextResponse.json({error: "Missing fields", status: 400});
  }

  await handleDatabaseConnection();

  const isCommandExists = await Frame.findOne({command});
  if (isCommandExists) {
    return NextResponse.json({error: "Command already exists", status: 400});
  }

  const frame = await Frame.create({owner, command, url, description});
  return NextResponse.json(frame);
}

export async function GET() {
  await handleDatabaseConnection();

  const frames = await Frame.find(
    {},
    {__v: 0, _id: 0, createdAt: 0, updatedAt: 0}
  );
  return NextResponse.json(frames);
}
