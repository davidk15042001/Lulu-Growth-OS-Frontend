import { KnowledgeActivationGate } from "../../components/KnowledgeActivationGate";
import { KnowledgeBaseWorkspace } from "../../components/KnowledgeBaseWorkspace";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useLuluApp } from "../../api/LuluAppContext";

export default function KnowledgePage() {
  const { selectedWorkspace } = useLuluApp();
  const activationMode = selectedWorkspace?.onboardingStep === "knowledge_base" && !selectedWorkspace.onboardingCompletedAt;

  if (activationMode) {
    return (
      <main className="lulu-knowledge-route-surface">
        <KnowledgeActivationGate />
      </main>
    );
  }

  return (
    <WorkspaceSurfaceShell activeSlug="rich-field-1880" showGlobalNavigation={false}>
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-8">
        <KnowledgeBaseWorkspace />
      </main>
    </WorkspaceSurfaceShell>
  );
}
