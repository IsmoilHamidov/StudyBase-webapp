"use client";

import AuthGuard from "@/src/components/auth/AuthGuard";
import ExplanationPanel from "@/src/components/ai/ExplanationPanel";
import AddCodeBlockButton from "@/src/components/code-blocks/AddCodeBlockButton";
import AddCodeBlockModal from "@/src/components/code-blocks/AddCodeBlockModal";
import CodeBlockList from "@/src/components/code-blocks/CodeBlockList";
import CodeViewer from "@/src/components/code-blocks/CodeViewer";
import EditCodeBlockModal from "@/src/components/code-blocks/EditCodeBlockModal";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardStats from "@/src/components/dashboard/DashboardStats";
import AddInnerTopicButton from "@/src/components/inner-topics/AddInnerTopicButton";
import AddInnerTopicModal from "@/src/components/inner-topics/AddInnerTopicModal";
import InnerTopicList from "@/src/components/inner-topics/InnerTopicList";
import AddTopicModal from "@/src/components/topics/AddTopicModal";

import { useDashboardData } from "@/src/hooks/useDashboardData";
import EditTopicModal from "@/modals/EditTopicModal";
import EditInnerTopicModal from "@/modals/EditInnerTopicModal";
import { Trash2 } from "lucide-react";
import { Pencil } from 'lucide-react';
import QuizPanel from "../ai/QuizPanel";

