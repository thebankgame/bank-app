import { NextResponse } from "next/server";
import OpenAI from "openai";
import { initSettings } from "../../settings";
import { chatEngineFactory } from "../../chat-engine";

import {
  ContextChatEngine,
  Document,
  Settings,
  VectorStoreIndex,
} from "llamaindex";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    console.log("Prompt received:", prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("about to init settings");

    initSettings();
    console.log("settings initialized");

    const chatEngine = await chatEngineFactory(prompt);

    console.log("about to call chatEngine.chat");
    const answer = await chatEngine.chat({ message: prompt });

    return NextResponse.json({ result: answer.message.content || "" });
  } catch (error) {
    console.error("Error in OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}
