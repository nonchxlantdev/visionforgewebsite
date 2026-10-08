import Link from "next/link";
import { pageIndex } from "@/lib/site";

export function PageIndex() {
  return (
    <nav aria-label="Explore" className="border-b border-line">
      <ul className="mx-auto grid max-w-[1240px] px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
        {pageIndex.map((item, i) => (
          <li key={item.href} className="border-line max-lg:border-b lg:border-l lg:first:border-l-0">
            <Link href={item.href} className="group block h-full py-10 transition-colors sm:px-6 lg:first:pl-0">
              <span className="font-mono text-[13px] text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-wide mt-4 block text-[24px] font-bold text-steel-hi group-hover:text-gold">{item.title}</span>
              <span className="mt-2 block text-[15px] text-steel-2">{item.copy}</span>
              <span className="label mt-5 block text-steel">{item.cta} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
