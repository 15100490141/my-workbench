import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { ddl } = await request.json();

  try {
    // 使用 Gemini 生成实体类
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given the following MySQL DDL, generate the following Java classes using MyBatis Plus annotations and conventions:

1. Entity class
2. DAO interface
3. DAO implementation
4. Service interface
5. Service implementation

DDL:
${ddl}

Please provide each Java class wrapped in a separate Markdown code block with the language specified as java. Label each code block with a comment indicating which class it is.`;

    const result = await model.generateContent(prompt);
    const generatedCode = result.response.text();

    return NextResponse.json({ generatedCode });
  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
