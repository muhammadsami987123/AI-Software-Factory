"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-100 text-sm">AI Software Factory</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              How It Works
            </a>
            <a href="#agents" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Agents
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              Start Building
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200",
            open ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {["#features", "#how-it-works", "#agents"].map((href) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {href.replace("#", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </a>
            ))}
            <Link
              href="/projects/new"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <Zap className="h-3.5 w-3.5" />
              Start Building
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
