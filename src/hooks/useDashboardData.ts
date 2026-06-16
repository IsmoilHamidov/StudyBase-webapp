"use client";

import { useEffect, useState } from "react";

import {
  addCodeBlock,
  addInnerTopic,
  addTopic,
  deleteCodeBlock,
  deleteInnerTopic,
  deleteTopic,
  explainCodeBlock,
  generateQuestions,       // <-- ADD THIS IMPORT
  getCodeBlocks,
  getCodeExplanations,
  getInnerTopics,
  getTopics,
  reorderCodeBlocks,
  reorderInnerTopics,
  updateCodeBlock,
  updateInnerTopic,
  updateTopic,
} from "@/src/library/api";

import type {
  CodeBlock,
  CodeExplanation,
  InnerTopic,
  Topic,
} from "@/src/types/types";

import type { QuizQuestion } from "@/src/components/ai/QuizPanel"; // <-- ADD THIS

export function useDashboardData() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [innerTopics, setInnerTopics] = useState<InnerTopic[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [explanations, setExplanations] = useState<CodeExplanation[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // --- NEW: quiz state ---
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedInnerTopic, setSelectedInnerTopic] =
    useState<InnerTopic | null>(null);
  const [selectedCodeBlock, setSelectedCodeBlock] =
    useState<CodeBlock | null>(null);

  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);

  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddInnerTopicModal, setShowAddInnerTopicModal] = useState(false);
  const [showAddCodeBlockModal, setShowAddCodeBlockModal] = useState(false);
  const [showEditCodeBlockModal, setShowEditCodeBlockModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showEditInnerTopicModal, setShowEditInnerTopicModal] = useState(false);

  useEffect(() => {
    async function loadTopics() {
      const result = await getTopics();
      setTopics(result.data);
      if (result.data.length > 0) setSelectedTopic(result.data[0]);
      setLoading(false);
    }
    loadTopics();
  }, []);

  useEffect(() => {
    async function loadInnerTopics() {
      if (!selectedTopic) return;
      const result = await getInnerTopics(selectedTopic.id);
      setInnerTopics(result.data);
      setCodeBlocks([]);
      setSelectedCodeBlock(null);
      setExplanations([]);
      setQuizQuestions([]); // <-- reset quiz on topic change
      if (result.data.length > 0) {
        setSelectedInnerTopic(result.data[0]);
      } else {
        setSelectedInnerTopic(null);
      }
    }
    loadInnerTopics();
  }, [selectedTopic]);

  useEffect(() => {
    async function loadCodeBlocks() {
      if (!selectedInnerTopic) return;
      const result = await getCodeBlocks(selectedInnerTopic.id);
      setCodeBlocks(result.data);
      setExplanations([]);
      setQuizQuestions([]); // <-- reset quiz on inner topic change
      if (result.data.length > 0) {
        setSelectedCodeBlock(result.data[0]);
      } else {
        setSelectedCodeBlock(null);
      }
    }
    loadCodeBlocks();
  }, [selectedInnerTopic]);

  useEffect(() => {
    async function loadExplanations() {
      if (!selectedCodeBlock) {
        setExplanations([]);
        setQuizQuestions([]); // <-- reset quiz when code block changes
        return;
      }
      try {
        const result = await getCodeExplanations(selectedCodeBlock.id);
        setExplanations(result.data);
        setQuizQuestions([]); // reset quiz for new code block
      } catch {
        setExplanations([]);
      }
    }
    loadExplanations();
  }, [selectedCodeBlock]);

  // --- NEW: generate quiz handler ---
  async function handleGenerateQuiz() {
    if (!selectedCodeBlock) return;
    try {
      setAiError(null);
      setGeneratingQuiz(true);
      setQuizQuestions([]);
      const result = await generateQuestions(selectedCodeBlock.id);
      setQuizQuestions(result.data ?? []);
    } catch (err: any) {
      const isRateLimit =
        err.message?.includes("limiti tugadi") ||
        err.message?.includes("429");
      setAiError(
        isRateLimit
          ? "Bugungi AI so'rovlar limiti tugadi. Iltimos ertaga qayta urinib ko'ring. 🕐"
          : null
      );
    } finally {
      setGeneratingQuiz(false);
    }
  }

  async function handleAddTopic(data: { title: string; description?: string }) {
    const created = await addTopic(data);
    const result = await getTopics();
    setTopics(result.data);
    setSelectedTopic(created.data);
  }

  async function handleAddInnerTopic(data: { title: string }) {
    if (!selectedTopic) return;
    const created = await addInnerTopic({ topicId: selectedTopic.id, title: data.title });
    const result = await getInnerTopics(selectedTopic.id);
    setInnerTopics(result.data);
    setSelectedInnerTopic(created.data);
  }

  async function handleDeleteTopic() {
    if (!selectedTopic) return;
    const confirmed = window.confirm(
      "Delete this topic and all content inside it?"
    );
    if (!confirmed) return;
    await deleteTopic(selectedTopic.id);
    const result = await getTopics();
    setTopics(result.data);
    if (result.data.length > 0) {
      setSelectedTopic(result.data[0]);
    } else {
      setSelectedTopic(null);
      setInnerTopics([]);
      setCodeBlocks([]);
      setSelectedInnerTopic(null);
      setSelectedCodeBlock(null);
      setExplanations([]);
      setQuizQuestions([]);
    }
  }

  async function handleAddCodeBlock(data: {
    title: string;
    content: string;
    contentType: "code" | "math" | "english" | "theory" | "other";
  }) {
    if (!selectedInnerTopic) return;
    const created = await addCodeBlock({
      innerTopicId: selectedInnerTopic.id,
      title: data.title,
      content: data.content,
      contentType: data.contentType,
      subject: selectedTopic?.title ?? "",
    });
    const result = await getCodeBlocks(selectedInnerTopic.id);
    setCodeBlocks(result.data);
    setSelectedCodeBlock(created.data);
  }

  async function handleExplainCode() {
    if (!selectedCodeBlock || !selectedInnerTopic) return;
    try {
      setAiError(null);
      setExplaining(true);
      await explainCodeBlock(selectedCodeBlock.id);
      const explanationResult = await getCodeExplanations(selectedCodeBlock.id);
      const codeBlocksResult = await getCodeBlocks(selectedInnerTopic.id);
      setExplanations(explanationResult.data);
      setCodeBlocks(codeBlocksResult.data);
      setQuizQuestions([]);
      const updated = codeBlocksResult.data.find(
        (block: CodeBlock) => block.id === selectedCodeBlock.id
      );
      if (updated) setSelectedCodeBlock(updated);
    } catch (err: any) {
      const isRateLimit =
        err.message?.includes("limiti tugadi") ||
        err.message?.includes("429");
      setAiError(
        isRateLimit
          ? "Bugungi AI so'rovlar limiti tugadi. Iltimos ertaga qayta urinib ko'ring. 🕐"
          : null // silent for other errors — they're usually network/server issues
      );
    } finally {
      setExplaining(false);
    }
  }

  async function handleDeleteCodeBlock() {
    if (!selectedCodeBlock || !selectedInnerTopic) return;
    const confirmed = window.confirm("Delete this code block?");
    if (!confirmed) return;
    await deleteCodeBlock(selectedCodeBlock.id);
    const result = await getCodeBlocks(selectedInnerTopic.id);
    setCodeBlocks(result.data);
    if (result.data.length > 0) {
      setSelectedCodeBlock(result.data[0]);
    } else {
      setSelectedCodeBlock(null);
      setExplanations([]);
      setQuizQuestions([]);
    }
  }

  async function handleUpdateCodeBlock(data: {
    title: string;
    code: string;
  }) {
    if (!selectedCodeBlock || !selectedInnerTopic) return;
    const updated = await updateCodeBlock(selectedCodeBlock.id, data);
    const result = await getCodeBlocks(selectedInnerTopic.id);
    setCodeBlocks(result.data);
    setSelectedCodeBlock(updated.data);
    setExplanations([]);
    setQuizQuestions([]);
  }

  async function handleDeleteInnerTopic() {
    if (!selectedInnerTopic || !selectedTopic) return;
    const confirmed = window.confirm(
      "Delete this inner topic and all code blocks inside it?"
    );
    if (!confirmed) return;
    await deleteInnerTopic(selectedInnerTopic.id);
    const result = await getInnerTopics(selectedTopic.id);
    setInnerTopics(result.data);
    if (result.data.length > 0) {
      setSelectedInnerTopic(result.data[0]);
    } else {
      setSelectedInnerTopic(null);
      setCodeBlocks([]);
      setSelectedCodeBlock(null);
      setExplanations([]);
      setQuizQuestions([]);
    }
  }

  async function handleUpdateTopic(data: { title: string; description?: string }) {
    if (!selectedTopic) return;
    const updated = await updateTopic(selectedTopic.id, data);
    const result = await getTopics();
    setTopics(result.data);
    setSelectedTopic(updated.data);
  }

  async function handleUpdateInnerTopic(data: { title: string }): Promise<void> {
    if (!selectedInnerTopic || !selectedTopic) return;
    await updateInnerTopic(selectedInnerTopic.id, data);
    const result = await getInnerTopics(selectedTopic.id);
    setInnerTopics(result.data);
    const refreshed = result.data.find(
      (t: InnerTopic) => t.id === selectedInnerTopic.id
    );
    if (refreshed) setSelectedInnerTopic(refreshed);
  }

  async function handleReorderInnerTopics(orderedIds: string[]) {
        setInnerTopics((prev) => {
          const map = new Map(prev.map((t) => [t.id, t]));
          return orderedIds.map((id) => map.get(id)!).filter(Boolean);
        });
        await reorderInnerTopics(orderedIds);
      }
    
      async function handleReorderCodeBlocks(orderedIds: string[]) {
        setCodeBlocks((prev) => {
          const map = new Map(prev.map((b) => [b.id, b]));
          return orderedIds.map((id) => map.get(id)!).filter(Boolean);
        });
        await reorderCodeBlocks(orderedIds);
      }

  return {
    topics,
    filteredTopics,
    innerTopics,
    codeBlocks,
    explanations,

    // --- NEW ---
    quizQuestions,
    generatingQuiz,
    handleGenerateQuiz,

    selectedTopic,
    selectedInnerTopic,
    selectedCodeBlock,

    setSelectedTopic,
    setSelectedInnerTopic,
    setSelectedCodeBlock,

    loading,
    explaining,

    searchTerm,
    setSearchTerm,

    showAddTopicModal,
    setShowAddTopicModal,
    showAddInnerTopicModal,
    setShowAddInnerTopicModal,
    showAddCodeBlockModal,
    setShowAddCodeBlockModal,
    showEditCodeBlockModal,
    setShowEditCodeBlockModal,
    handleUpdateTopic,
    handleAddTopic,
    handleDeleteTopic,
    handleAddInnerTopic,
    handleAddCodeBlock,
    handleExplainCode,
    handleDeleteCodeBlock,
    handleUpdateCodeBlock,
    handleDeleteInnerTopic,
    showEditTopicModal,
    setShowEditTopicModal,
    handleUpdateInnerTopic,
    handleReorderInnerTopics,
    handleReorderCodeBlocks,
    showEditInnerTopicModal,
    setShowEditInnerTopicModal,
    aiError,
    setAiError
  };
}