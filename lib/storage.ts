type Kind = "local" | "session";

function store(kind: Kind): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStore(kind: Kind, key: string): string | null {
  try {
    return store(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStore(kind: Kind, key: string, value: string): void {
  try {
    store(kind)?.setItem(key, value);
  } catch {
    // Storage blocked or full: the site works without it.
  }
}

/** Inline, pre-paint: marks repeat visits so the intro overlay stays hidden. */
export const ignitionScript = `try{if(sessionStorage.getItem("vf-ignited"))document.documentElement.dataset.ignited="1"}catch(e){}`;
