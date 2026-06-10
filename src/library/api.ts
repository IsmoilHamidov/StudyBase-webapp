import { supabase } from "@/src/library/supabase";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token ?? ""}`,
  };
}

export async function getTopics() {
  const response = await fetch(`${API_URL}/api/topics`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  return response.json();
}

export async function getInnerTopics(topicId: string) {
  const response = await fetch(
    `${API_URL}/api/inner-topics/${topicId}`,
    {
      cache: "no-store",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inner topics");
  }

  return response.json();
}

export async function getCodeBlocks(innerTopicId: string) {
  const response = await fetch(
    `${API_URL}/api/code-blocks/${innerTopicId}`,
    {
      cache: "no-store",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch code blocks");
  }

  return response.json();
}

export async function getCodeBlock(codeBlockId: string) {
  const response = await fetch(
    `${API_URL}/api/code-blocks/single/${codeBlockId}`,
    {
      cache: "no-store",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch code block");
  }

  return response.json();
}

export async function addTopic(data: {
  title: string;
  description?: string;
}) {
  const response = await fetch(`${API_URL}/api/topics`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add topic");
  }

  return response.json();
}

export async function addInnerTopic(data: {
  topicId: string;
  title: string;
}) {
  const response = await fetch(
    `${API_URL}/api/inner-topics`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add inner topic");
  }

  return response.json();
}

export async function addCodeBlock(data: {
  innerTopicId: string;
  title: string;
  subject: string;
  content: string;
  contentType?:
    | "code"
    | "math"
    | "english"
    | "theory"
    | "other";
}){
  const response = await fetch(
    `${API_URL}/api/code-blocks`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        innerTopicId: data.innerTopicId,
        title: data.title,
        content: data.content,
        contentType: data.contentType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add code block");
  }

  return response.json();
}

export async function explainCodeBlock(codeBlockId: string) {
  const response = await fetch(`${API_URL}/api/ai/explain-code/${codeBlockId}`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to explain code");
  }

  return data;
}

export async function getCodeExplanations(
  codeBlockId: string
) {
  const response = await fetch(
    `${API_URL}/api/code-explanations/${codeBlockId}`,
    {
      cache: "no-store",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch explanations");
  }

  return response.json();
}

export async function deleteCodeBlock(
  codeBlockId: string
) {
  const response = await fetch(
    `${API_URL}/api/code-blocks/${codeBlockId}`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete code block"
    );
  }

  return response.json();
}

export async function updateCodeBlock(
  codeBlockId: string,
  data: {
    title: string;
    language: string;
    code: string;
  }
) {
  const response = await fetch(
    `${API_URL}/api/code-blocks/${codeBlockId}`,
    {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update code block"
    );
  }

  return response.json();
}

export async function deleteInnerTopic(
  innerTopicId: string
) {
  const response = await fetch(
    `${API_URL}/api/inner-topics/${innerTopicId}`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete inner topic"
    );
  }

  return response.json();
}

export async function updateTopic(
  topicId: string,
  data: {
    title: string;
    description?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/api/topics/${topicId}`,
    {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update topic");
  }

  return response.json();
}

export async function updateInnerTopic(innerTopicId: string, data: { title: string }) {
  const response = await fetch(
    `${API_URL}/api/inner-topics/${innerTopicId}`,
    {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Backend error:", result);
    throw new Error(result.message || "Failed to update inner topic");
  }

  return result;
}

export async function generateQuestions(codeBlockId: string) {
  const response = await fetch(
    `${API_URL}/api/ai/generate-questions/${codeBlockId}`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
    }
  );
 
  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }
 
  return response.json();
}
 

export async function askAboutLine(data: {
  codeLine: string;
  existingExplanation: string;
  userQuestion: string;
  contentType: string;
}) {
  const response = await fetch(
    `${API_URL}/api/ai/ask-question`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );
 
  if (!response.ok) {
    throw new Error("Failed to get answer");
  }
 
  return response.json();
}

export async function deleteTopic(topicId: string) {
  const response = await fetch(
    `${API_URL}/api/topics/${topicId}`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete topic");
  }

  return response.json();
}