export default function DashboardMain() {
  const dashboard = useDashboardData();

  return (
    <AuthGuard>
      {dashboard.loading ? (
        <main className="flex min-h-screen text-2xl items-center justify-center bg-gray-100">
          Yuklanmoqda...
        </main>
      ) : (
        <DashboardLayout
          sidebar={
            <DashboardSidebar
            topics={dashboard.filteredTopics}
            selectedTopicId={dashboard.selectedTopic?.id ?? null}
            onSelectTopic={dashboard.setSelectedTopic}
            searchTerm={dashboard.searchTerm}
            onSearchChange={dashboard.setSearchTerm}
          />
          }
        >
        <DashboardHeader
          title={dashboard.selectedTopic?.title ?? "Mavzu tanlanmagan"}
          description={dashboard.selectedTopic?.description}
          onAddTopic={() => dashboard.setShowAddTopicModal(true)}
          onEditTopic={() => dashboard.setShowEditTopicModal(true)}
          editTopicDisabled={!dashboard.selectedTopic}
        />
          
       
          <DashboardStats
            topicCount={dashboard.topics.length}
            innerTopicCount={
              dashboard.innerTopics.length
            }
            codeBlockCount={
              dashboard.codeBlocks.length
            }
            explanationCount={
              dashboard.explanations.length
            }
          />
          <div className="relative  mb-12">
            <div className="h-4 border-b-2 border-gray-300 rounded-full"></div>
          </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <section className="rounded-xl border border-gray-200 bg-white/40 p-4 sm:p-5 shadow-sm">
                {/* Header section adapted to stack on mobile */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-700">
                    Modullar
                  </h3>

                  {/* Button wrapper grid on mobile, row flex on sm screens onwards */}
                  <div className="grid grid-cols-2 gap-2 gap-y-3 sm:flex sm:items-center">
                    <button
                      disabled={!dashboard.selectedInnerTopic}
                      onClick={dashboard.handleDeleteInnerTopic}
                      className="flex items-center justify-center rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transitions sm:py-1.5"
                    >
                      Oʻchirish <Trash2 className="ms-1.5" size={15} />
                    </button>

                    <button
                      disabled={!dashboard.selectedInnerTopic}
                      onClick={() => dashboard.setShowEditInnerTopicModal(true)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-violet-50 border border-violet-200 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition sm:py-1.5"
                    >
                      <Pencil size={14} />
                      Tahrirlash
                    </button>

                    {/* Add button spans full width on mobile view below sm */}
                    <div className="col-span-2 sm:col-span-1">
                      <AddInnerTopicButton
                        disabled={!dashboard.selectedTopic}
                        onClick={() => dashboard.setShowAddInnerTopicModal(true)}
                        // Tip: Ensure your inner button component style uses w-full sm:w-auto if needed
                      />
                    </div>
                  </div>
                </div>

                <InnerTopicList
                  innerTopics={dashboard.innerTopics}
                  selectedInnerTopicId={dashboard.selectedInnerTopic?.id ?? null}
                  onSelectInnerTopic={dashboard.setSelectedInnerTopic}
                />
                <EditInnerTopicModal
                  open={dashboard.showEditInnerTopicModal}
                  onClose={() => dashboard.setShowEditInnerTopicModal(false)}
                  initialTitle={dashboard.selectedInnerTopic?.title ?? ""}
                  onSubmit={dashboard.handleUpdateInnerTopic}
                />
              </section>

              <section className="rounded-xl border border-gray-200 bg-white/40 p-4 sm:p-5 shadow-sm">
                {/* Second section header updated similarly */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-700">
                    Kontent bloklari
                  </h3>

                  <div className="w-full sm:w-auto">
                    <AddCodeBlockButton
                      disabled={!dashboard.selectedInnerTopic}
                      onClick={() => dashboard.setShowAddCodeBlockModal(true)}
                    />
                  </div>
                </div>

                <CodeBlockList
                  codeBlocks={dashboard.codeBlocks}
                  selectedCodeBlockId={dashboard.selectedCodeBlock?.id ?? null}
                  onSelectCodeBlock={dashboard.setSelectedCodeBlock}
                />
              </section>
          </div>

          <CodeViewer
            codeBlock={
              dashboard.selectedCodeBlock
            }
            onExplain={
              dashboard.handleExplainCode
            }
            onDelete={
              dashboard.handleDeleteCodeBlock
            }
            onEdit={() =>
              dashboard.setShowEditCodeBlockModal(
                true
              )
            }
            explaining={dashboard.explaining}
          />

          <ExplanationPanel
            summary={dashboard.selectedCodeBlock?.overall_summary}
            explanations={dashboard.explanations}
            contentType={dashboard.selectedCodeBlock?.content_type ?? "code"}
          />
        <QuizPanel
            questions={dashboard.quizQuestions}
            loading={dashboard.generatingQuiz}
            onGenerate={dashboard.handleGenerateQuiz}
            hasExplanation={
              !!dashboard.selectedCodeBlock?.overall_summary ||
              dashboard.explanations.length > 0
            }
          />
          <AddTopicModal
            open={
              dashboard.showAddTopicModal
            }
            onClose={() =>
              dashboard.setShowAddTopicModal(
                false
              )
            }
            onSubmit={
              dashboard.handleAddTopic
            }
          />

          <AddInnerTopicModal
            open={
              dashboard.showAddInnerTopicModal
            }
            onClose={() =>
              dashboard.setShowAddInnerTopicModal(
                false
              )
            }
            onSubmit={
              dashboard.handleAddInnerTopic
            }
          />

          <AddCodeBlockModal
            open={
              dashboard.showAddCodeBlockModal
            }
            onClose={() =>
              dashboard.setShowAddCodeBlockModal(
                false
              )
            }
            onSubmit={
              dashboard.handleAddCodeBlock
            }
          />

          <EditCodeBlockModal
            open={
              dashboard.showEditCodeBlockModal
            }
            codeBlock={
              dashboard.selectedCodeBlock
            }
            onClose={() =>
              dashboard.setShowEditCodeBlockModal(
                false
              )
            }
            onSubmit={
              dashboard.handleUpdateCodeBlock
            }
          />

          <EditTopicModal
            open={
              dashboard.showEditTopicModal
            }
            onClose={() =>
              dashboard.setShowEditTopicModal(
                false
              )
            }
            initialTitle={
              dashboard.selectedTopic?.title ??
              ""
            }
            initialDescription={
              dashboard.selectedTopic
                ?.description ?? ""
            }
            onSubmit={
              dashboard.handleUpdateTopic
            }
          />
        </DashboardLayout>
      )}
    </AuthGuard>
  );
}