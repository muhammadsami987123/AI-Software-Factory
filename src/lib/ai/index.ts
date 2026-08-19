import type { AIProvider, AIMode } from "@/types";
import { DemoProvider } from "./demo-provider";
import { AnthropicProvider } from "./anthropic-provider";
import { OpenAIProvider } from "./openai-provider";

export function createProvider(
  mode: AIMode,
  options?: { apiKey?: string; model?: string }
): AIProvider {
  switch (mode) {
    case "anthropic": {
      const key = options?.apiKey ?? process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error("ANTHROPIC_API_KEY is required for Anthropic provider");
      return new AnthropicProvider(key, options?.model);
    }
    case "openai": {
      const key = options?.apiKey ?? process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY is required for OpenAI provider");
      return new OpenAIProvider(key, options?.model);
    }
    case "demo":
    default:
      return new DemoProvider();
  }
}

export { DemoProvider, AnthropicProvider, OpenAIProvider };
