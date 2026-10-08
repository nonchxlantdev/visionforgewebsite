import { site, promises } from "@/lib/site";

export function Promises() {
  return (
    <section aria-labelledby="promises-title" className="border-b border-line bg-bg-2">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10">
        <p className="label text-gold">What you always get</p>
        <h2 id="promises-title" className="font-wide mt-4 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.02em] text-steel-hi">
          No surprises. No tech talk.
        </h2>
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <li key={p.title} className="bg-bg-2 p-7">
              <span aria-hidden className="block h-0.5 w-8 bg-gold" />
              <h3 className="font-wide mt-6 text-[19px] font-bold text-steel-hi">{p.title}</h3>
              <p className="mt-2.5 text-[15px] text-steel-2">{p.copy}</p>
            </li>
          ))}
        </ul>
        <p className="label mt-8 text-steel-2">{site.trustLine}</p>
      </div>
    </section>
  );
}
