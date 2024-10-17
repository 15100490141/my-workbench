"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";

export default function GenerateProtoContent() {
  const [javaContent, setJavaContent] = useState("");
  const [protoContent, setProtoContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const protoContentRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        setJavaContent(content);

        // 更新验证逻辑
        if (
          !content.includes("@TableName") ||
          !content.includes("import com.baomidou.mybatisplus")
        ) {
          setError("上传的文件可能不是有效的 MyBatis-Plus 实体类");
          return;
        }

        setIsLoading(true);
        setError("");
        try {
          const response = await fetch("/api/generate-proto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ javaContent: content }),
          });
          const data = await response.json();
          if (response.ok) {
            setProtoContent(data.protoContent);
          } else {
            throw new Error(data.error || "Failed to generate .proto content");
          }
        } catch (error) {
          console.error("Error generating .proto content:", error);
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/java": [".java"] },
  });

  const handleCopyClick = () => {
    if (protoContentRef.current) {
      const content = protoContentRef.current.textContent;
      if (content) {
        navigator.clipboard.writeText(content).then(
          () => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // 2秒后重置复制状态
          },
          (err) => {
            console.error("无法复制内容: ", err);
          }
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">生成 .proto 文件</h1>
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">拖放文件到这里 ...</p>
        ) : (
          <p className="text-gray-600">
            拖放 Java 实体类文件到这里，或点击选择文件
          </p>
        )}
      </div>
      {error && <div className="text-red-500 font-semibold">错误: {error}</div>}
      {isLoading && (
        <div className="text-blue-500 font-semibold animate-pulse">
          生成中...
        </div>
      )}
      {javaContent && (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            上传的 Java 实体类
          </h2>
          <pre className="bg-white p-4 rounded-md overflow-x-auto border border-gray-200 text-sm">
            <code className="language-java">{javaContent}</code>
          </pre>
        </div>
      )}
      {protoContent && (
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-800">
              生成的 .proto 内容
            </h2>
            <button
              onClick={handleCopyClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            >
              {copySuccess ? "已复制!" : "复制内容"}
            </button>
          </div>
          <div
            ref={protoContentRef}
            className="bg-white p-4 rounded-md overflow-x-auto border border-blue-200"
          >
            <ReactMarkdown className="prose max-w-none">
              {protoContent}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
