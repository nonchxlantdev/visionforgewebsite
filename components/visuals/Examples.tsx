/** Invented example screens: they show what a client gets without claiming a real client. */

export function PhoneExample() {
  const slots = [
    { time: "9:00", service: "Haircut & style", open: true },
    { time: "10:30", service: "Manicure", open: false },
    { time: "1:00", service: "Colour treatment", open: true },
    { time: "3:30", service: "Facial", open: true },
  ];
  return (
    <div className="mx-auto w-[15.5rem] rounded-[2.2rem] border border-chrome/20 bg-[#0f0d0b] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,90,31,0.12)]" aria-hidden>
      <div className="overflow-hidden rounded-[1.7rem] bg-[#f6f2ea] text-[#1c1206]">
        <div className="flex items-center justify-between bg-[#1c1206] px-4 pt-5 pb-4 text-[#f6f2ea]">
          <div>
            <p className="font-display text-xl leading-none font-bold uppercase">Your Salon</p>
            <p className="mt-1 text-[10px] opacity-70">Belize City · Open today</p>
          </div>
          <span className="rounded-full bg-molten px-2 py-1 text-[9px] font-semibold text-on-molten">Book</span>
        </div>
        <div className="px-3 py-3">
          <p className="px-1 text-[10px] font-semibold tracking-wide uppercase opacity-60">Pick a time · Thursday</p>
          <ul className="mt-2 space-y-1.5">
            {slots.map((slot) => (
              <li
                key={slot.time}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-[11px] ${
                  slot.open ? "bg-white shadow-sm" : "bg-[#e8e2d8] opacity-60"
                }`}
              >
                <span>
                  <span className="font-semibold">{slot.time}</span> · {slot.service}
                </span>
                <span className={slot.open ? "font-semibold text-[#c2410c]" : ""}>{slot.open ? "Book" : "Taken"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-lg bg-[#1c1206] py-2 text-center text-[11px] font-semibold text-[#f6f2ea]">
            Confirm booking
          </div>
        </div>
      </div>
    </div>
  );
}

export function LaptopExample() {
  const bars = [42, 58, 50, 71, 64, 82, 76];
  const checks = [
    { label: "Morning safety inspection", done: true },
    { label: "Stock count, warehouse B", done: true },
    { label: "Vehicle checklist #14", done: false },
  ];
  return (
    <div className="mx-auto w-full max-w-[26rem]" aria-hidden>
      <div className="rounded-t-xl border border-chrome/20 bg-[#0f0d0b] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,90,31,0.12)]">
        <div className="overflow-hidden rounded-md bg-[#f6f2ea] p-3 text-[#1c1206]">
          <div className="flex items-center justify-between">
            <p className="font-display text-base leading-none font-bold uppercase">Operations · Today</p>
            <span className="rounded bg-[#1c1206] px-1.5 py-0.5 text-[8px] text-[#f6f2ea]">Live</span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {[
              ["Open jobs", "18"],
              ["Done today", "42"],
              ["On time", "96%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded bg-white px-2 py-1.5 shadow-sm">
                <p className="text-[8px] opacity-60">{k}</p>
                <p className="font-display text-lg leading-none font-bold">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-[1.1fr_1fr] gap-2">
            <div className="flex h-20 items-end gap-1 rounded bg-white p-2 shadow-sm">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-sm ${i === bars.length - 2 ? "bg-[#ea580c]" : "bg-[#f2b33d]"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <ul className="space-y-1 rounded bg-white p-2 text-[8px] shadow-sm">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center gap-1">
                  <span
                    className={`inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-sm border ${
                      c.done ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#1c1206]/40"
                    }`}
                  >
                    {c.done ? "✓" : ""}
                  </span>
                  <span className={c.done ? "line-through opacity-50" : ""}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto h-2.5 w-[108%] -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-[#3a3633] to-[#171310]" />
    </div>
  );
}
