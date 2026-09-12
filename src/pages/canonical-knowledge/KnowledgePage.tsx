import { KnowledgeActivationGate } from "../../components/KnowledgeActivationGate";
import { KnowledgeBaseWorkspace } from "../../components/KnowledgeBaseWorkspace";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useLuluApp } from "../../api/LuluAppContext";

export default function KnowledgePage() {
  const { selectedWorkspace } = useLuluApp();
  const activationMode = selectedWorkspace?.onboardingStep === "knowledge_base" && !selectedWorkspace.onboardingCompletedAt;

  return (
    <WorkspaceSurfaceShell activeSlug="rich-field-1880">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-8">
        {activationMode ? <KnowledgeActivationGate /> : <KnowledgeBaseWorkspace />}
      </main>
    </WorkspaceSurfaceShell>
  );
}
