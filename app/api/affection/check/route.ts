import { NextResponse } from "next/server";
import { checkAffectionDecay } from "@/lib/ai/affection";

export async function POST() {
  const affection = checkAffectionDecay();
  return NextResponse.json({ affection });
}
