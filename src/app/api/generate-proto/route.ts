import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { javaContent } = await request.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given the following Java entity class using MyBatis-Plus annotations, generate a .proto file with the following:

1. Message definitions for the entity
2. Request and response messages for CRUD operations (Create, Read, Update, Delete)
3. Service definition with CRUD methods

Java entity class:
${javaContent}

Please provide the .proto content wrapped in a Markdown code block with the language specified as protobuf.`;

    const result = await model.generateContent(prompt);
    const protoContent = result.response.text();

    return NextResponse.json({ protoContent });
  } catch (error) {
    console.error("Error generating .proto content:", error);
    return NextResponse.json(
      { error: "Failed to generate .proto content" },
      { status: 500 }
    );
  }
}
