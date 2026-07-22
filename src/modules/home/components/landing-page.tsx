"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { 
    Users, 
    Layers, 
    History, 
    FolderKanban, 
    Sparkles, 
    ArrowRight, 
    CheckCircle2 
} from "lucide-react";
import Image from "next/image";

export const LandingPage = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-[#030408] text-slate-100 select-none scroll-smooth">
            {/* Header Navbar */}
            <header className="fixed top-0 inset-x-0 h-16 bg-[#030408]/60 backdrop-blur-xl border-b border-slate-900/60 z-50 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-2.5">
                    <Image src="/logo.svg" alt="Draftly Logo" width={26} height={26} className="h-6 w-auto brightness-200" />
                    <span className="font-bold text-lg tracking-tight text-white">Draftly</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                        <Button variant="ghost" size="sm" className="font-semibold text-slate-400 hover:text-white hover:bg-slate-900/40">
                            Log In
                        </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button size="sm" className="bg-white hover:bg-slate-100 text-black font-semibold rounded-lg px-4 h-9 shadow-sm shrink-0">
                            Get Started
                        </Button>
                    </SignUpButton>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Background Glows (Indent Style) */}
                <div className="absolute top-10 left-1/3 w-[450px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute top-20 right-1/3 w-[450px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* Badge tag */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-950/80 text-blue-400 rounded-full text-xs font-semibold mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <Sparkles className="size-3.5 text-blue-400" />
                    Collaborative Multi-Tab Workspace
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.08] max-w-4xl tracking-tight">
                    The document workspace<br />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        that does more.
                    </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
                    Draftly is the multiplayer document system your team can co-author, structure, and save versions in real-time. Fast, structured, and beautiful.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <SignUpButton mode="modal">
                        <Button size="lg" className="bg-white hover:bg-slate-100 text-black font-bold shadow-lg px-8 py-6 rounded-xl transition hover:scale-[1.01] gap-2">
                            Get Started Free
                            <ArrowRight className="size-4 text-black" />
                        </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <Button size="lg" variant="outline" className="border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:text-white px-8 py-6 rounded-xl text-slate-400 font-medium">
                            Join Existing Workspace
                        </Button>
                    </SignInButton>
                </div>

                {/* Isometric Wireframe & Layout Presentation Panel (Indent Style Layout) */}
                <div className="mt-20 w-full max-w-5xl bg-[#090b11]/80 border border-slate-900 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex h-[500px] relative">
                    
                    {/* Isometric Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#111420_1px,transparent_1px),linear-gradient(to_bottom,#111420_1px,transparent_1px)] bg-[size:24px_24px] opacity-35 pointer-events-none" />

                    {/* Glowing Wireframe Highlights */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Dark Layout Sidebar Panel */}
                    <div className="w-56 shrink-0 border-r border-slate-900 bg-slate-950/60 p-4 hidden md:flex flex-col gap-6 text-left relative z-10">
                        <div className="flex items-center gap-1.5 px-1">
                            <span className="size-2.5 bg-red-500 rounded-full" />
                            <span className="size-2.5 bg-yellow-500 rounded-full" />
                            <span className="size-2.5 bg-green-500 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">STRUCTURE & TABS</span>
                            <div className="flex flex-col gap-1.5">
                                <div className="px-3 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold flex items-center gap-2">
                                    <Layers className="size-3.5" />
                                    1. Main Specs Brief
                                </div>
                                <div className="px-3 py-2 text-slate-400 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-slate-900/40 cursor-pointer">
                                    <Layers className="size-3.5" />
                                    2. Database Schemas
                                </div>
                                <div className="px-3 py-2 text-slate-400 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-slate-900/40 cursor-pointer">
                                    <Layers className="size-3.5" />
                                    3. Webhook Payloads
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Mock Canvas Area */}
                    <div className="flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm relative z-10">
                        {/* Mock Header/Toolbar */}
                        <div className="h-12 border-b border-slate-900 bg-slate-950/40 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-3 bg-slate-800 rounded" />
                                <div className="w-10 h-3 bg-slate-800 rounded ml-4" />
                                <div className="w-16 h-3 bg-slate-800 rounded" />
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Running states label */}
                                <div className="text-[9px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded-md flex items-center gap-1">
                                    <span className="size-1.5 bg-emerald-400 rounded-full animate-ping" />
                                    SAVED TO CLOUD
                                </div>
                                <div className="flex items-center">
                                    <div className="size-5 rounded-full bg-blue-500 border border-slate-950 text-[8px] font-bold text-white flex items-center justify-center -mr-2 z-20">P</div>
                                    <div className="size-5 rounded-full bg-pink-500 border border-slate-950 text-[8px] font-bold text-white flex items-center justify-center z-10">K</div>
                                </div>
                            </div>
                        </div>

                        {/* Editor Mock Sheet */}
                        <div className="flex-1 p-8 text-left flex flex-col gap-4 overflow-hidden relative">
                            {/* Neon Caret Mockups */}
                            <h2 className="text-xl font-extrabold text-white">System Architecture Specifications</h2>
                            
                            <p className="text-xs leading-relaxed text-slate-400 max-w-xl">
                                We are establishing Draftly as a lightning-fast multiplayer workspace. The engine integrates a robust offline document state-sync model backed by real-time presence indicators.
                            </p>

                            <div className="relative inline-block max-w-lg mt-2">
                                <span className="text-xs leading-relaxed text-slate-400">
                                    Teammates can modify properties simultaneously. The database runs automatic 
                                </span>
                                {/* Mock Caret highlights */}
                                <span className="inline-block relative">
                                    <span className="text-xs leading-relaxed text-cyan-400 bg-cyan-950/30 px-1 rounded border border-cyan-500/20"> version snapshots </span>
                                    <span className="absolute -top-6 left-full ml-1 bg-cyan-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center whitespace-nowrap z-30">
                                        Piyush
                                        <span className="absolute top-full left-1 border-4 border-transparent border-t-cyan-500" />
                                    </span>
                                    <span className="absolute inset-y-0 right-0 w-0.5 bg-cyan-400 animate-blink" />
                                </span>
                                <span className="text-xs leading-relaxed text-slate-400">
                                     to log structural revisions and let editors roll back easily.
                                </span>
                            </div>

                            {/* Neon Wireframe Diagram Box (matches Indent style) */}
                            <div className="mt-6 border border-slate-800/80 rounded-xl p-4 bg-slate-950/60 max-w-md relative overflow-hidden flex gap-4 items-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                                <div className="size-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Users className="size-6 text-blue-400" />
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">COLLABORATION SIGNALS</span>
                                        <span className="text-[9px] font-bold text-blue-400">Y.JS ALIGNMENT</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-blue-500" />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] text-slate-400">
                                        <span>2 Active Peers</span>
                                        <span>Latency: 14ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Matrix Section */}
            <section className="bg-[#05060a] border-t border-slate-900 py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Engineered for multiplayer execution</h2>
                        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                            Draftly matches the real-time speed of classic editors while addressing modern tab organization and security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="border border-slate-900 rounded-2xl p-6 bg-[#090b11]/50 hover:border-slate-800 transition shadow-inner">
                            <div className="size-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-5">
                                <Users className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-white">⚡ Speed & Sync</h3>
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                Real-time multiplayer synchronization powered by Y.js and live-cursor visual carets.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="border border-slate-900 rounded-2xl p-6 bg-[#090b11]/50 hover:border-slate-800 transition shadow-inner">
                            <div className="size-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-5">
                                <Layers className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-white">🗂️ Sub-Document Tabs</h3>
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                Structure files cleanly. Organize related documentation under tabs inside a single URL space.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="border border-slate-900 rounded-2xl p-6 bg-[#090b11]/50 hover:border-slate-800 transition shadow-inner">
                            <div className="size-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-5">
                                <History className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-white">⏳ Version Snapshots</h3>
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                Debounced background revision histories automatically capture structural edits and let you restore with one click.
                            </p>
                        </div>
                        {/* Card 4 */}
                        <div className="border border-slate-900 rounded-2xl p-6 bg-[#090b11]/50 hover:border-slate-800 transition shadow-inner">
                            <div className="size-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-5">
                                <FolderKanban className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-white">🏢 Team Workspaces</h3>
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                Division of personal and corporate organizations. Manage user roles and invitation directories via Clerk.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-b from-[#05060a] to-blue-950/40 py-24 px-6 text-center border-t border-slate-900 relative overflow-hidden">
                {/* Neon Background glow */}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Create your first document workspace.</h2>
                    <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                        Experience Draftly&apos;s clean writing experience and real-time collaboration. Completely free for individuals and teams.
                    </p>
                    <div className="mt-8">
                        <SignUpButton mode="modal">
                            <Button size="lg" className="bg-white hover:bg-slate-100 text-black font-bold px-8 py-6 rounded-xl shadow-xl transition hover:scale-[1.01]">
                                Start Writing Free
                            </Button>
                        </SignUpButton>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-blue-500" />
                            No credit card required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-blue-500" />
                            Unlimited cloud savings
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-blue-500" />
                            Real-time synchronization active
                        </span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#030408] py-12 px-6 md:px-12 border-t border-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Draftly Logo" width={22} height={22} className="h-5 w-auto brightness-200" />
                    <span className="font-bold text-sm text-white">Draftly</span>
                </div>
                <p className="text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} Draftly. All rights reserved.
                </p>
            </footer>
        </div>
    );
};
