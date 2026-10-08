import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { pageIndex } from "@/lib/site";

export function PageIndex() {
  return (
    <nav aria-labelledby="explore-title" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10">
        <p id="explore-title" className="label text-gold">
          Explore
        </p>
        <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pageIndex.map((item, i) => (
            <li key={item.href} className="bg-bg">
              <Link
                href={item.href}
                className="group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-bg-2 focus-visible:bg-bg-2 sm:p-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="font-mono text-[13px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-wide mt-5 text-[24px] leading-none font-bold text-steel-hi">{item.title}</span>
                <span className="mt-3 flex-1 text-[15px] text-steel-2">{item.copy}</span>
                <span className="label mt-8 inline-flex items-center gap-2 text-steel transition-colors group-hover:text-gold">
                  {item.cta}
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
