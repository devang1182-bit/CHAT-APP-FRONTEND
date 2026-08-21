import { db } from "@/firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    console.log("message route is running");
    const messageId = searchParams.get("messageId");
    const text = searchParams.get("text");

    if (!text && !messageId) {
      return NextResponse.json(
        { error: "Text and id is required" },
        { status: 400 },
      );
    }
    const docRef = doc(db, "messages", messageId ?? "");
    const updatedMessage = await updateDoc(docRef, {
      message: text,
      createdAt: Date.now(),
    });
    console.log("Updated Messages", updatedMessage);
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
