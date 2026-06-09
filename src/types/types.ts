export interface Topic {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface InnerTopic {
  id: string;
  topic_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CodeBlock {
  id: string;
  inner_topic_id: string;
  title: string;
  language: string;
  code: string;
  content_type: "code" | "math" | "english" | "theory" | "other" | null;
  overall_summary: string | null;
  created_at: string;
  updated_at: string;
}

export type CodeExplanation = {
  id: string;
  code_block_id: string;
  line_number: number;
  code_line: string;
  explanation: string;
  created_at: string;
};
