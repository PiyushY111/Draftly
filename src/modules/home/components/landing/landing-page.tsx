"use client";
import { Button } from "@/components/ui";


import { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowUpRight, Bell, ChevronRight, Download, FolderTree, History, MessageCircle, Sparkles, Users, WandSparkles } from "lucide-react";
import { LandingHeader } from "./landing-header";
import { LandingFooter } from "./landing-footer";

const avatars = ["M", "J", "A", "S"];
const collaborationFeatures = ["Live co-authoring", "Presence awareness", "Comments in context", "Focused writing", "Version snapshots", "Nested documents", "Workspace inbox", "PDF & HTML exports"];

export const LandingPage = () => {
    const [activeDoc, setActiveDoc] = useState("Project brief");
    const workspaceCopy: Record<string, { title: string; accent: string }> = {
        "Project brief": { title: "A shared source of truth for the work ahead.", accent: "Product / Q3 launch" },
        "Research notes": { title: "The small signals that point toward something big.", accent: "Research / Field notes" },
        "Launch checklist": { title: "Ship with every detail in the right place.", accent: "Launch / Almost ready" },
        "Brand guidelines": { title: "Keep every creative decision beautifully aligned.", accent: "Identity / Foundation" },
    };
    const selectedDoc = workspaceCopy[activeDoc];

    return (
        <main id="top" className="landing-ui min-h-screen overflow-hidden bg-[#fffdf8] text-[#20201e] selection:bg-[#d9f3e6] selection:text-[#20201e]">
            <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(#d8d2c7_0.7px,transparent_0.7px)] [background-size:13px_13px]" />

            <LandingHeader />

            <section className="hero-scene relative min-h-[calc(100svh-5rem)] w-full overflow-hidden bg-[#20201e] px-6 pb-14 pt-44 text-[#fffaf0] sm:px-12 sm:pt-48">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,250,240,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,250,240,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="absolute -left-20 -top-20 size-72 rounded-full border border-[#f4c868]/35" /><div className="absolute -right-24 -bottom-28 size-96 rounded-full border-[28px] border-[#e4664d]/25" />
                <div className="absolute left-10 top-16 hidden h-36 w-52 lg:block"><div className="absolute left-10 top-1 h-20 w-px bg-[#fffaf0]/35" /><div className="absolute left-28 top-1 h-16 w-px bg-[#fffaf0]/35" /><div className="absolute bottom-4 left-1 h-14 w-40 -skew-y-[12deg] rounded-sm border-2 border-[#f4c868] bg-[#f4c868] shadow-[6px_6px_0_#e4664d]" /><div className="absolute bottom-8 left-5 h-14 w-40 -skew-y-[12deg] rounded-sm border-2 border-[#8fd6ef] bg-[#8fd6ef]" /><div className="absolute bottom-12 left-10 h-14 w-40 -skew-y-[12deg] rounded-sm border-2 border-[#8ee1bb] bg-[#8ee1bb]" /><span className="absolute -left-1 bottom-24 rounded-sm bg-[#fffaf0] px-2 py-1 text-[9px] font-bold text-[#20201e]">DRAFT 01</span></div>
                <div className="absolute right-10 top-16 hidden h-40 w-56 lg:block"><div className="absolute right-0 top-2 size-20 rotate-[30deg] border border-[#fffaf0]/25" /><div className="absolute right-12 top-14 size-20 rotate-[30deg] border-2 border-[#8ee1bb] bg-[#8ee1bb] shadow-[5px_5px_0_#e4664d]" /></div>
                <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center lg:pt-4"><div className="inline-flex items-center gap-2 border border-[#fffaf0]/25 bg-[#fffaf0]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c868]"><span className="size-1.5 rounded-full bg-[#8ee1bb]" /> Draftly / real-time workspace</div><h1 className="landing-display mt-7 text-balance text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[4.8rem]">The place where a team&apos;s <span className="text-[#f4c868]">thinking</span> comes together.</h1><p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#d1cdc4] sm:text-lg">Write, discuss, organize, and revisit your work in one shared document space—without losing the thread.</p><SignUpButton mode="modal"><Button size="lg" className="mt-8 h-13 min-w-64 rounded-none bg-[#fffaf0] px-7 text-base font-bold text-[#20201e] transition hover:-translate-y-1 hover:bg-[#f4c868]">Create your workspace <ArrowUpRight className="ml-2 size-4" /></Button></SignUpButton><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fffaf0]/45">Live documents · comments · snapshots · exports</p></div>
            </section>

            <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:pb-28">
                <div className="absolute left-[10%] top-5 -z-10 size-52 rounded-full bg-[#f9df9c]/55 blur-3xl" /><div className="absolute right-[6%] top-36 -z-10 size-56 rounded-full bg-[#cae8f6]/65 blur-3xl" />
                <div className="relative grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
                    <div>
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ded8cb] bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5f5a50] shadow-sm"><span className="flex size-5 items-center justify-center rounded-full bg-[#e4664d] text-white"><Sparkles className="size-3" /></span> Real-time document workspace</div>
                        <h1 className="landing-display max-w-3xl text-balance text-5xl font-medium leading-[0.91] tracking-[-0.065em] sm:text-6xl lg:text-[5.8rem]">A shared source<br />of truth for the<br /><span className="relative text-[#e4664d]">work ahead.<span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f4c868]/80" /></span></h1>
                    </div>
                    <div className="relative max-w-sm justify-self-end border-l-2 border-[#20201e] pl-5 pb-1 sm:pl-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4664d]">A better working rhythm</p><p className="mt-3 text-[15px] leading-[1.65] text-[#716c62]">Draft, discuss, and decide in one living document. No scattered versions.</p><div className="mt-5 flex items-center gap-3"><div className="flex -space-x-2">{avatars.map((avatar, index) => <span key={avatar} className={`flex size-7 items-center justify-center rounded-full border-2 border-[#fffdf8] text-[9px] font-bold ${["bg-[#f4c868]", "bg-[#acd7ef]", "bg-[#dcb5d6]", "bg-[#b9dc9a]"][index]}`}>{avatar}</span>)}</div><span className="text-xs font-bold text-[#5f5a50]">Made for real teams</span></div></div>
                </div>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <SignUpButton mode="modal"><Button size="lg" className="h-13 rounded-full bg-[#e4664d] px-7 text-base font-bold text-white shadow-[5px_5px_0_#20201e] transition hover:translate-x-1 hover:translate-y-1 hover:bg-[#e4664d] hover:shadow-[2px_2px_0_#20201e]">Start a working draft <ArrowUpRight className="ml-2 size-4" /></Button></SignUpButton>
                    <a href="#collaboration" className="group flex h-13 items-center gap-1 rounded-full px-5 text-sm font-bold text-[#3e3d38] transition hover:bg-[#f5f1e8]">See it in action <ChevronRight className="size-4 transition group-hover:translate-x-1" /></a>
                </div>

                <div className="relative mx-auto mt-16 max-w-6xl lg:mt-20">
                    <div className="landing-canvas rounded-[2rem] border-[6px] border-[#20201e] bg-[#20201e] p-1 shadow-[10px_10px_0_#f4c868] sm:p-2">
                        <div className="overflow-hidden rounded-[1.45rem] bg-[#f7f4ee]">
                            <div className="flex h-12 items-center justify-between border-b border-[#ddd8ce] bg-white px-4 sm:px-6">
                                <div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-[#e4664d]" /><i className="size-2.5 rounded-full bg-[#f4c868]" /><i className="size-2.5 rounded-full bg-[#8bc9a8]" /></div>
                                <div className="rounded-full bg-[#f7f4ee] px-3 py-1 text-[10px] font-semibold text-[#7d786e]">draftly.space/product</div>
                            </div>
                            <div className="grid min-h-[340px] grid-cols-[58px_1fr] sm:min-h-[440px] sm:grid-cols-[180px_1fr]">
                                <aside className="border-r border-[#ddd8ce] bg-[#f0ece3] p-3 sm:p-5">
                                    <div className="space-y-3 text-[10px] font-semibold text-[#79746a] sm:text-xs">
                                        {["Project brief", "Research notes", "Launch checklist", "Brand guidelines"].map((doc, index) => <button onClick={() => setActiveDoc(doc)} key={doc} className={`block w-full rounded-lg px-2 py-2 text-left transition ${activeDoc === doc ? "bg-white text-[#20201e] shadow-sm" : "hover:bg-white/60"}`}><span className="sm:hidden">{["✦", "◫", "○", "□"][index]}</span><span className="hidden sm:inline">{["✦ ", "◫ ", "○ ", "□ "][index]}{doc}</span></button>)}
                                    </div>
                                </aside>
                                <div className="relative overflow-hidden p-6 sm:p-10">
                                    <p className="mb-7 text-xs font-bold uppercase tracking-[0.16em] text-[#e4664d]">{selectedDoc.accent}</p>
                                    <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl">{selectedDoc.title}</h2>
                                    <div className="mt-7 max-w-lg space-y-3 text-sm leading-relaxed text-[#716c62] sm:text-base"><p>Draft together with near-zero latency, while live cursors, selections, and friendly labels show exactly where your team is working.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="collaboration" className="relative z-20 -mt-9 w-full overflow-hidden border-y-2 border-[#20201e] bg-[#f4c868] py-6 shadow-[0_7px_0_#20201e] sm:py-7">
                <div className="landing-marquee-track flex w-max items-center whitespace-nowrap text-sm font-bold tracking-[-0.02em] text-[#3c3529] sm:text-base">{[...collaborationFeatures, ...collaborationFeatures].map((feature, index) => <span className="flex items-center" key={`${feature}-${index}`}><span className="px-7 sm:px-10">{feature}</span><span className="text-lg text-[#e4664d]">✦</span></span>)}</div>
            </section>

            <section id="features" className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-24">
                <div className="flex flex-col justify-between gap-6 border-b-2 border-[#20201e] pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4664d]">The document atlas</p><h2 className="landing-display mt-3 max-w-xl text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-5xl">All the good work,<br /><em className="text-[#5c9278]">under one roof.</em></h2></div></div>
                <div className="mt-7 grid gap-4 lg:grid-cols-12">
                    <article className="group relative min-h-80 overflow-hidden rounded-3xl bg-[#20201e] p-7 text-[#fffaf0] lg:col-span-7 sm:p-9"><span className="text-[10px] font-bold tracking-[0.18em] text-[#f4c868]">01 / MAKE IT TOGETHER</span><div className="relative mt-14 max-w-md"><Users className="mb-5 size-8 text-[#8ee1bb]" /><h3 className="landing-display text-3xl font-medium">Live co-authoring, without the chaos.</h3></div></article>
                    <article className="relative min-h-80 overflow-hidden rounded-3xl bg-[#e9f5fb] p-7 text-[#234f68] lg:col-span-5 sm:p-9"><span className="text-[10px] font-bold tracking-[0.18em] text-[#4280a8]">02 / NEVER LOSE THE THREAD</span><History className="mt-8 size-8" /><h3 className="landing-display mt-5 max-w-xs text-3xl font-medium text-[#23526d]">A memory for every good edit.</h3></article>
                    <article className="relative min-h-64 overflow-hidden rounded-3xl border border-[#ded8cb] bg-[#fffdf8] p-7 lg:col-span-4"><FolderTree className="size-7 text-[#5d9155]" /><span className="absolute right-7 top-7 text-[10px] font-bold text-[#a9a295]">03</span><h3 className="landing-display mt-8 text-2xl font-medium">A home for the details.</h3></article>
                    <article className="relative min-h-64 overflow-hidden rounded-3xl bg-[#f4c868] p-7 text-[#3c3529] lg:col-span-4"><MessageCircle className="size-7" /><span className="absolute right-7 top-7 text-[10px] font-bold opacity-60">04</span><h3 className="landing-display mt-8 text-2xl font-medium">Talk beside the line.</h3></article>
                    <article className="relative min-h-64 overflow-hidden rounded-3xl bg-[#e7f5f0] p-7 text-[#276b5b] lg:col-span-4"><div className="flex items-center justify-between"><Bell className="size-7" /><Download className="size-6" /></div><span className="absolute right-7 top-16 text-[10px] font-bold opacity-60">05 + 06</span><h3 className="landing-display mt-7 text-2xl font-medium">Nothing slips through.</h3></article>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
                <div className="relative overflow-hidden rounded-[2rem] border border-[#ded8cb] bg-[#e9f5fb] p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4280a8]">Built for responsive collaboration</p>
                    <div className="relative mt-5 grid gap-9 lg:grid-cols-[1fr_1.25fr] lg:items-end"><h2 className="landing-display max-w-lg text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-5xl">Fast enough for the thought you&apos;re having <em className="text-[#e4664d]">right now.</em></h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{["Next.js 15", "Convex", "Liveblocks + Y.js", "Clerk", "Tiptap", "PDF / HTML / JSON"].map((item, index) => <div className={`rounded-xl bg-white/80 p-4 text-sm font-bold shadow-sm transition hover:-translate-y-1 ${index === 2 ? "text-[#e4664d]" : "text-[#4e5c60]"}`} key={item}>{item}</div>)}</div></div>
                </div>
            </section>

            <section id="teams" className="mx-5 mb-16 overflow-hidden rounded-[2rem] bg-[#20201e] px-6 py-16 text-white sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl lg:px-20">
                <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center"><div><div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#e4664d]"><WandSparkles className="size-5" /></div><h2 className="landing-display mt-6 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-5xl">Every client, team, and personal project in its right place.</h2><p className="mt-5 max-w-lg leading-relaxed text-[#c9c6bf]">Use Clerk-powered organization spaces to keep team directories separate.</p></div></div>
            </section>

            <LandingFooter />
        </main>
    );
};
