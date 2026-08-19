import { Header } from "@/components/layout/Header";
import { SettingsForm } from "./SettingsForm";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const settings = db.getSettings();

  // Mask keys for display
  const maskedSettings = {
    ...settings,
    anthropicApiKey: settings.anthropicApiKey
      ? `sk-ant-...${settings.anthropicApiKey.slice(-4)}`
      : "",
    openaiApiKey: settings.openaiApiKey
      ? `sk-...${settings.openaiApiKey.slice(-4)}`
      : "",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Header
        title="Settings"
        description="Configure AI providers and application preferences"
      />
      <SettingsForm initialSettings={maskedSettings} currentProvider={settings.aiProvider} />
    </div>
  );
}
