"use client";
import { Button } from "@/components/ui";


import { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";

export const LandingHeader = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <header className="fixed left-1/2 top-4 z-40 w-[calc(100%-2.5rem)] max-w-6xl -translate-x-1/2 sm:top-6 sm:w-[calc(100%-4rem)]">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#ded8cb] bg-[#fffdf8]/90 p-2 shadow-[4px_4px_0_#f4c868] backdrop-blur-md sm:rounded-[1.25rem] sm:p-2.5">
                <a href="#top" className="group flex items-center gap-2.5 rounded-xl px-2 py-1 transition hover:bg-[#f4f0e7]">
                    <div className="relative flex size-9 items-center justify-center rounded-xl bg-[#20201e] shadow-[2px_2px_0_#e4664d] transition group-hover:-rotate-6">
                        <Image src="/logo.svg" alt="Draftly" width={22} height={22} className="brightness-0 invert" />
                        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#fffdf8] bg-[#7ac29b]" />
                    </div>
                    <span className="hidden text-lg font-bold tracking-[0.08em] sm:block">Draftly</span>
                </a>

                <div className="landing-header-signal hidden items-center gap-2 rounded-xl border border-[#ded8cb] bg-[#f3efe6] px-3 py-2 md:flex">
                    <div className="relative flex size-5 items-end justify-center">
                        <i className="absolute bottom-0 h-3 w-3 rounded-sm bg-[#acd7ef]" />
                        <i className="absolute bottom-0 left-0 h-4 w-3 -rotate-6 rounded-sm bg-[#f4c868]" />
                        <i className="absolute bottom-0 right-0 h-5 w-3 rotate-6 rounded-sm bg-[#e4664d]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#706b61]">A desk for ideas</span>
                    <span className="size-1.5 rounded-full bg-[#e4664d]" />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button variant="ghost" size="icon" className="size-9 rounded-xl md:hidden" aria-label="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}>
                        <Menu className="size-5" />
                    </Button>
                    <SignInButton mode="modal">
                        <Button variant="ghost" className="hidden h-9 rounded-xl px-3 text-xs font-bold hover:bg-[#f4f0e7] hover:text-[#e4664d] sm:flex">Sign in</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button className="h-9 rounded-xl bg-[#e4664d] px-3 text-xs font-bold text-white shadow-[2px_2px_0_#20201e] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#e4664d] hover:shadow-none sm:px-4">
                            Start free <ArrowUpRight className="ml-1 size-3.5" />
                        </Button>
                    </SignUpButton>
                </div>
            </div>
            {mobileNavOpen && (
                <div className="absolute inset-x-0 top-[5.75rem] rounded-2xl border border-[#ded8cb] bg-[#fffdf8] p-3 shadow-[5px_5px_0_#f4c868] md:hidden">
                    <p className="px-2 pt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#847d70]">Draftly is ready when you are.</p>
                    <SignInButton mode="modal">
                        <button className="mt-2 w-full rounded-xl bg-[#f4f0e7] px-4 py-3 text-left text-sm font-semibold text-[#e4664d]">Sign in to your workspace</button>
                    </SignInButton>
                </div>
            )}
        </header>
    );
};
