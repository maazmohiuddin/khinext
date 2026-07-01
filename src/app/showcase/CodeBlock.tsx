"use client";

import { Fragment, ReactNode } from "react";

/**
 * Lightweight, dependency-free code renderer for the case study.
 * Not a full tokenizer — it colours the few categories that read well
 * on a dark surface: comments, strings, and a small keyword set.
 * Snippets are curated (short, trusted) so regex highlighting is safe.
 */

const KEYWORDS =
  /\b(import|from|export|const|let|async|await|function|return|if|else|new|type|interface|extends|as|null|true|false|void)\b/;
const BUILTINS = /\b(useState|useEffect|createClient|createServiceClient|supabase|svc|NextResponse|crypto|fetch)\b/;

function highlight(line: string, key: number): ReactNode {
  // Whole-line comment
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
    return (
      <span key={key} className="text-white/30 italic">
        {line}
      </span>
    );
  }

  // Split out string literals first, then colour tokens in the rest.
  const parts = line.split(/(".*?"|'.*?'|`.*?`)/g);
  return parts.map((part, i) => {
    if (/^(".*"|'.*'|`.*`)$/.test(part)) {
      return (
        <span key={`${key}-${i}`} className="text-emerald-300/80">
          {part}
        </span>
      );
    }
    // Colour keywords + builtins within this non-string part.
    const sub = part.split(/(\b\w+\b)/g);
    return (
      <Fragment key={`${key}-${i}`}>
        {sub.map((tok, j) => {
          if (KEYWORDS.test(tok)) return <span key={j} className="text-khi-blue-soft">{tok}</span>;
          if (BUILTINS.test(tok)) return <span key={j} className="text-[#c792ea]">{tok}</span>;
          return <Fragment key={j}>{tok}</Fragment>;
        })}
      </Fragment>
    );
  });
}

export function CodeBlock({ file, code }: { file: string; code: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050912] overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] text-white/40 truncate">{file}</span>
      </div>
      {/* code */}
      <div className="overflow-x-auto">
        <pre className="text-[12px] md:text-[12.5px] leading-[1.6] py-4">
          <code className="font-mono">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-[2.5rem_1fr] px-2">
                <span aria-hidden="true" className="text-right pr-4 text-white/20 select-none tabular-nums">
                  {i + 1}
                </span>
                <span className="text-white/85 whitespace-pre">{highlight(line, i)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
