import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AgentSection } from "@/components/landing/AgentSection";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AgentSection />

        {/* CTA Section */}
        <section className="py-20 sm:py-28 border-t border-zinc-800">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight mb-4">
              Ready to build with AI agents?
            </h2>
            <p className="text-zinc-400 text-lg mb-10">
              No API key required. Start in Demo Mode and see your product idea transformed into a complete engineering blueprint in under two minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/20 text-sm"
              >
                <Zap className="h-4 w-4" />
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-medium px-8 py-3.5 rounded-xl transition-all duration-150 text-sm"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
