import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// @ts-ignore
SyntaxHighlighter.registerLanguage("tsx", tsx);
// @ts-ignore
SyntaxHighlighter.registerLanguage("bash", bash);

// Tweak one-dark: make JSX component tags (PascalCase) stand out more,
// and use VS Code-style green for comments
const theme = {
  ...oneDark,
  "class-name": { color: "#62aeef" },
  comment: { color: "#6A9955", fontStyle: "italic" },
  prolog: { color: "#6A9955", fontStyle: "italic" },
  doctype: { color: "#6A9955", fontStyle: "italic" },
  cdata: { color: "#6A9955", fontStyle: "italic" },
};

export function CodeBlockReact({
  code,
  label,
  stretch = false,
}: {
  code: string;
  label: string;
  stretch?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = label === "Terminal" ? "bash" : "tsx";

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-800 ${
        stretch ? "h-full flex flex-col" : ""
      }`}
      style={{ background: "#282c34" }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-500 font-medium">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white transition-colors font-medium cursor-pointer px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      {/* @ts-ignore */}
      <SyntaxHighlighter
        language={language}
        style={theme}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "transparent",
          fontSize: "0.8125rem",
          lineHeight: "1.7",
          ...(stretch ? { flex: 1, overflow: "auto" } : { overflowX: "auto" }),
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
