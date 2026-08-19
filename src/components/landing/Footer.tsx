import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-zinc-100 text-sm">AI Software Factory</span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              A visual multi-agent software development workspace.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Product</div>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Dashboard</Link>
                <Link href="/projects/new" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">New Project</Link>
                <Link href="/agents" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Agents</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Resources</div>
              <div className="flex flex-col gap-2">
                <a href="#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">How It Works</a>
                <Link href="/settings" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Settings</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2026 AI Software Factory Contributors. MIT License.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
