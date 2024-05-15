import {NextResponse} from "next/server";

export function GET(req: any) {
  return NextResponse.json({message: "Hello World"});
}
