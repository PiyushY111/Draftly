"use client";

import { FooterLinkGroup } from "./landing-footer-links";

export const LandingFooter = () => {
    return (
        <footer className="relative overflow-hidden bg-[#20201e] px-5 pt-16 text-[#fffaf0] sm:px-8 sm:pt-24 select-none">
            <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full border-[40px] border-[#e4664d] opacity-90" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-full opacity-15 [background-image:radial-gradient(#f4c868_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4c868]">We&apos;re here to help</p>
                        <h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl">
                            Need a hand with your <span className="text-[#e4664d]">next draft?</span>
                        </h2>
                        <p className="mt-7 max-w-md text-base leading-relaxed text-[#c9c3b8]">
                            Questions, feedback, or a problem with your workspace? Send a note to the Draftly team and we&apos;ll get back to you.
                        </p>
                        <p className="landing-display mt-9 text-2xl italic tracking-[-0.04em] text-[#f4c868] sm:text-3xl">
                            Support:{" "}
                            <a href="mailto:draftly@piyushydv.com" className="border-b border-[#e4664d] text-[#fffaf0] transition hover:border-[#f4c868] hover:text-[#e4664d]">
                                draftly@piyushydv.com
                            </a>
                        </p>
                    </div>
                    <div className="relative mx-auto w-full max-w-md self-center rotate-[-3deg] rounded-sm bg-[#f4c868] p-3 text-[#20201e] shadow-[10px_11px_0_#e4664d] transition duration-300 hover:rotate-0">
                        <div className="min-h-80 border border-dashed border-[#806c3e] p-6 sm:p-8">
                            <div className="flex items-start justify-between">
                                <span className="text-xs font-bold uppercase tracking-[0.14em]">A postcard from Draftly</span>
                                <span className="flex size-12 items-center justify-center border-2 border-[#e4664d] text-xs font-bold text-[#e4664d]">D<br />LY</span>
                            </div>
                            <p className="mt-14 max-w-xs font-serif text-3xl italic leading-tight">“The best ideas begin as a small, shared thing.”</p>
                            <div className="mt-12 flex items-end justify-between">
                                <span className="font-serif text-xl italic">— your future self</span>
                                <span className="text-2xl">♥</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-20 grid border-y border-white/15 sm:grid-cols-3">
                    <FooterLinkGroup title="Find your way" links={["How it works", "Why Draftly", "For teams", "Templates"]} />
                    <FooterLinkGroup title="Behind the scenes" links={["Our story", "Changelog", "Careers", "Contact"]} />
                    <FooterLinkGroup title="Keep in touch" links={["Instagram", "LinkedIn", "X / Twitter", "Privacy"]} />
                </div>
                <div className="flex flex-col justify-between gap-6 py-7 text-xs font-medium text-[#bdb7ac] sm:flex-row sm:items-center">
                    <span>© {new Date().getFullYear()} Draftly, Inc. Made for meaningful work.</span>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-[#f4c868]">Terms</a>
                        <a href="#" className="hover:text-[#f4c868]">Privacy</a>
                        <span className="flex size-7 items-center justify-center rounded-full bg-[#fffaf0] font-bold text-[#20201e]">D</span>
                    </div>
                </div>
                <p className="pointer-events-none -mb-5 select-none text-center text-[22vw] font-bold leading-none tracking-[-0.12em] text-transparent [-webkit-text-stroke:1px_rgba(255,250,240,0.22)] sm:-mb-9">
                    Draftly
                </p>
            </div>
        </footer>
    );
};
