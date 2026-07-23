"use client";

type Props = {
    title: string;
    links: string[];
};

export const FooterLinkGroup = ({ title, links }: Props) => {
    return (
        <div className="border-white/15 px-0 py-7 sm:border-r sm:px-8 first:sm:pl-0 last:border-r-0 last:sm:pr-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f4c868]">{title}</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-2 gap-y-3">
                {links.map((link) => (
                    <li key={link}>
                        <a href="#" className="group text-sm font-semibold text-[#e8e2d8] transition hover:text-[#e4664d]">
                            {link}
                            <span className="ml-1 inline-block transition group-hover:translate-x-1">↗</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
