import { automationExamples } from "@/lib/site";

export function ImproveExamples() {
  return (
    <div className="rounded-lg border border-line bg-paper">
      <h3 className="border-b border-line px-6 py-4 font-display text-[1.125rem] font-bold text-ink">Common fixes</h3>
      <ul>
        {automationExamples.map((example) => (
          <li key={example.id} className="grid gap-1 border-b border-line px-6 py-4 last:border-b-0 md:grid-cols-2 md:gap-8">
            <p className="text-ink">“{example.pain}”</p>
            <p className="text-body">{example.fix}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
