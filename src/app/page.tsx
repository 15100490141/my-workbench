import GenerateProtoContent from "@/components/GenerateProtoContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "生成 .proto 文件 | My Workbench",
};

export default function GenerateProto() {
  return <GenerateProtoContent />;
}
