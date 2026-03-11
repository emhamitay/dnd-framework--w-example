import { useState } from "react";
import { Example1BasicDrop } from "../examples/Example1BasicDrop";
import { Example2HoverFeedback } from "../examples/Example2HoverFeedback";
import { Example2Sortable } from "../examples/Example2Sortable";
import { Example3Mixed } from "../examples/Example3Mixed";
import { Example4MultiGroup } from "../examples/Example4MultiGroup";

const TABS = [
  {
    id: "ex1",
    label: "1 · Drop with callback",
    sublabel: "Simplest possible drag + drop",
    Component: Example1BasicDrop,
  },
  {
    id: "ex2",
    label: "2 · Hover feedback",
    sublabel: "React to what's being dragged",
    Component: Example2HoverFeedback,
  },
  {
    id: "ex3",
    label: "3 · Sortable list",
    sublabel: "Reorder items by dragging",
    Component: Example2Sortable,
  },
  {
    id: "ex4",
    label: "4 · Drag into sortable",
    sublabel: "Combine drop zones with sorting",
    Component: Example3Mixed,
  },
  {
    id: "ex5",
    label: "5 · Multiple groups",
    sublabel: "Independent zones, different callbacks",
    Component: Example4MultiGroup,
  },
];

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-500 font-medium">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white transition-colors font-medium cursor-pointer px-2 py-1 rounded hover:bg-slate-800"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-5 text-sm text-slate-300 overflow-auto font-mono leading-relaxed flex-1">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Examples() {
  const [activeTab, setActiveTab] = useState("ex1");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <section id="examples" className="bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
          Examples
        </h2>
        <p className="text-slate-500 text-center mb-12 text-lg max-w-xl mx-auto">
          From a single drop to complex multi-group interactions — each example is live and interactive.
        </p>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col text-left px-4 py-3 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs font-normal mt-0.5 ${activeTab === tab.id ? "text-indigo-200" : "text-slate-400"}`}>
                {tab.sublabel}
              </span>
            </button>
          ))}
        </div>

        {/* Active example */}
        <active.Component CodeBlock={CodeBlock} />
      </div>
    </section>
  );
}
