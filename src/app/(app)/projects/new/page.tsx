import { Header } from "@/components/layout/Header";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Header
        title="New Project"
        description="Describe your product idea and let five AI agents build your engineering blueprint"
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <CreateProjectForm />
      </div>
    </div>
  );
}
